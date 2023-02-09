import mongoose from "mongoose";

// create post schema
const Receipts = new mongoose.Schema({
    hash: { type: String, required: true },
    time: { type: Date, required: true },

})


const ReceiptsSchema = mongoose.model('Receipts', Receipts)

export default ReceiptsSchema;