import express from 'express'
import * as dotenv from 'dotenv'
import Account from '../mongodb/models/account.js';



dotenv.config()

const router = express.Router();

router.route('/create').post(async (req, res) => {
    const { acc } = req.body
    const account = await Account.findOne({ account: acc })
    if (!account) {
        Account.create({
            account: acc
        })
        res.status(200).json({ success: true, message: "account created" })
    }
    res.status(401).json({ success: true, message: "Account already exists" })
})
router.route('/').post(async (req, res) => {
    const { acc } = req.body
    try {
        let account = await Account.findOne({ account: acc })
        if (account == null) {
            await Account.create({
                account: acc,
                time: new Date()
            })
            account = await Account.findOne({ account: acc })
        }
        console.log('account')
        console.log(account)
        res.status(200).json({ success: true, data: account })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, data: null })
    }
})

export default router