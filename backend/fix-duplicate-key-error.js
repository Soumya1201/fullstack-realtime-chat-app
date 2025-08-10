import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chat_db";

async function fixDuplicateKeyError() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check current indexes
        const indexes = await User.collection.indexes();
        console.log('Current indexes:', indexes);

        // Drop the problematic unique index on emails (if it exists)
        try {
            await User.collection.dropIndex('emails_1');
            console.log('Dropped emails_1 index');
        } catch (error) {
            console.log('emails_1 index not found or already dropped');
        }

        // Drop the unique index on email (if it exists with wrong name)
        try {
            await User.collection.dropIndex('email_1');
            console.log('Dropped email_1 index');
        } catch (error) {
            console.log('email_1 index not found or already dropped');
        }

        // Check for users with null emails
        const nullEmailUsers = await User.find({ email: null });
        console.log(`Found ${nullEmailUsers.length} users with null emails`);

        // Remove users with null emails if any
        if (nullEmailUsers.length > 0) {
            await User.deleteMany({ email: null });
            console.log('Removed users with null emails');
        }

        // Create the correct unique index on email field
        await User.collection.createIndex({ email: 1 }, { unique: true });
        console.log('Created unique index on email field');

        // Verify the fix
        const newIndexes = await User.collection.indexes();
        console.log('Updated indexes:', newIndexes);

        console.log('Fix completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing duplicate key error:', error);
        process.exit(1);
    }
}

fixDuplicateKeyError();
