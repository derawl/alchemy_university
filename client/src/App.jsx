import { useEffect, useState, useContext } from 'react'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import React from 'react'
import { logo } from './assets'
import { Home, CreatePost } from './pages'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { base_url } from './utils'
import { UserContext } from './context/UserContext'
import { Loader } from './components'
import { isLiveDeployed } from './utils'

const App = () => {

  const { activateBrowserWallet, account, chainId, switchNetwork } = useEthers()
  const etherBalance = useEtherBalance(account)
  const [accounts, setAccount] = useState(null)
  const [accountData, setAccountData] = useContext(UserContext)
  async function fetchAccount() {
    setAccountData(null)
    const response = await fetch(`${base_url}/api/v1/accounts`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ acc: account })
    })
    if (response.ok) {
      const result = await response.json()
      setAccount(result.data)
      setAccountData(result.data)
      console.log(result.data)
    }
  }
  useEffect(() => {
    if (account != undefined || account != null) {
      fetchAccount()
    }
    //network origin
    //
    if (isLiveDeployed()) {
      if (chainId == 137) {
        console.log("Network Ok")
      } else {
        switchNetwork(137)
      }
    } else {
      if (chainId == 80001) {
        console.log("Network Ok")
      } else {
        switchNetwork(80001)
      }
    }


  }, [account, etherBalance])
  return (
    <div className='w-full'>

      <BrowserRouter>
        <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b[#e6ebf4]'>
          <Link to='/'><h1 className="font-bold text-[#000000] text-[24px]">OurAI</h1></Link>
          {/* <img src={logo} alt="logo" className="w-28 object-contain" /> */}
          {account && <p>{account.slice(0, 10)}.... {etherBalance && Math.round(formatEther(etherBalance) * 100) / 100} MATIC</p>}
          <p>Credits:  {accountData && accountData !== undefined ? accountData.credits : 0}</p>
          {
            account ? <Link to="/create-post" className='font-inter font-medium bg-[#6469ff] rounded-md px-4 py-2 text-white'>Create</Link> :
              <button onClick={activateBrowserWallet} className='font-inter font-medium bg-[#6469ff] rounded-md px-4 py-2 text-white'>Connect</button>
          }
        </header>
        {
         
            <main className='sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/create-post' element={account ? <CreatePost /> : <div className='w-100 justify-center mt-20 flex mx-auto '>
              <p>Connect Account</p>
              < Loader />
            </div>
          } />
              </Routes>
            </main>
         
        }
        
      </BrowserRouter>

    </div>
  )
}

export default App