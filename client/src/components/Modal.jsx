import { useState, useContext, useEffect } from "react";
import { useEtherBalance, useEthers, useContractFunction, useCall } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import subABI from '../abis/subscriptionAbi.json'
import { subScriptionContractAddress, subscriptionFee } from '../utils'
import { UserContext } from "../context/UserContext";
import { base_url } from "../utils";

export default function Modal({ showModal, setShowModal }) {

    const subscriptionValidInterface = new utils.Interface(subABI)
    const [accountData, setAccountData] = useContext(UserContext)

    const contract = new Contract(subScriptionContractAddress, subscriptionValidInterface)

    const { state: subscriptionState, send: subscribe } = useContractFunction(contract, 'buyCredits', { transactionName: 'BuyCredits' })
    const [period, setperiod] = useState(30)

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

    async function validate(tx_hash) {
        const response = await fetch(`${base_url}/api/v1/credits`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hash: tx_hash })
        })
        if (response.ok) {
            await fetchAccount()
        }
    }

    const subscribeTo = async (credits) => {
        const amount = credits * subscriptionFee
        await subscribe(credits, { value: utils.parseEther(amount.toString()) })
        if (subscriptionState != undefined) {
            await validate(subscriptionState.transaction.hash)
            setShowModal(false)
        }
        console.log(subscriptionState)
    }


    useEffect(() => {
        async function callState() {
            if (subscriptionState.status == "Success") {
                await validate(subscriptionState.transaction.hash)
                setShowModal(false)
            }
        }
        callState()
    }, [subscriptionState])

    return (
        <>

            {showModal ? (
                <>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div
                            className="fixed inset-0 w-full h-full bg-black opacity-40"
                            onClick={() => setShowModal(false)}
                        ></div>

                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                                <div className="mt-3 sm:flex">



                                    <div className="mt-2 text-center sm:ml-4 sm:text-left">
                                        <h4 className="text-lg font-medium text-gray-800">
                                            Buy Credits
                                        </h4>
                                        <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                                            Buy Credits to generate images
                                        </p>

                                        <div className="py-4" onChange={(e) => setperiod(e.target.value)}>
                                            <select className="form-control" defaultValue={30}>
                                                <option value={30}>30 Credits</option>
                                                <option value={60}>60 Credits</option>
                                                <option value={180}>180 Credits</option>
                                                <option value={360}>360 Credits</option>
                                            </select>
                                        </div>


                                        <div className="items-center gap-2 mt-3 sm:flex">
                                            <button
                                                className="w-full mt-2 p-2.5  text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-green-600 focus:ring-2"
                                                onClick={() =>
                                                    subscribeTo(period)
                                                }
                                            >
                                                {Math.round((period * subscriptionFee) * 1000) / 1000} Matic
                                            </button>
                                            <button
                                                className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </>
            ) : null}
        </>
    );
}
