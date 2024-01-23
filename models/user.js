import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }

})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)

export default User