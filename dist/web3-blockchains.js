import bsc from './blockchains/bsc'
import ethereum from './blockchains/ethereum'
import fantom from './blockchains/fantom'
import polygon from './blockchains/polygon'
import solana from './blockchains/solana'
import arbitrum from './blockchains/arbitrum'
import avalanche from './blockchains/avalanche'
import gnosis from './blockchains/gnosis'
import optimism from './blockchains/optimism'
import base from './blockchains/base'

const all = [
  ethereum,
  bsc,
  polygon,
  solana,
  fantom,
  arbitrum,
  avalanche,
  gnosis,
  optimism,
  base,
]

const findById = function (id) {
  let fixedId = id
  if (fixedId.match('0x0')) {
    // remove leading 0
    fixedId = fixedId.replace(/0x0+/, '0x')
  }
  let found = all.find((blockchain) => {
    return blockchain.id && blockchain.id.toLowerCase() == fixedId.toLowerCase()
  })
  return found
}

const findByNetworkId = function (networkId) {
  networkId = networkId.toString()
  let found = all.find((blockchain) => {
    return blockchain.networkId == networkId
  })
  return found
}

const findByName = function (name) {
  return all.find((blockchain) => {
    return blockchain.name == name
  })
}

export default {
  ethereum,
  bsc,
  polygon,
  solana,
  fantom,
  arbitrum,
  avalanche,
  gnosis,
  optimism,
  base,
  
  all,
  findById,
  findByNetworkId,
  findByName,
}
