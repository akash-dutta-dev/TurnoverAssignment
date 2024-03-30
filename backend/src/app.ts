import "reflect-metadata"
import cors from 'cors'
import "dotenv/config";
import path from 'path';
import express, {Request, Response} from 'express'
import cookieParser from "cookie-parser"
import dataSource from "./config/dataSource";
import userRoutes from "./routes/User"
import interestRoutes from "./routes/Interest"


const PORT = 3000
const app = express();
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))

dataSource.initialize().then(()=>{
    console.log("DataSource Sucessfully Connected With The Database!!!");
}).catch((err)=>{
    console.log("DataSource Connection Failed" , err);
})

app.get("/test", (res: Response, req: Request) => {
    res.status(200).json("Hello World")
})

app.use("/api/user",     userRoutes)
app.use("/api/interest", interestRoutes)

app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.listen(PORT, ()=> {
    console.log(`Server has started on port ${PORT}`)
})