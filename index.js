import express from  'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/user',userRouter)


{/*app.get('/', (req, res) => {
    res.send('Task Management API');
  });*/}
app.use((req,res,next)=>{
    let token=req.header("Authorization")
    
    if(token!=null){
        token=token.replace('Bearer ','')
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if(err){
                res.json({error:err})
            }else{
                req.user=decoded;
            }
        })
        
    }
    next()
    
})
let mongoUrl=process.env.MONGO_URL


mongoose.connect(mongoUrl)


let connection=mongoose.connection;

connection.once('open',()=>{
    console.log("Connected")

})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})
app.use('/api/task',taskRouter)
app.use('/api/task/byCategory',taskRouter)
app.use("/api/category", categoryRouter);