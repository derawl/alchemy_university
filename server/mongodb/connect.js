import mongoose from "mongoose";

const connectDB = async (url) => {
    // useful when working with search functionality
    mongoose.set('strictQuery', true);
    mongoose.connect(url).then(() => {
        console.log('Connected')
    }).catch((err) => {
        console.log(err)
    })
}

export default connectDB