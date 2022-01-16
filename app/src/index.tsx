import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Connector, defaultChains, defaultL2Chains, InjectedConnector, Provider } from 'wagmi'
import { providers } from 'ethers';

const connector = new InjectedConnector({
  chains: [{
    id: 31337,
    name: 'hardhat',
    testnet: true,
    rpcUrls: ['http://localhost:8545']
  }, {
    id: 80001,
    name: 'Polygon Mumbai',
    testnet: true,
    rpcUrls: ['https://rpc-mumbai.maticvigil.com']
  }]//[...defaultChains, ...defaultL2Chains],
})

type GetProviderArgs = {
  chainId?: number;
  connector?: Connector;
}

const provider = ({ chainId, connector }: GetProviderArgs) => {
  console.log('getting provider', chainId)
  if (chainId == 31337) {
    const chain = connector?.chains.find(x => x.id == 31337)?.rpcUrls[0]
    return new providers.JsonRpcProvider(chain)
  }
  else if (chainId == 80001) {
    const chain = connector?.chains.find(x => x.id == 80001)?.rpcUrls[0]
    return new providers.JsonRpcProvider(chain)
  }
  return providers.getDefaultProvider(chainId)
}



ReactDOM.render(
  <React.StrictMode>
    <Provider connectors={[connector]} provider={provider} autoConnect>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
