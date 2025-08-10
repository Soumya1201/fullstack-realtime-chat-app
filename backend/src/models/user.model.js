import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            sparse: true, // Allow multiple null values
            trim: true,
            lowercase: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
    }, 
    {timestamps: true}
);

// Email index is already handled by the unique: true in schema
// No need for duplicate index definition

const User = mongoose.model("User", userSchema);

export default User;
