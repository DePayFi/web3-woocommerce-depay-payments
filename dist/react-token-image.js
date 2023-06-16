(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@depay/solana-web3.js'), require('@depay/web3-client'), require('@depay/web3-tokens'), require('react'), require('@depay/web3-blockchains')) :
  typeof define === 'function' && define.amd ? define(['exports', '@depay/solana-web3.js', '@depay/web3-client', '@depay/web3-tokens', 'react', '@depay/web3-blockchains'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactTokenImage = {}, global.SolanaWeb3js, global.Web3Client, global.Web3Tokens, global.React, global.Web3Blockchains));
}(this, (function (exports, solanaWeb3_js, web3Client, web3Tokens, React, Blockchains) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var Blockchains__default = /*#__PURE__*/_interopDefaultLegacy(Blockchains);

  let supported = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'velas'];
  supported.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'velas'];
  supported.solana = ['solana'];

  const _jsxFileName = "/Users/sebastian/Work/DePay/react-token-image/src/index.js"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

  const tokenURIAPI = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
  const uriAPI = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
  const UNKNOWN_IMAGE = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjgzLjUgMjgzLjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI4My41IDI4My41OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxjaXJjbGUgZmlsbD0iI0YwRUZFRiIgY3g9IjE0MS43IiBjeT0iMTQxLjciIHI9IjE0MS43Ii8+CjxnPgoJPHBhdGggZmlsbD0iI0FCQUJBQiIgZD0iTTEyNywxNzUuMXYtNC40YzAtOC40LDEuMS0xNS4zLDMuNC0yMC43YzIuMy01LjQsNS4xLTEwLDguNC0xMy44YzMuMy0zLjcsNi42LTcsMTAuMS05LjdzNi4zLTUuNiw4LjYtOC41CgkJYzIuMy0yLjksMy40LTYuNCwzLjQtMTAuNWMwLTUtMS4xLTguNy0zLjMtMTEuMWMtMi4yLTIuNC01LTQtOC40LTQuOGMtMy40LTAuOC02LjktMS4zLTEwLjUtMS4zYy01LjgsMC0xMS44LDEtMTcuOSwyLjkKCQljLTYuMSwxLjktMTEuNSw0LjctMTYsOC40Vjc0YzIuMy0xLjcsNS40LTMuMyw5LjQtNC45YzQtMS42LDguNC0yLjksMTMuNC00YzUtMS4xLDEwLjEtMS42LDE1LjUtMS42YzguMSwwLDE1LjEsMS4xLDIxLjEsMy40CgkJYzYsMi4zLDEwLjgsNS41LDE0LjcsOS41YzMuOCw0LDYuNyw4LjcsOC42LDE0LjFjMS45LDUuMywyLjksMTEuMSwyLjksMTcuMmMwLDYuNi0xLjEsMTItMy40LDE2LjNjLTIuMyw0LjMtNS4xLDgtOC41LDExLjIKCQljLTMuNCwzLjItNi44LDYuNC0xMC4yLDkuNWMtMy40LDMuMS02LjMsNi44LTguNiwxMWMtMi4zLDQuMi0zLjQsOS41LTMuNCwxNS45djMuNEgxMjd6IE0xMjUuMiwyMTguMnYtMjcuN2gzM3YyNy43SDEyNS4yeiIvPgo8L2c+Cjwvc3ZnPgo=';

  let TokenImage = function(props){

    const [src, _setSrc] = React.useState();
    const [source, setSource] = React.useState();

    const blockchain = props.blockchain.toLowerCase();
    const NATIVE = Blockchains__default['default'].findByName(blockchain).currency.address;
    const address = props.address;
    const id = props.id;
    const date = new Date();
    const localStorageKey = ['react-token-image', blockchain, address, [date.getFullYear(), date.getMonth(), date.getDate()].join('-')].join('-');

    const setSrc = (_src)=>{
      localStorage.setItem(localStorageKey, _src);
      _setSrc(_src);
    };

    React.useEffect(()=>{
      const storedImage = localStorage.getItem(localStorageKey);
      if(storedImage && storedImage.length && storedImage != UNKNOWN_IMAGE) { return setSrc(storedImage) }
      if(NATIVE.toLowerCase() == address.toLowerCase()) {
        setSrc(Blockchains__default['default'].findByName(blockchain).logo);
      } else {
        if(supported.evm.includes(blockchain)) {
          setSource('repository');
          setSrc(logoFromRepository({ blockchain, address }));
        } else if(blockchain === 'solana') {
          setSource('metaplex');
          logoFromMetaplex({ blockchain, address }).then((image)=>{
            setSrc(image);
          });
        }
      }
    }, [blockchain, address]);

    const logoFromMetaplex = ({ blockchain, address }) => {
      return new Promise(async(resolve, reject)=>{
        try {

          let mintPublicKey = new solanaWeb3_js.PublicKey(address);
          let metaDataPublicKey = new solanaWeb3_js.PublicKey(web3Tokens.Token.solana.METADATA_ACCOUNT);

          let seed = [
            solanaWeb3_js.Buffer.from('metadata'),
            metaDataPublicKey.toBuffer(),
            mintPublicKey.toBuffer()  
          ];

          let tokenMetaDataPublicKey = (await solanaWeb3_js.PublicKey.findProgramAddress(seed, metaDataPublicKey))[0];

          let metaData = await web3Client.request({
            blockchain, 
            address: tokenMetaDataPublicKey.toString(),
            api: web3Tokens.Token.solana.METADATA_LAYOUT,
            cache: 86400000, // 1 day
          });
          
          if(_optionalChain([metaData, 'optionalAccess', _ => _.data, 'optionalAccess', _2 => _2.uri])) {

            const uri = metaData.data.uri.replace(new RegExp('\u0000', 'g'), '');
            if(uri && uri.length) {
              await fetch(uri)
                .then((response) => response.json())
                .then((json)=>{
                  if(json && json.image) {
                    resolve(json.image);
                  } else {
                    resolve('');
                  }
                }).catch(()=>resolve(''));
            } else {
              resolve('');
            }
          } else {
            resolve('');
          }

        } catch (e) { resolve(''); }
      })
    };
    
    const logoFromRepository = ({ blockchain, address })=> {
      if(['ethereum', 'bsc', 'polygon', 'fantom', 'solana'].includes(blockchain)) {
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
        case 'fantom':
          return 'fantom'
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
      if(source == 'metaplex') {
        setSource('repository');
        setSrc(logoFromRepository({ blockchain, address }));
      } else if(source == 'repository') {
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
        onError:  handleLoadError , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
      )
    )
  };

  exports.TokenImage = TokenImage;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
