import express  from "express";
const app = express();

import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import postRouter from "./routes/posts.js";
import commentRouter from "./routes/comments.js";
import likeRouter from "./routes/likes.js";
import RelationshipRouter from "./routes/relationships.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

//middlewares
app.use((req,res,next)=>{
      res.header("Access-Control-Allow-Credentials", true)
      next()
})
app.use(express.json());
app.use(cors({
      origin: 'http://localhost:3000',
}));
app.use(cookieParser());

const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
      },
});
    
    const upload = multer({ storage: storage })


app.post("/api/upload", upload.single("file"), (req,res) => {
      const file = req.file;
      res.status(200).json(file.filename)
})
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)
app.use("/api/likes", likeRouter)
app.use("/api/relationships", RelationshipRouter)

app.listen(3001,()=>{
console.log("API working")
})