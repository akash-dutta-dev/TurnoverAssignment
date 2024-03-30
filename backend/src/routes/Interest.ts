import express, {Request, Response} from "express"
import dataSource from "../config/dataSource";
import { Interests } from "../model/Interests";
import { User } from "../model/User";
import verifyToken from "../middleware/Auth";
import { getUserSelectedInterests } from "../service/Interest";
const router = express.Router()



router.get("/getInterest", verifyToken, async (req: Request, res: Response) => {
    try {
        const pageParam = req.query.page;
        const page: number = typeof pageParam === 'string' ? parseInt(pageParam) : 1;

        const sizeParam = req.query.size;
        const size = typeof sizeParam === 'string' ? parseInt(sizeParam) : 10;

        const interestsRepository = dataSource.getRepository(Interests);
        const interests = await interestsRepository.find({
            skip: (page - 1) * size,
            take: size,
        });

        const totalCount = await interestsRepository.count();
        const totalPages = Math.ceil(totalCount / size);

        const userSelectedInterests = await getUserSelectedInterests(parseInt(req.userId, 10));

        const userInterests = interests.map((interest) => ({
            id: interest.id,
            interest: interest.interest,
            checked: userSelectedInterests.includes(interest.id),
          }));

        res.status(200).json({ userInterests, totalPages  });

      } catch (error) {
        res.status(500).json({message: "Some error occured"})
      }
})

router.post("/selectInterest", verifyToken, async (req: Request, res: Response) => {
    try {
        const { selectedInterestId } = req.body;

        // Retrieve User and Interest Instances
        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({
            relations: {
              interests: true,
            },
            where: { id: parseInt(req.userId, 10) }
          });

        const interestsRepository = dataSource.getRepository(Interests);
        const interest = await interestsRepository.findOne({
            where: { id: parseInt(selectedInterestId, 10) }
          });

        if (user && interest) {
            if (!user.interests) {
                user.interests = [interest];
            } else {
                user.interests.push(interest);
            }

            await userRepository.save(user);
        }

        res.status(200).json({ interest, user });

      } catch (error) {
        res.status(500).json({message: "Some error occured"})
      }
})


router.post("/unselectInterest", verifyToken, async (req: Request, res: Response) => {
    try {
        const { selectedInterestId } = req.body;

        // Retrieve User and Interest Instances
        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: parseInt(req.userId, 10) },
            relations: ['interests'],
          })

        if (user) {

            if (user.interests) {
                user.interests = user.interests.filter((interest) => interest.id !== selectedInterestId);
            }

            await userRepository.save(user);
        }

        res.status(200).json({user});

      } catch (error) {
        res.status(500).json({message: "Some error occured"})
      }
})



const enableSeedInterest = false;
router.get("/seedInterest", async (req: Request, res: Response) => {

    if (!enableSeedInterest) {
        return res.status(404).json({ message: "Endpoint disabled" });
    }
    const interestsData = [  "game",  "cricket",  "shoes",  "t-shirt",  "cooking",  "reading",  "traveling",  "photography",  "music",  "painting",  "gardening",  "coding",  "swimming",  "yoga",  "hiking",  "biking",  "camping",  "dancing",  "writing",  "sketching",  "fishing",  "skiing",  "snowboarding",  "surfing",  "skateboarding",  "drawing",  "singing",  "playing piano",  "playing guitar",  "watching movies",  "listening to podcasts",  "learning new languages",  "volunteering",  "fashion",  "makeup",  "sports",  "fitness",  "meditation",  "trivia",  "board games",  "video games",  "coffee",  "tea",  "wine tasting",  "craft beer",  "cooking classes",  "fitness classes",  "online courses",  "book clubs",  "gardening clubs",  "hiking clubs",  "dancing classes",  "yoga retreats",  "pilates",  "boxing",  "kickboxing",  "karate",  "taekwondo",  "jujitsu",  "aikido",  "muay thai",  "basketball",  "football",  "soccer",  "baseball",  "volleyball",  "tennis",  "golf",  "rugby",  "cricket",  "badminton",  "table tennis",  "bowling",  "billiards",  "darts",  "swimming lessons",  "scuba diving",  "snorkeling",  "kayaking",  "canoeing",  "rafting",  "rock climbing",  "bouldering",  "mountain biking",  "road cycling",  "ski lessons",  "snowboard lessons",  "surf lessons",  "skateboarding lessons",  "ice skating",  "roller skating",  "baking",  "cooking competitions",  "food festivals",  "wine festivals",  "music festivals",  "art galleries",  "museums",  "theater",  "concerts",  "live music",  "karaoke",  "game nights",  "pub quizzes",  "picnics",  "barbecues",  "beach days",  "lake trips",  "campfire nights"];

    try {
        let interestsRepository = dataSource.getRepository(Interests)
    
        const interestsEntities = interestsData.map((interest) => {
          const newInterest = new Interests();
          newInterest.interest = interest;
          return newInterest;
        });
    
        await interestsRepository.save(interestsEntities);
        res.status(200).json({message: "Interests inserted successfully."})
        console.log('Interests inserted successfully.');
      } catch (error) {
        res.status(500).json({message: "Some error occured"})
        console.error('Error inserting interests:', error);
      }
})

export default router;