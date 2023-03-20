import express from 'express'
import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { Network, Alchemy } from "alchemy-sdk";
import Post from '../mongodb/models/post.js'
import { Configuration, OpenAIApi } from 'openai'
import { NFTStorage, File } from 'nft.storage'

dotenv.config()

const router = express.Router();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({})
        res.status(200).json({ success: true, data: posts })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

router.route('/nftData').get(async (req, res) => {

    const settings = {
        apiKey: "Mm0Lzxa6i2fwV1eu3p_EC4D_rS5Ob9uj",
        network: process.env.ENV ? Network.MATIC_MUMBAI : Network.MATIC_MAINNET, // Replace with your network.
    };
    const alchemy = new Alchemy(settings);
    let posts;
    const contractAddress = process.env.CONTRACT_ADDRESS

    try {
        await alchemy.nft
            .getNftsForContract(contractAddress)
            .then((e) => { posts = e });
        const json = posts["nfts"]
        res.status(200).json({ data: json })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})



router.route('/').post(async (req, res) => {
    try {
        const { name, prompt, photo } = req.body
        const photoUrl = await cloudinary.uploader.upload(photo)
        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url
        })
        res.status(201).json({ success: true, data: newPost })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

export async function urltoFile(url, filename, mimeType) {
    return (fetch(url)
        .then(function (res) { return res.arrayBuffer(); })
        .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
}



router.route('/nft').post(async (req, res) => {

    try {
        const { name, prompt, photo } = req.body

        const imago = photo
        const api = process.env.NFT_STORAGE
        const client = new NFTStorage({ token: api })
        const file = await urltoFile(imago, `${name ? name : "image"}.jpeg`, { "type": "image/*" })
        console.log('get nfts')
        const { ipnft } = await client.store({
            image: file,
            name: name,
            description: prompt
        })
        const ipfsUrl = `https://ipfs.io/ipfs/${ipnft}/metadata.json`
        console.log(ipfsUrl)
        res.status(200).json({ success: true, data: ipfsUrl })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
})





export default router