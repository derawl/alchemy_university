import mongoose from "mongoose";

// create post schema
const Account = new mongoose.Schema({
    account: { type: String, required: true },
    time: { type: Date, required: true },
    generated: { type: Number, required: true, default: 0 },
    credits: { type: Number, required: true, default: 0 },
    photo: { type: String, required: false, default: '' }
})


const AccountSchema = mongoose.model('Account', Account)

export default AccountSchema;