import express from 'express';
import {loginUser, registerUser,getAllUsers,deleteUser,updateUser} from'../controllers/UserController.js';

const userRouter=express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/',getAllUsers)
userRouter.delete("/:id", deleteUser);
userRouter.put('/:id', updateUser);




export default userRouter

