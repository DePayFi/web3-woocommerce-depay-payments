(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('@depay/web3-blockchains'), require('@depay/web3-constants'), require('@depay/web3-client')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', '@depay/web3-blockchains', '@depay/web3-constants', '@depay/web3-client'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactTokenImage = {}, global.React, global.Web3Blockchains, global.Web3Constants, global.Web3Client));
}(this, (function (exports, React, web3Blockchains, web3Constants, web3Client) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'velas'];
  supported.evm = ['ethereum', 'bsc', 'polygon', 'velas'];
  supported.solana = ['solana'];

  const _jsxFileName = "/Users/sebastian/Work/DePay/react-token-image/src/index.js";
  const tokenURIAPI = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
  const uriAPI = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
  const UNKNOWN_IMAGE = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjgzLjUgMjgzLjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI4My41IDI4My41OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxjaXJjbGUgZmlsbD0iI0YwRUZFRiIgY3g9IjE0MS43IiBjeT0iMTQxLjciIHI9IjE0MS43Ii8+CjxnPgoJPHBhdGggZmlsbD0iI0FCQUJBQiIgZD0iTTEyNywxNzUuMXYtNC40YzAtOC40LDEuMS0xNS4zLDMuNC0yMC43YzIuMy01LjQsNS4xLTEwLDguNC0xMy44YzMuMy0zLjcsNi42LTcsMTAuMS05LjdzNi4zLTUuNiw4LjYtOC41CgkJYzIuMy0yLjksMy40LTYuNCwzLjQtMTAuNWMwLTUtMS4xLTguNy0zLjMtMTEuMWMtMi4yLTIuNC01LTQtOC40LTQuOGMtMy40LTAuOC02LjktMS4zLTEwLjUtMS4zYy01LjgsMC0xMS44LDEtMTcuOSwyLjkKCQljLTYuMSwxLjktMTEuNSw0LjctMTYsOC40Vjc0YzIuMy0xLjcsNS40LTMuMyw5LjQtNC45YzQtMS42LDguNC0yLjksMTMuNC00YzUtMS4xLDEwLjEtMS42LDE1LjUtMS42YzguMSwwLDE1LjEsMS4xLDIxLjEsMy40CgkJYzYsMi4zLDEwLjgsNS41LDE0LjcsOS41YzMuOCw0LDYuNyw4LjcsOC42LDE0LjFjMS45LDUuMywyLjksMTEuMSwyLjksMTcuMmMwLDYuNi0xLjEsMTItMy40LDE2LjNjLTIuMyw0LjMtNS4xLDgtOC41LDExLjIKCQljLTMuNCwzLjItNi44LDYuNC0xMC4yLDkuNWMtMy40LDMuMS02LjMsNi44LTguNiwxMWMtMi4zLDQuMi0zLjQsOS41LTMuNCwxNS45djMuNEgxMjd6IE0xMjUuMiwyMTguMnYtMjcuN2gzM3YyNy43SDEyNS4yeiIvPgo8L2c+Cjwvc3ZnPgo=';

  let TokenImage = function(props){

    const [src, setSrc] = React.useState();
    const [source, setSource] = React.useState('repository');

    const blockchain = props.blockchain.toLowerCase();
    const address = props.address;
    const id = props.id;

    React.useEffect(()=>{
      if(web3Constants.CONSTANTS[blockchain].NATIVE.toLowerCase() == address.toLowerCase()) {
        setSrc(web3Blockchains.Blockchain.findByName(blockchain).logo);
      } else {
        setSrc(logoFromRepository({ blockchain, address }));
      }
    }, [blockchain, address]);
    
    const logoFromRepository = ({ blockchain, address })=> {
      if(['ethereum', 'bsc', 'polygon', 'solana'].includes(blockchain)) {
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${mapBlockchainName(blockchain)}/assets/${address}/logo.png`
      } else if(blockchain == 'velas'){
        return `https://raw.githubusercontent.com/wagyuswapapp/assets/master/blockchains/velas/assets/${address.toLowerCase()}/logo.png`
      }
    };

    const mapBlockchainName = (blockchain)=>{
      switch (blockchain) {
        case 'ethereum':
          return 'ethereum'
        case 'bsc':
          return 'smartchain'
        case 'polygon':
          return 'polygon'
        case 'solana':
          return 'solana'
        default:
          throw('DePayReactTokenImage: Unknown blockchain')
      }
    };

    const setUnknown = ()=>{
      setSource('unknown');
      setSrc(UNKNOWN_IMAGE);
    };

    const uriToImage = (tokenURI)=>{
      if(tokenURI.match(/^ipfs/)) {
        tokenURI = `https://ipfs.io/ipfs/${tokenURI.split('://')[1]}`;
      }
      fetch(tokenURI).then((response) => {
        if (response.ok) { return response.json() }
        setUnknown();
      })
      .then((responseJson) => {
        if(responseJson) {
          let image = responseJson.image;
          if(image){
            if(image.match(/^ipfs/)) {
              image = `https://ipfs.io/ipfs/${image.split('://')[1]}`;
            } 
            setSource('meta');
            setSrc(image);
          } else {
            setUnknown();
          }
        }
      }).catch(setUnknown);
    };

    const handleLoadError = (error)=> {
      if(source == 'repository') {
        setSource('depay');
        setSrc(`https://integrate.depay.com/tokens/${blockchain}/${address}/image`);
      } else if (source == 'depay' && supported.evm.includes(blockchain)) {
        if(id) {
          web3Client.request({ blockchain, address, api: uriAPI, method: 'uri', params: [id] }).then((uri)=>{
            uri = uri.match('0x{id}') ? uri.replace('0x{id}', id) : uri;
            uriToImage(uri);
          }).catch(setUnknown);
        } else {
          web3Client.request({ blockchain, address, api: tokenURIAPI, method: 'tokenURI', params: [1] }).then(uriToImage).catch(setUnknown);
        }
      } else {
        setUnknown();
      }
    };

    if(src == undefined) { return null }

    return(
      React__default['default'].createElement('img', {
        className:  props.className ,
        src:  src ,
        onError:  handleLoadError , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
      )
    )
  };

  exports.TokenImage = TokenImage;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
