import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import Account from '../mongodb/models/account.js'
dotenv.config()



const router = express.Router();

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
})

const openai = new OpenAIApi(configuration)

router.route('/').get((req, res) => {
    res.send('hello')
})

router.route('/').post(async (req, res) => {
    const { from } = req.body
    const account = await Account.findOne({ account: from })
    if (!account) {
        res.status(500).send("Does not exists")
        return
    }
    if (account.credits - parseInt(process.env.CREDIT_PER_IMAGE) < 0) {
        res.status(500).json({ message: "Out of credits" })
        return
    }
    try {
        const { prompt, from } = req.body
        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
        })

        const image = aiResponse.data.data[0].b64_json
        await Account.updateOne({ account: from }, { $set: { credits: account.credits - parseInt(process.env.CREDIT_PER_IMAGE) } })

        console.log(image)
        res.status(200).json({ photo: image })
    } catch (error) {
        console.log(error)
        res.status(500).send(error?.response.data.error.message)

    }
})

export default router