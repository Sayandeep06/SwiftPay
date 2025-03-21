import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config();


//@ts-ignore
const URL: string= process.env.URL as string;
mongoose.connect(URL);

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    }
})

const bankSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

export const User = mongoose.model('User', userSchema);
export const Account = mongoose.model("Account", bankSchema);
