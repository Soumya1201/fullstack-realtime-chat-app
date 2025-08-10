import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// signup controller
export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {

        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Please provide a valid email address"});
        }

        if(password.length < 6)
        {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        // Check if email already exists (case-insensitive)
        const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${email}$`, 'i') } 
        });
        
        if(user) return res.status(400).json({message: "Email already exists"});

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            password: hashPassword
        });

        if(newUser) {
            // generate jwt token here
            await newUser.save();
            generateToken(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt,
            })

        } else {
            res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) {
        console.error("Error in signup controller: ", error);
        
        // Handle duplicate key error specifically
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists",
                error: "Duplicate email address"
            });
        }
        
        res.status(500).json({
            message: "Internal Server Error", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// login controller
export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        
        if(!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }

        const user = await User.findOne({email: email.toLowerCase().trim()});
        if(!user)
        {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid Credentials"});
        }
        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
        })
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
};

// logout controller
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message:"Logged out successful"})
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
};

// update profile
export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message: "Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, 
            {new: true}
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update profile controller: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// checking authentication
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error on checkAuth controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}
