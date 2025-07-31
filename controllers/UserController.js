import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config;

export function registerUser(req,res){
    
        const data=req.body;//request take to data variable
        data.password=bcrypt.hashSync(data.password,10);
        const newUser=new User(data);
        newUser.save().then(()=>{
        res.json({msg:"User Registered"})
        }).catch((err)=>{
            res.json({msg:err.message})
        })

}


export function loginUser(req,res){
    const data=req.body;
    
    User.findOne({email:data.email}).then((user)=>{
        if(user==null){
            res.json({msg:"user not found"})
        }else{
            const isPasswordCorrect=bcrypt.compareSync(data.password,user.password);
            console.log(isPasswordCorrect)
            if(isPasswordCorrect){
                const token=jwt.sign({
                  _id: user._id,
                  email:user.email,
                  username:user.username,
                  role:user.role,
                  status:user.status,
                  profilePicture:user.profilePicture
                },process.env.JWT_SECRET_KEY)
                res.json({msg:"Login success",token:token,user:user})
            }else{
                res.json({msg:"Incorrect Password"})
            }
        }
    })
}
export function getAllUsers(req, res) {
    User.find().then((result) => {
      res.json(result);
    });
  }
 // Delete user by MongoDB _id
 	
 export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, status } = req.body;

  try {
    // Find user by MongoDB _id
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;

    // Hash password if provided
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ msg: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating user", error: err.message });
  }
}


