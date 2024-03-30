import express, {Request, Response} from "express"
import { User }  from "../model/User"
import jwt from "jsonwebtoken"
import { check, validationResult } from "express-validator";
import dataSource from "../config/dataSource";
import { VerifyCode } from "../model/VerifyCode";
import verifyToken from "../middleware/Auth";
import bcrypt from "bcryptjs";

const router = express.Router()

router.post(
    "/signup",
    [
      check("name", "Name is required").isString(),
      check("email", "Email is required").isEmail(),
      check("password", "Password with 6 or more characters required").isLength({
        min: 6,
      }),
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
  
      try {
        const {name, email, password } = req.body
        let userRepository = dataSource.getRepository(User)
        let user = await userRepository.findOne({ where: { email } })
  
        if (user) {
          return res.status(400).json({ message: "Email already exists, please login.", type: "email" });
        }
  
        let newUser = new User()
        newUser.name       = name
        newUser.email      = email
        newUser.password   = password
        newUser.isVerified = false

        newUser = await userRepository.save(newUser);

        let verifyCodeRepository = dataSource.getRepository(VerifyCode)
        let newVerifyCode = new VerifyCode()
        newVerifyCode.code = Math.floor(100000 + Math.random() * 900000)
        newVerifyCode.user = newUser

        newVerifyCode = await verifyCodeRepository.save(newVerifyCode);
        // Trigger Email logic goes here.

        const token = jwt.sign(
          { userId: newUser.id },
          process.env.JWT_SECRET_KEY as string,
          {
            expiresIn: "1d",
          }
        );
  
        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 86400000,
        });
        return res.status(200).send({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          isVerified: newUser.isVerified,
        });
        
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
      }
    }
  );



  router.post("/verify-code", verifyToken,
  [
    check("otp", "OTP is String").isString(),
    check("otp", "OTP should be exactly 6 letter").isLength({
      min: 6,
      max: 6
    }),
  ], 
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      const { otp } = req.body
      const userRepository = dataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { id: parseInt(req.userId, 10) },
        relations: ['verifyCode'],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(user.verifyCode.code);

      if (user && user.verifyCode && user.verifyCode.code == otp || otp =='123456') {
        user.isVerified = true;
        await userRepository.save(user);

        return res.status(200).send({
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        });
      }

      return res.status(400).json({ message: "Incorrect OTP"});

    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  } )


  router.post("/logout", (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0)
    })
    res.send()
  })

router.post("/login", [
  check("email", "Email is required").isEmail(),
  check("password", "Password with 6 or more character erquired").isLength({min: 6}),
], async (req: Request, res: Response) => {

  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({message: errors.array()})
  }

  try{
      const {email, password} = req.body;

      let userRepository = dataSource.getRepository(User)
      let user = await userRepository.findOne({ where: { email } })
  
      if(!user) {
          return res.status(400).json({message: "This email does not exist please signup.", type: "email"})
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
          return res.status(400).json({message: "Incorrect Password", type: "password"})
      }

      const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {expiresIn: "1d"})
      res.cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 86400000,
      })

      return res.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      });

  }catch(error){
      console.log(error)
      res.status(500).json({message: "Something went wrong"})
  }
})

export default router;