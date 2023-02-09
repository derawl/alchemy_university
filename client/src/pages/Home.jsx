import React from 'react'
import { useState, useEffect } from 'react'
import { Loader, FormField, Card } from '../components'
import { useEtherBalance, useEthers, useContractFunction, useCall, Mumbai } from '@usedapp/core'
import { base_url, chainMaps } from '../utils'



const RenderCards = ({ data, title }) => {
    if (data?.length > 0) {
        return (data.map((post) => {
            return (
                <Card key={post.id} {...post} />
            )
        }));
    }

    return (<h2 className='mt-4 font-bold text-[#6469ff] text-xl uppercase'>{title}</h2>)
}



const Home = () => {
    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState(null)
    const [searchText, setsearchText] = useState('')
    const [searchResults, setSearchResults] = useState(null)
    const [searchTimeout, setSearchTimeout] = useState(null)
    const { account, chainId } = useEthers()

    const handleSearchChange = (e) => {
        setsearchText(e.target.value);
        setSearchTimeout(
            setTimeout(() => {
                const search = allPosts.filter((item) => (
                    item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase())
                ))
                setSearchResults(search)
            }, 500)
        )
    }

    const fetchNfts = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${base_url}/api/v1/post/nftData`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const result = await response.json()
                const newRes = []
                console.log(result.data)
                result.data.forEach((item) => {
                    let newItem = {
                        name: item.title,
                        prompt: item.description,
                        photo: item.media[0].gateway,
                        address: item.contract.address,
                        tokenId: item.contract.tokenId,
                        opensea: `${chainMaps[chainId]}${item.tokenId}`
                    }
                    if (item.media[0].gateway.length > 0) {
                        newRes.push(newItem)
                    }
                })
                setAllPosts(newRes.reverse())
            }
        } catch (err) {
            alert(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${base_url}/api/v1/post`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    const result = await response.json()
                    console.log(result.data.reverse())
                    setAllPosts(result.data.reverse())
                }
            } catch (err) {
                alert(err)
            } finally {
                setLoading(false)
            }
        }

        fetchNfts()
    }, [])

    useEffect(() => {
        const getAccountData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${base_url}/api/v1/account`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {

                }
            } catch (err) {
                alert(err)
            } finally {
            }
        }

    }, [account])

    return (
        <section className='max-w-7xl mx-auto'>
            <div><h1 className='font-extra-bold text-[#222328] text-[32px]'>The Community NFT Showcase</h1>
                <p className='mt-2 text-[#666e75] text-[14px] max-w-[500px]'>Browse through a Collection of imaginative a visually stunning AI generated NFTS</p>
            </div>
            <div className='mt-16'>
                <FormField
                    labelName='Search Posts'
                    type="text"
                    placeholder="Search Posts"
                    name="text"
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>

            <div className='mt-10'>
                {loading ? <div className='flex justify-center items-center'><Loader /></div> :
                    <>
                        {searchText && (<h2 className='font-medium text-xl mb-3 text-[#666e75]'>
                            Showing results for <span className='x-[#222328]'>{searchText}</span>
                        </h2>)}
                        <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                            {searchText ? <RenderCards data={searchResults} title="No search Results found" /> : <RenderCards data={allPosts} title="no posts found" />}
                        </div>

                    </>}

            </div>
        </section>
    )
}

export default Home