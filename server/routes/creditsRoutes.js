// verifies a trasnaction id and generates a number of credits based on that id

import express from 'express'
import * as dotenv from 'dotenv'
import { ethers } from 'ethers'
import { Network, Alchemy } from 'alchemy-sdk';
import Account from '../mongodb/models/account.js';
import Receipts from '../mongodb/models/receipts.js';
dotenv.config()

const settings = {
    apiKey: process.env.ALCHEMY_API,
    network: process.env.ENV ? Network.MATIC_MUMBAI : Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);



const router = express.Router();

const checkIfUsed = async (hash) => {
    const rec = await Receipts.findOne({ hash: hash })
    return rec
}

const checkAccountExists = async (account) => {
    const rec = await Account.findOne({ account: account })
    return rec
}

router.route('/').get(async (req, res) => {
    const go = await alchemy.core.getTransactionReceipt("0x9a08d99aa9948f17c3aa047fcc4970afd8ad9862647a749f8fae26fe2bbaa40f")
    console.log(go.logs[1].topics)
    res.send(go.logs[1].topics[2])
})

router.route('/').post(async (req, res) => {
    const { hash } = req.body
    const go = await alchemy.core.getTransactionReceipt(hash)
    const check = await checkIfUsed(hash)
    const contractAddress = process.env.CONTRACT_ADDRESS
    console.log(check)
    if (go.to.toLowerCase() != contractAddress.toLowerCase()) {
        res.send("Invalid receipt")
    }

    if (check != null) {
        res.send("Invalid receipt")
    } else {
        const time = await alchemy.core.getBlock(go.blockNumber)
        const timeStamp = new Date(time.timestamp * 1000)
        const timeRange = new Date(Date.now() + 1000 * (60 * 5))
        const checkAccount = await checkAccountExists(go.from)
        if (checkAccount == null) {
            await Account.create({
                account: go.from,
                time: new Date()
            })
            console.log('created')
        }

        if (timeStamp < timeRange) {
            let hash = go.transactionHash
            const numberOfCredits = checkAccount.credits + parseInt(go.logs[1].topics[2])
            //create credit
            try {
                const newPost = await Receipts.create({
                    hash,
                    time: timeStamp
                }).then(async () => {
                    const newCredtis = await Account.updateOne({ account: go.from }, { $set: { credits: numberOfCredits } })
                    console.log(newCredtis)
                })
            } catch (e) {

            }
            //archive transaction
        } else {
            console.log("invalid receipt")
        }
        console.log(timeStamp)
        console.log(timeRange)
        console.log(go.from)

        res.send('hello')
    }

})

export default router