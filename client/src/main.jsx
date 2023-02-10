import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Goerli, Mumbai } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { getDefaultProvider } from 'ethers'
import { UserProvider } from './context/UserContext'

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider('mainnet'),
    [Goerli.chainId]: getDefaultProvider('goerli'),
    [Mumbai.chainId]: 'https://rpc-mumbai.maticvigil.com/',
  },
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <UserProvider>
        <App />
      </UserProvider>
    </DAppProvider>
  </React.StrictMode>,
)
