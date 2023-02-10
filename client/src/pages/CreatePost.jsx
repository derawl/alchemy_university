import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { preview } from '../assets'
import { downloadImage, getRandomPrompt, timeStampToDate, saveBase64AsFile } from '../utils'
import { FormField, Loader } from '../components'
import { useEtherBalance, useEthers, useContractFunction, useCall, Mumbai } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import subABI from '../abis/subscriptionAbi.json'
import { subScriptionContractAddress, chainMaps, urltoFile } from '../utils'
import { utils } from 'ethers'
import Modal from '../components/Modal'
import FileSaver from 'file-saver'
import { base_url } from '../utils'
import { UserContext } from '../context/UserContext'
import { NFTStorage, File } from 'nft.storage'


const CreatePost = () => {
    const navigate = useNavigate()
    const { account, chainId, switchNetwork } = useEthers()
    const [accountData, setAccountData] = useContext(UserContext)

    const subscriptionValidInterface = new utils.Interface(subABI)
    const contract = new Contract(subScriptionContractAddress, subscriptionValidInterface)
    const { state: mintState, send: mintSend, resetState: resetMintState } = useContractFunction(contract, "mint", { transactionName: "Mint" })

    const [showModal, setShowModal] = useState(false);
    const [url, setUrl] = useState("")
    const [form, setform] = useState({
        name: '',
        prompt: '',
        photo: ''
    })

    const generateNFT = async (image) => {
        setUrl("")
        setloading(true)
        const ipfsMetaData = await uploadToIPFS2()
        console.log(ipfsMetaData)
        //mint
        await mintSend(ipfsMetaData)
        console.log(mintState.status)
    }

    useEffect(() => {
        if (mintState.status == "Success") {
            console.log(mintState.status)
            mintState.receipt.logs[0].topics
            const tokenId = mintState.receipt.logs[0].topics[3]
            const url = chainMaps[chainId]
            console.log(`${url}${parseInt(tokenId)}`)
            setUrl(`${url}${parseInt(tokenId)}`)
            setloading(false)
        }
    }, [mintState])

    const uploadToIPFS2 = async () => {
        try {
            const response = await fetch(`${base_url}/api/v1/post/nft`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })

            const res = await response.json()
            console.log(res.data)
            return res.data
        } catch (err) {
            alert(err)
        } finally {
            setloading(false)
        }
    }

    const uploadToIPFS = async (imago) => {
        //creates instance to NFT storage
        const api = ""
        const client = new NFTStorage({ token: api })
        const file = await urltoFile(imago, `${form.name ? form.name : "image"}.jpeg`, { "type": "image/jpeg" })
        const { ipnft } = await client.store({
            image: file,
            name: form.name,
            description: form.prompt
        })
        const ipfsUrl = `https://ipfs.io/ipfs/${ipnft}/metadata.json`
        return ipfsUrl
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.prompt && form.photo) {
            setloading(true)
            try {
                const response = await fetch(`${base_url}/api/v1/post`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                })

                await response.json()
                navigate('/')
            } catch (err) {
                alert(err)
            } finally {
                setloading(false)
            }
        } else {
            alert("Please enter a prompt")
        }
    }
    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const handleSupriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt)
        setform({ ...form, prompt: randomPrompt })
    }

    async function fetchAccount() {
        const response = await fetch(`${base_url}/api/v1/accounts`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account: '0x8478F8c1d693aB4C054d3BBC0aBff4178b8F1b0B' })
        })
        if (response.ok) {
            const result = await response.json()

            setAccountData(result.data)
            console.log(result.data)
        }
    }



    const generateImage = async () => {
        setUrl("")
        if (accountData == null) {
            alert('out of credits')
            setShowModal(true)
            return
        } else if (accountData.credits <= 0 || accountData.credits == undefined) {
            alert('out of credits')
            setShowModal(true)
            return
        }
        if (form.prompt) {
            try {
                setgeneratingImg(true)
                const response = await fetch(`${base_url}/api/v1/dalle`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ prompt: form.prompt, from: account })
                })
                const data = await response.json()
                setform({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })
                fetchAccount()
            } catch (error) {
                alert(error)
            } finally {
                setgeneratingImg(false)
            }
        } else {
            alert("Please enter a prompt")
        }
    }

    const [generatingImg, setgeneratingImg] = useState(false)
    const [loading, setloading] = useState(false)



    return (
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='font-extra-bold text-[#222328] text-[32px]'>Create</h1>
                <p className='mt-2 text-[#666e75] text-[14px] max-w-[500px]'>Create imaginative a visually stunning AI generated images</p>
            </div>
            <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-5'>
                    <FormField
                        labelName='Name'
                        type='text'
                        name='name'
                        placeholder='SK NFT'
                        value={form.name}
                        handleChange={handleChange}
                    />

                    <FormField
                        labelName='Prompt'
                        type='text'
                        name='prompt'
                        placeholder='An rockstack staging live on the moon'
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe={true}
                        handleSupriseMe={handleSupriseMe}

                    />



                    <div className='relative bg-gray-50 border border-gray-300 tetx-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 h-64 flex justify-center items-center p-3'>
                        {form.photo ? (
                            <div>
                                <img id="image" onClick={() => saveAs(form.photo, 'Dalle Image')} src={form.photo} alt={form.prompt} className='w-full h-full object-contain' />
                            </div>
                        ) : (
                            <img src={preview} alt={preview} className='w-9/12 h-9/12 opacity-40 object-contain' />
                        )}


                        {generatingImg && (
                            <div className='absolute inset-0 z-0 flex justify-center items-center bg-rgba(0,0,0, 0.5) rounded-lg'>
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>

                {form.photo && (

                    <a onClick={() => saveAs(form.photo, 'Dalle Image')} style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }} className='py-4'>Download</a>

                )}

                <div className='mt-5 flex gap-5'>
                    {false ? <div><button onClick={() => { setShowModal(!showModal) }} type='button' className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center' >
                        {'Buy'}
                    </button></div> : <button type='button' className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center' onClick={generateImage}>
                        {generatingImg ? 'Generating...' : 'Generate'}
                    </button>}
                </div>



                <div className='mt-10'>
                    <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you can share it with others in the community</p>
                    <button type='button' className='text-white mt-3 bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center' onClick={() => generateNFT(form.photo)}>
                        {loading ? <Loader /> : 'Mint as NFT'}
                    </button>
                </div>

            </form>
            <br />
            {url.length > 0 && <a style={{ color: "blue", textDecoration: "underline" }} className='' href={url}>View NFT on Opensea</a>}
            <Modal setShowModal={setShowModal} showModal={showModal} />
        </section>
    )
}

export default CreatePost