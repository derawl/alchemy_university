import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js'
import dalle from './routes/dalleRoutes.js'
import creditsRoutes from "./routes/creditsRoutes.js"
import accountRoutes from './routes/accountRoutes.js'
import { checkOrigin } from './middleware/index.js';


dotenv.config();

const app = express();



app.use(cors())
app.use(checkOrigin)
app.use(express.json({ limit: '50mb' }))
app.use('/api/v1/post', postRoutes)
app.use('/api/v1/dalle', dalle)
app.use('/api/v1/credits', creditsRoutes)
app.use('/api/v1/accounts', accountRoutes)


app.get('/', async (req, res) => {
    res.send('Hello from Dalle')
})

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URL)
        app.listen(8000, () => console.log("Server has started on port http://localhost:8000/"))
    } catch (err) {
        console.log(err)
    }

}

startServer()