import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chat_db";

async function resetDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop the users collection if it exists
        try {
            await User.collection.drop();
            console.log('Dropped users collection');
        } catch (error) {
            console.log('Users collection does not exist yet');
        }

        // Create the collection with proper indexes
        await User.createCollection();
        console.log('Created users collection');

        // Create the correct unique index on email field
        await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
        console.log('Created unique sparse index on email field');

        console.log('Database reset completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
}

resetDatabase();
