(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  const _jsxFileName$2 = "/Users/sebastian/Work/DePay/web3-woocommerce-depay-payments/src/admin/AdminSettingsPage.js";window.React.useRef;
  const useState$1 = window.React.useState;
  const useEffect$2 = window.React.useEffect;

  function AdminSettingsPage(props) {

    const { Button } = window.wp.components;
    const [ settingsAreLoaded, setSettingsAreLoaded ] = useState$1(false);
    const [ isSaving, setIsSaving ] = useState$1();
    const [ receivingWalletAddress, setReceivingWalletAddress ] = useState$1();
    const [ tokens, setTokens ] = useState$1();

    const connectWallet = async()=> {
      let { account, accounts, wallet }  = await window.DePayWidgets.Connect();
      setReceivingWalletAddress(account);
    };

    const addToken = async ()=>{
      let token = await DePayWidgets.Select({ what: 'token' });
      if(tokens instanceof Array) {
        setTokens(tokens.concat([token]));
      } else {
        setTokens([token]);
      }
    };

    const removeToken = (index)=> {
      tokens.splice(index, 1);
      setTokens(tokens);
    };

    const saveSettings = ()=>{
      if(
        !receivingWalletAddress &&
        !tokens
      ){ return }
      setIsSaving(true);
      const settings = new window.wp.api.models.Settings({
        depay_wc_receiving_wallet_address: receivingWalletAddress,
        depay_wc_tokens: JSON.stringify(tokens),
        depay_wc_blockchains: JSON.stringify([...new Set(tokens.map((token)=>token.blockchain))]),
        depay_wc_accepted_payments: JSON.stringify(tokens.map((token)=>{
          return({
            blockchain: token.blockchain,
            token: token.address,
            receiver: receivingWalletAddress
          })
        })),
      });

      settings.save().then((response) => {
        setIsSaving(false);
        window.location.search = '?page=wc-admin&path=%2Fdepay%2Ftransactions';
      });
    };

    useEffect$2(()=>{
      wp.api.loadPromise.then(() => {
        const settings = new wp.api.models.Settings();
        settings.fetch().then((response)=> {
          setReceivingWalletAddress(response.depay_wc_receiving_wallet_address);
          if(response.depay_wc_tokens) {
            setTokens(JSON.parse(response.depay_wc_tokens));
          }
          setSettingsAreLoaded(true);
        });
      });
    }, []);

    if(!settingsAreLoaded) { return null }

    return(
      React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 73}}

        , React.createElement('div', { className: "woocommerce-section-header", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 75}}
          , React.createElement('h2', { className: "woocommerce-section-header__title woocommerce-section-header__header-item" , __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 76}}, "Settings"

          )
          , React.createElement('hr', { role: "presentation", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 79}})
        )

        , React.createElement('div', { className: "woocommerce-settings__wrapper", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 82}}
          , React.createElement('div', { className: "woocommerce-setting", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 83}}
            , React.createElement('div', { className: "woocommerce-setting__label", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 84}}
              , React.createElement('label', { for: "depay-woocommerce-payment-receiver-address", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 85}}, "Wallet Address"

              )
            )
            , React.createElement('div', { className: "woocommerce-setting__input", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 89}}
              , React.createElement('div', { className: "woocommerce-setting__options-group", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 90}}
                , React.createElement('div', { className: "components-base-control", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 91}}
                  , React.createElement('input', { 
                    id: "depay-woocommerce-payment-receiver-address", 
                    type: "text", 
                    value:  receivingWalletAddress ,
                    onChange:  (event)=>setReceivingWalletAddress(event.target.value) , __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 92}}
                  )
                )
              )
              , React.createElement('div', { className: "woocommerce-setting__input__addition", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 100}}
                , React.createElement('button', { type: "button", className: "components-button is-secondary" , onClick:  connectWallet , __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 101}}, "Connect Wallet" )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 103}}
                , React.createElement('p', { class: "description", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 104}}, "This address is used to receive payments."

                  , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 106}})
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 107}}, "Please double check that it is set to your wallet address."          )
                )
              )
            )
          )
        )

        , React.createElement('div', { className: "woocommerce-settings__wrapper", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 114}}
          , React.createElement('div', { className: "woocommerce-setting", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 115}}
            , React.createElement('div', { className: "woocommerce-setting__label", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 116}}
              , React.createElement('label', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 117}}, "Accepted Payments"

              )
            )
            , React.createElement('div', { className: "woocommerce-setting__input", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 121}}
              , React.createElement('div', { className: "woocommerce-setting__options-group", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 122}}
                , 
                  tokens && tokens.map((token, index)=>{
                    return(
                      React.createElement('table', { key:  index , class: "wp-list-table widefat fixed striped table-view-list page"     , style: { marginBottom: "0.4rem"}, __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 126}}
                        , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 127}}
                          , React.createElement('td', { style: { padding: "1rem 1rem 0.4rem 1rem", display: "flex" }, __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 128}}
                            , React.createElement('img', { src:  token.logo , style: { width: "3rem", height: "3rem" }, __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 129}})
                            , React.createElement('div', { style: { paddingLeft: "1rem", paddingBottom: "0.3rem" }, __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 130}}
                              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 131}}, React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 131}},  token.symbol ), " (" ,  token.name , ")")
                              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 132}}, "on " ,  token.blockchain.toUpperCase() )
                              , React.createElement('div', { class: "row-actions visible" , __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 133}}
                                , React.createElement('span', { class: "delete", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 134}}
                                  , React.createElement('a', { href: "#", onClick:  ()=>removeToken(index) , __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 135}}, "Remove")
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  })
                
              )
              , React.createElement('div', { className: "woocommerce-setting__input__addition", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 146}}
                , React.createElement('button', { onClick:  addToken , type: "button", className: "components-button is-secondary" , __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 147}}, "Add Token" )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 149}}
                , React.createElement('p', { class: "description", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 150}}, "Each incoming payment will be converted on-the-fly into your selected tokens on the selected blockchain. Payment senders will be able to use any routable token as means of payment. Tokens will be converted on-the-fly using decentralized finance to ensure you will always get the tokens you've configured."



                )
                , React.createElement('p', { class: "description", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 155}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 156}}, "Payments are peer-to-peer and will always be sent directly to your wallet."           )
                )
              )
            )
          )
        )

        , React.createElement('div', { className: "woocommerce-settings__wrapper", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 163}}
          , React.createElement('div', { className: "woocommerce-setting", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 164}}
            , React.createElement('div', { className: "woocommerce-setting__label", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 165}})
            , React.createElement('div', { className: "woocommerce-setting__input", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 166}}
              , React.createElement(Button, {
                isPrimary: true,
                isLarge: true,
                onClick:  () => saveSettings() ,
                disabled:  isSaving , __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 167}}
              , "Save Settings" )
            )
          )
        )
      )
    )
  }

  const logo$4 = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHNoYXBlLXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIwIiB5PSIwIiB2aWV3Qm94PSIwIDAgMjgzLjUgMjgzLjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI4My41IDI4My41IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGU+LnN0MXtmaWxsOiM4YzhjOGN9PC9zdHlsZT48Zz48Zz48cGF0aCBzdHlsZT0iZmlsbDojMzQzNDM0IiBkPSJtMTQxLjcgNTUtMS4xIDMuOXYxMTQuOGwxLjEgMS4xIDUzLjMtMzEuNXoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJtMTQxLjcgNTUtNTMuMiA4OC4zIDUzLjIgMzEuNXYtNTUuN3oiLz48cGF0aCBzdHlsZT0iZmlsbDojM2MzYzNiIiBkPSJtMTQxLjcgMTg0LjktLjYuOHY0MC45bC42IDEuOSA1My4zLTc1LjF6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTE0MS43IDIyOC41di00My42bC01My4yLTMxLjV6Ii8+PHBhdGggc3R5bGU9ImZpbGw6IzE0MTQxNCIgZD0ibTE0MS43IDE3NC44IDUzLjMtMzEuNS01My4zLTI0LjJ6Ii8+PHBhdGggc3R5bGU9ImZpbGw6IzM5MzkzOSIgZD0ibTg4LjUgMTQzLjMgNTMuMiAzMS41di01NS43eiIvPjwvZz48L2c+PC9zdmc+Cg==';

  var ethereum = {
    name: 'ethereum',
    id: '0x1',
    networkId: '1',
    label: 'Ethereum',
    fullName: 'Ethereum Mainnet',
    logo: logo$4,
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    explorer: 'https://etherscan.io',
    explorerUrlFor: ({ transaction, token, address })=>{
      if(transaction) { return `https://etherscan.io/tx/${transaction.id || transaction}` }
      if(token) { return `https://etherscan.io/token/${token}` }
      if(address) { return `https://etherscan.io/address/${address}` }
    },
    rpc: ['https://mainnet.infura.io/v3/9aa3d95b3bc4', '40fa88ea12eaa4456161'].join(''),
    tokens: [ // only major tokens
      {"address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", "symbol": "ETH", "name": "Ether", "decimals": 18, "logo": logo$4, "type": "NATIVE"},
      {"address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "symbol": "WETH", "name": "Wrapped Ether", "decimals": 18, "logo": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png", "type": "20"},
      {"address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "symbol": "USDC", "name": "USD Coin", "decimals": 6, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png", "type": "20"},
      {"address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "symbol": "WBTC", "name": "Wrapped BTC", "decimals": 8, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "type": "20"},
      {"address": "0xdAC17F958D2ee523a2206206994597C13D831ec7", "symbol": "USDT", "name": "Tether USD", "decimals": 6, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png", "type": "20"},
      {"address": "0x6B175474E89094C44Da98b954EedeAC495271d0F", "symbol": "DAI", "name": "Dai Stablecoin", "decimals": 18, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png", "type": "20"},
      {"address": "0x853d955aCEf822Db058eb8505911ED77F175b99e", "symbol": "FRAX", "name": "Frax", "decimals": 18, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png", "type": "20"},
      {"address": "0x8E870D67F660D95d5be530380D0eC0bd388289E1", "symbol": "USDP", "name": "Pax Dollar", "decimals": 18, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8E870D67F660D95d5be530380D0eC0bd388289E1/logo.png", "type": "20"},
      {"address": "0x956F47F50A910163D8BF957Cf5846D573E7f87CA", "symbol": "FEI", "name": "Fei USD", "decimals": 18, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x956F47F50A910163D8BF957Cf5846D573E7f87CA/logo.png", "type": "20"}
    ]
  };

  const logo$3 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxOTIgMTkyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNNjIuOCA1Mi42IDk2IDMzLjVsMzMuMiAxOS4xLTEyLjIgNy0yMS0xMS45LTIxIDEyLTEyLjItNy4xem02Ni40IDI0LjItMTIuMi03LTIxIDEyLTIxLTEyLjEtMTIuMiA3LjFWOTFsMjEgMTIuMXYyNC4xbDEyLjIgNy4xIDEyLjItNy4xdi0yNC4xbDIxLTEyLjFWNzYuOHptMCAzOC40VjEwMWwtMTIuMiA3djE0LjJsMTIuMi03em04LjYgNC44LTIxIDEyLjF2MTQuMmwzMy4yLTE5LjFWODguOUwxMzcuOCA5NnYyNHptLTEyLjItNTUuMyAxMi4yIDcuMVY4NmwxMi4yLTcuMVY2NC43bC0xMi4yLTcuMS0xMi4yIDcuMXptLTQxLjggNzIuNnYxNC4ybDEyLjIgNy4xIDEyLjItNy4xdi0xNC4ybC0xMi4yIDctMTIuMi03em0tMjEtMjIuMSAxMi4yIDcuMVYxMDhsLTEyLjItN3YxNC4yem0yMS01MC41TDk2IDcxLjhsMTIuMi03LjEtMTIuMi03YzAtLjEtMTIuMiA3LTEyLjIgN3ptLTI5LjYgNy4xIDEyLjItNy4xLTEyLjItNy4xTDQyIDY0Ljd2MTQuMkw1NC4yIDg2VjcxLjh6bTAgMjQuMS0xMi4yLTd2MzguM2wzMy4yIDE5LjF2LTE0LjJsLTIxLTEyLjFWOTUuOXoiIHN0eWxlPSJmaWxsOiNmMGI5MGIiLz48L3N2Zz4=';

  var bsc = {
    name: 'bsc',
    id: '0x38',
    networkId: '56',
    label: 'BNB Smart Chain',
    fullName: 'BNB Smart Chain Mainnet',
    logo: logo$3,
    currency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    explorer: 'https://bscscan.com',
    explorerUrlFor: ({ transaction, token, address })=>{
      if(transaction) { return `https://bscscan.com/tx/${transaction.id || transaction}` }
      if(token) { return `https://bscscan.com/token/${token}` }
      if(address) { return `https://bscscan.com/address/${address}` }
    },
    rpc: 'https://bsc-dataseed1.binance.org',
    tokens: [ // only major tokens
      {"address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", "symbol": "BNB", "name": "Binance Coin", "decimals": 18, "logo": logo$3, "type": "NATIVE"},
      {"address": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "symbol": "WBNB", "name": "Wrapped BNB", "decimals": 18, "logo": "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png", "type": "20"},
      {"address": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", "symbol": "BUSD", "name": "BUSD Token", "decimals": 18, "logo": "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png", "type": "20"},
      {"address": "0x55d398326f99059fF775485246999027B3197955", "symbol": "USDT", "name": "Tether USD", "decimals": 18, "logo": "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png", "type": "20"},
      {"address": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", "symbol": "USDC", "name": "USD Coin", "decimals": 18, "logo": "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png", "type": "20"},
      {"address": "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", "symbol": "ETH", "name": "Ethereum Token", "decimals": 18, "logo": "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png", "type": "20"},
      {"address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", "symbol": "Cake", "name": "PancakeSwap Token", "decimals": 18, "logo": "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png", "type": "20"},
      {"address": "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", "symbol": "BTCB", "name": "BTCB Token", "decimals": 18, "logo": "https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/logo.png", "type": "20"}
    ]
  };

  const logo$2 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NS40IDQ1LjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ1LjQgNDUuNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTMwLjIgMTcuN2MtLjYtLjMtMS4zLS4zLTEuOCAwbC00LjMgMi41LTIuOSAxLjYtNC4yIDIuNWMtLjYuMy0xLjMuMy0xLjggMGwtMy4zLTJjLS41LS4zLS45LS45LS45LTEuNnYtMy44YzAtLjcuNC0xLjMuOS0xLjZsMy4zLTEuOWMuNi0uMyAxLjItLjMgMS44IDBsMy4zIDJjLjYuMy45LjkuOSAxLjZ2Mi41bDIuOS0xLjd2LTIuNmMwLS43LS4zLTEuMy0uOS0xLjZMMTcuMSAxMGMtLjYtLjMtMS4yLS4zLTEuOCAwTDkgMTMuN2MtLjYuMy0uOS45LS45IDEuNXY3LjFjMCAuNy4zIDEuMy45IDEuNmw2LjIgMy42Yy42LjMgMS4yLjMgMS44IDBsNC4yLTIuNCAyLjktMS43IDQuMi0yLjRjLjYtLjMgMS4zLS4zIDEuOCAwbDMuMyAxLjljLjYuMy45LjkuOSAxLjZ2My44YzAgLjctLjMgMS4zLS45IDEuNmwtMy4yIDEuOWMtLjYuMy0xLjIuMy0xLjggMGwtMy4zLTEuOWMtLjYtLjMtLjktLjktLjktMS42di0yLjRsLTIuOSAxLjd2Mi41YzAgLjcuMyAxLjMuOSAxLjZsNi4xIDMuNmMuNi4zIDEuMi4zIDEuOCAwbDYuMS0zLjZjLjYtLjMuOS0uOS45LTEuNnYtNy4yYzAtLjctLjMtMS4zLS45LTEuNmwtNi0zLjZ6IiBzdHlsZT0iZmlsbDojODI0N2U1Ii8+PC9zdmc+Cg==';

  var polygon = {
    name: 'polygon',
    id: '0x89',
    networkId: '137',
    label: 'Polygon',
    fullName: 'Polygon Mainnet',
    logo: logo$2,
    currency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18
    },
    explorer: 'https://polygonscan.com',
    explorerUrlFor: ({ transaction, token, address })=>{
      if(transaction) { return `https://polygonscan.com/tx/${transaction.id || transaction}` }
      if(token) { return `https://polygonscan.com/token/${token}` }
      if(address) { return `https://polygonscan.com/address/${address}` }
    },
    rpc: 'https://rpc-mainnet.matic.network',
    tokens: [ // only major tokens
      {"address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", "symbol": "MATIC", "name": "Polygon", "decimals": 18, "logo": logo$2, "type": "NATIVE"},
      {"address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "symbol": "WMATIC", "name": "Wrapped Matic", "decimals": 18, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png", "type": "20"},
      {"address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", "symbol": "WETH", "name": "Wrapped Ether", "decimals": 18, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png", "type": "20"},
      {"address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "symbol": "USDC", "name": "USD Coin", "decimals": 6, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png", "type": "20"},
      {"address": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", "symbol": "USDT", "name": "Tether USD", "decimals": 6, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png", "type": "20"},
      {"address": "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1", "symbol": "miMATIC", "name": "miMATIC", "decimals": 18, "logo": "https://raw.githubusercontent.com/0xlaozi/qidao/main/images/mimatic-red.png", "type": "20"},
      {"address": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "symbol": "DAI", "name": "Dai Stablecoin", "decimals": 18, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png", "type": "20"},
      {"address": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", "symbol": "WBTC", "name": "Wrapped BTC", "decimals": 8, "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "type": "20"}
    ]
  };

  const logo$1 = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDM5Ny43IDMxMS43IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzOTcuNyAzMTEuNyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGxpbmVhckdyYWRpZW50IGlkPSJ3ZWIzX2Jsb2NrY2hhaW5zX3NvbGFuYV9ncmFkaWVudF8xIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjI5MS44NTQiIHkxPSIxNC4zNTkiIHgyPSIxNjUuNzY4IiB5Mj0iMjU1Ljg2NiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDMwLjUzNSkiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzAwZmZhMyIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I2RjMWZmZiIvPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggZD0iTTEyMS44IDIwMi45YzEuNC0xLjQgMy4zLTIuMiA1LjMtMi4yaDE4Mi4yYzMuMyAwIDUgNCAyLjYgNi40bC0zNiAzNmMtMS40IDEuNC0zLjMgMi4yLTUuMyAyLjJIODguNGMtMy4zIDAtNS00LTIuNi02LjRsMzYtMzZ6IiBzdHlsZT0iZmlsbDp1cmwoI3dlYjNfYmxvY2tjaGFpbnNfc29sYW5hX2dyYWRpZW50XzEpIi8+PGxpbmVhckdyYWRpZW50IGlkPSJ3ZWIzX2Jsb2NrY2hhaW5zX3NvbGFuYV9ncmFkaWVudF8yIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjIzNi43MjciIHkxPSItMTQuNDIyIiB4Mj0iMTEwLjY0MSIgeTI9IjIyNy4wODUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAzMC41MzUpIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMGZmYTMiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNkYzFmZmYiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIHN0eWxlPSJmaWxsOnVybCgjd2ViM19ibG9ja2NoYWluc19zb2xhbmFfZ3JhZGllbnRfMikiIGQ9Ik0xMjEuOCA2OC42YzEuNC0xLjQgMy4zLTIuMiA1LjMtMi4yaDE4Mi4yYzMuMyAwIDUgNCAyLjYgNi40bC0zNiAzNmMtMS40IDEuNC0zLjMgMi4yLTUuMyAyLjJIODguNGMtMy4zIDAtNS00LTIuNi02LjRsMzYtMzZ6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJ3ZWIzX2Jsb2NrY2hhaW5zX3NvbGFuYV9ncmFkaWVudF8zIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjI2NC4xMTQiIHkxPSItLjEyMyIgeDI9IjEzOC4wMjgiIHkyPSIyNDEuMzgzIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMzAuNTM1KSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBmZmEzIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojZGMxZmZmIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBzdHlsZT0iZmlsbDp1cmwoI3dlYjNfYmxvY2tjaGFpbnNfc29sYW5hX2dyYWRpZW50XzMpIiBkPSJNMjc1LjkgMTM1LjNjLTEuNC0xLjQtMy4zLTIuMi01LjMtMi4ySDg4LjRjLTMuMyAwLTUgNC0yLjYgNi40bDM2IDM2YzEuNCAxLjQgMy4zIDIuMiA1LjMgMi4yaDE4Mi4yYzMuMyAwIDUtNCAyLjYtNi40bC0zNi0zNnoiLz48L3N2Zz4K';

  var solana = {
    name: 'solana',
    networkId: 'mainnet-beta',
    label: 'Solana',
    fullName: 'Solana',
    logo: logo$1,
    currency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9
    },
    explorer: 'https://solscan.io',
    explorerUrlFor: ({ transaction, token, address })=>{
      if(transaction) { return `https://solscan.io/tx/${transaction.id || transaction}` }
      if(token) { return `https://solscan.io/token/${token}` }
      if(address) { return `https://solscan.io/address/${address}` }
    },
    rpc: 'https://api.mainnet-beta.solana.com',
    tokens: [ // only major tokens
      {"address": "11111111111111111111111111111111", "symbol": "SOL", "name": "Solana", "decimals": 9, "logo": logo$1, "type": "NATIVE"},
      {"address": "So11111111111111111111111111111111111111112", "symbol": "WSOL", "name": "Wrapped SOL", "decimals": 9, "logo": "https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png", "type": "SPL"},
      {"address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "symbol": "USDC", "name": "USD Coin", "decimals": 6, "logo": "https://img.raydium.io/icon/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png", "type": "SPL"},
      {"address": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "symbol": "USDT", "name": "USDT", "decimals": 6, "logo": "https://img.raydium.io/icon/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB.png", "type": "SPL"}
    ]
  };

  const logo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyODMuNSAyODMuNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjgzLjUgMjgzLjUiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxjaXJjbGUgZmlsbD0iI0YwRUZFRiIgY3g9IjE0MS43IiBjeT0iMTQxLjciIHI9IjE0MS43Ii8+PHBhdGggZmlsbD0iI0FCQUJBQiIgZD0iTTEyNyAxNzUuMXYtNC40YzAtOC40IDEuMS0xNS4zIDMuNC0yMC43IDIuMy01LjQgNS4xLTEwIDguNC0xMy44IDMuMy0zLjcgNi42LTcgMTAuMS05LjdzNi4zLTUuNiA4LjYtOC41YzIuMy0yLjkgMy40LTYuNCAzLjQtMTAuNSAwLTUtMS4xLTguNy0zLjMtMTEuMS0yLjItMi40LTUtNC04LjQtNC44LTMuNC0uOC02LjktMS4zLTEwLjUtMS4zLTUuOCAwLTExLjggMS0xNy45IDIuOS02LjEgMS45LTExLjUgNC43LTE2IDguNFY3NGMyLjMtMS43IDUuNC0zLjMgOS40LTQuOSA0LTEuNiA4LjQtMi45IDEzLjQtNHMxMC4xLTEuNiAxNS41LTEuNmM4LjEgMCAxNS4xIDEuMSAyMS4xIDMuNCA2IDIuMyAxMC44IDUuNSAxNC43IDkuNSAzLjggNCA2LjcgOC43IDguNiAxNC4xIDEuOSA1LjMgMi45IDExLjEgMi45IDE3LjIgMCA2LjYtMS4xIDEyLTMuNCAxNi4zLTIuMyA0LjMtNS4xIDgtOC41IDExLjItMy40IDMuMi02LjggNi40LTEwLjIgOS41LTMuNCAzLjEtNi4zIDYuOC04LjYgMTFzLTMuNCA5LjUtMy40IDE1Ljl2My40SDEyN3ptLTEuOCA0My4xdi0yNy43aDMzdjI3LjdoLTMzeiIvPjwvc3ZnPgo=';

  var unknown = {
    id: 'unknown',
    name: 'unknown',
    label: 'Unknown',
    logo
  };

  let all = [
    ethereum,
    bsc,
    polygon,
    solana,
    unknown
  ];

  let Blockchain = {
    all,

    findById: function (id) {
      let fixedId = id;
      if (fixedId.match('0x0')) {
        // remove leading 0
        fixedId = fixedId.replace(/0x0+/, '0x');
      }
      let found = all.find((blockchain) => {
        return blockchain.id == fixedId
      });
      if(found == undefined) {
        found = all.find((blockchain) => {
          return blockchain.id == 'unknown'
        });
      }
      return found
    },

    findByNetworkId: function (networkId) {
      networkId = networkId.toString();
      let found = all.find((blockchain) => {
        return blockchain.networkId == networkId
      });
      return found
    },

    findByName: function (name) {
      return all.find((blockchain) => {
        return blockchain.name == name
      })
    },
  };

  const _jsxFileName$1 = "/Users/sebastian/Work/DePay/web3-woocommerce-depay-payments/src/admin/AdminTransactionsPage.js";
  const { useState, useEffect: useEffect$1, useRef } = window.React;
  const { Fragment } = window.wp.element;
  const { Search, TableCard } = window.wc.components;
  const { onQueryChange } = window.wc.navigation;
  const getCurrentPage = ()=>{
    return window.location.search.match(/paged=(\d+)/) ? window.location.search.match(/paged=(\d+)/)[1] : 1
  };
  const getCurrentPerPage = ()=>{
    return window.location.search.match(/per_page=(\d+)/) ? window.location.search.match(/per_page=(\d+)/)[1] : 25
  };
  const getCurrentOrderBy = ()=>{
    return window.location.search.match(/orderby=(\w+)/) ? window.location.search.match(/orderby=(\w+)/)[1] : 'created_at'
  };
  const getCurrentOrder = ()=>{
    return window.location.search.match(/order=(\w+)/) ? window.location.search.match(/order=(\w+)/)[1] : 'desc'
  };
  let currentRequest;

  function AdminTransactionsPage(props) {

    const [ rows, setRows ] = useState();
    const [ anyTransactions, setAnyTransactions ] = useState();
    const [ totalRows, setTotalRows ] = useState();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ query, setQuery ] = useState({
      paged: getCurrentPage(),
      per_page: getCurrentPerPage(),
      orderby: getCurrentOrderBy(),
      order: getCurrentOrder(),
    });
    const [ summary, setSummary ] = useState();
    const scrollPointRef = useRef();
    const [ filteredHeaders, setFilteredHeaders ] = useState([
      {
        label: 'Created at',
        key: 'created_at',
        required: true,
        isSortable: true,
      },
      {
        label: 'Status',
        key: 'status',
        required: true,
        isSortable: true,
      },
      {
        label: 'Order',
        key: 'order_id',
        required: true,
        isSortable: true,
      },
      {
        label: 'Blockchain',
        key: 'blockchain',
        required: true,
        isSortable: true,
      },
      {
        label: 'Transaction',
        key: 'transaction_id',
        required: true,
        isSortable: true,
      },
      {
        label: 'Sender',
        key: 'sender_id',
        required: true,
        isSortable: true,
      },
      {
        label: 'Receiver',
        key: 'receiver_id',
        required: true,
        isSortable: true,
      },
      {
        label: 'Amount',
        key: 'amount',
        required: true,
        isSortable: true,
      },
      {
        label: 'Token',
        key: 'token_id',
        required: true,
        isSortable: true,
      },
      {
        label: 'Confirmed by',
        key: 'confirmed_by',
        required: true,
        isSortable: true,
      },
      {
        label: 'Confirmed at',
        key: 'confirmed_at',
        required: true,
        isSortable: true,
      },
      {
        label: 'Confirmations required',
        key: 'confirmations_required',
        required: true,
        isSortable: true,
      },
    ]);

    const fetchTransactionsData = ()=> {
      if(currentRequest && !currentRequest.status && currentRequest.abort) { currentRequest.abort(); }
      setIsLoading(true);
      setQuery({
        paged: getCurrentPage(),
        per_page: getCurrentPerPage(),
        orderby: getCurrentOrderBy(),
        order: getCurrentOrder(),
      });
      currentRequest = wp.apiRequest({
        path: `/depay/wc/transactions`,
        method: 'GET',
        data: {
          limit: getCurrentPerPage(),
          page: getCurrentPage(),
          orderby: getCurrentOrderBy(),
          order: getCurrentOrder(),
        }
      });
      currentRequest.then((response)=>{ setIsLoading(false); return response });
      return currentRequest
    };

    const onPushState = (event)=>{
      setTimeout(() => {
       fetchTransactionsData().then((transactionsData)=>setRows(transactionsToRows(transactionsData)));
      }, 1);
    };

    const onPopState = (event)=>{
      setTimeout(() => {
       fetchTransactionsData().then((transactionsData)=>setRows(transactionsToRows(transactionsData)));
      }, 1);
    };

    const transactionsToRows = (transactionsData)=>{
      return(transactionsData.transactions.map((transaction)=>[
        { display: (new Date(transaction.created_at)).toLocaleString(), value: (new Date(transaction.created_at)).toLocaleString() },
        { display: React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$1, lineNumber: 148}}, React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$1, lineNumber: 148}}, transaction.status), transaction.failed_reason && React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$1, lineNumber: 148}}, transaction.failed_reason)), value: transaction.status },
        { display: React.createElement('a', { target: "blank", rel: "noopener noreferrer" , href: `/wp-admin/edit.php?s=${transaction.order_id}&post_status=all&post_type=shop_order&action=-1&m=0&_customer_user&paged=1&action2=-1`, __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 149}}, transaction.order_id), value: transaction.order_id },
        { display: transaction.blockchain, value: transaction.blockchain },
        { display: React.createElement('a', { target: "blank", rel: "noopener noreferrer" , href: Blockchain.findByName(transaction.blockchain).explorerUrlFor({transaction: transaction.transaction_id}), __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 151}}, transaction.transaction_id), value: transaction.transaction_id },
        { display: React.createElement('a', { target: "blank", rel: "noopener noreferrer" , href: Blockchain.findByName(transaction.blockchain).explorerUrlFor({address: transaction.sender_id}), __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 152}}, transaction.sender_id), value: transaction.sender_id },
        { display: React.createElement('a', { target: "blank", rel: "noopener noreferrer" , href: Blockchain.findByName(transaction.blockchain).explorerUrlFor({address: transaction.receiver_id}), __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 153}}, transaction.receiver_id), value: transaction.receiver_id },
        { display: transaction.amount, value: transaction.amount },
        { display: React.createElement('a', { target: "blank", rel: "noopener noreferrer" , href: Blockchain.findByName(transaction.blockchain).explorerUrlFor({token: transaction.token_id}), __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 155}}, transaction.token_id), value: transaction.token_id },
        { display: transaction.confirmed_by, value: transaction.confirmed_by },
        { display: (new Date(transaction.confirmed_at)).toLocaleString(), value: (new Date(transaction.confirmed_at)).toLocaleString() },
        { display: transaction.confirmations_required, value: transaction.confirmations_required },
      ]))
    };

    useEffect$1(()=>{
      wp.api.loadPromise.then(() => {
        const settings = new wp.api.models.Settings();
        Promise.all([
          settings.fetch(),
          fetchTransactionsData()
        ]).then(([settings, transactionsData])=>{
          if(
            !settings.depay_wc_receiving_wallet_address &&
            !settings.depay_wc_accepted_payments &&
            !settings.depay_wc_tokens
          ) {
            window.location.search = '?page=wc-admin&path=%2Fdepay%2Fsettings';
          }
          setSummary([{ value: transactionsData.total, label: "Transactions" }]);
          setTotalRows(transactionsData.total);
          setRows(transactionsToRows(transactionsData));
          setIsLoading(false);
        });
      });
    }, []);

    useEffect$1(()=>{
      window.addEventListener('pushstate', onPushState);
      return ()=>window.removeEventListener('pushstate', onPushState)
    }, []);

    useEffect$1(()=>{
      window.addEventListener('popstate', onPopState);
      return ()=>window.removeEventListener('popstate', onPopState)
    }, []);

    if(isLoading == false && anyTransactions == false) {
      return(
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$1, lineNumber: 196}}
          , React.createElement('div', { style: { textAlign: 'center' }, className: "components-surface components-card woocommerce-marketing-overview-welcome-card"  , __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 197}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$1, lineNumber: 198}}
              , React.createElement('div', { className: "components-card__body components-card-body" , __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 199}}
                , React.createElement('img', { style: { maxWidth: "220px" }, src: "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzOTMuMzkgMjYwLjg4Ij48cGF0aCBkPSJNMTI1LjU5LDIzNS4xM2E3LjgxLDcuODEsMCwwLDEtLjI2LS44MiwxLDEsMCwwLDEsMC0uMjR2LjE1Yy0uMDUuMDgtLjI0LjU5LS4zMy41NmwuMTItLjExYy4wOC0uMDYuMDYtLjA2LS4wNiwwcy0uMTMuMDksMCwwbC4xNi0uMDhjLjI2LS4xNi0uMS4wNy0uMTIsMGwuMTIsMGMuMTUsMCwuMTUsMCwwLDBoLjFjMCwuMDctLjQxLS4xMi0uNDYtLjE1bC0uMDgtLjA1Yy4xLjA2LS4wOC0uMTgsMCwwcy4xMy4yNC4xOS4zNi4wOS4xNywwLDBhNS4yMiw1LjIyLDAsMCwxLC4xOS43OGMwLC4xNCwwLC4yMSwwLDAsMCwuMTMsMCwuMjcsMCwuNHMwLC41LDAsLjc0LDAsLjIyLDAsLjMzYzAtLjMsMCwuMDYsMCwuMTItLjA2LjI0LS4xMy40Ny0uMi43YTIxLjMsMjEuMywwLDAsMS0xLjEyLDMuMTRsMy4zNiwxLjA4YTUuNjYsNS42NiwwLDAsMCwwLTQuMzdjLS4yNS0uNjMtLjUtMS4yNy0uOC0xLjg4LS4xMi0uMjUtLjI1LS41LS4zOS0uNzRhMy44OCwzLjg4LDAsMCwwLTEuMDctMS4xNCwxLjc5LDEuNzksMCwwLDAtMi40NS41NCwxLjgyLDEuODIsMCwwLDAsLjU1LDIuNDRjLjM0LjI3LS4xOC0uMjItLjE3LS4yM3MuMTQuMjcuMTUuMjljLjEyLjIzLjI0LjQ2LjM1LjY5YTE1LjY5LDE1LjY5LDAsMCwxLC42MSwxLjQ3Yy0uMDYtLjE4LDAsMCwwLC4wNnMwLC4yMi4wNy4zNCwwLC4yMiwwLDB2LjMxYzAsLjExLDAsLjIxLDAsLjMyLDAsLjQzLjA3LS4xMywwLC4xcy0uMTUuNDYtLjI1LjY5YTEuNzcsMS43NywwLDAsMCwxLjE0LDIuMjMsMS44MiwxLjgyLDAsMCwwLDIuMjItMS4xNSwxOC41LDE4LjUsMCwwLDAsMS4zOS00LjE2LDcuNDQsNy40NCwwLDAsMC0uNDctNC45MiwzLjM2LDMuMzYsMCwwLDAtMS44My0xLjc4LDMuNDUsMy40NSwwLDAsMC0yLjM5LjE0LDMuMTIsMy4xMiwwLDAsMC0xLjc5LDEuNyw0LjE2LDQuMTYsMCwwLDAsLjE4LDIuNzQsMS44MSwxLjgxLDAsMCwwLDIuMSwxLjM3QTEuNzksMS43OSwwLDAsMCwxMjUuNTksMjM1LjEzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiMyZjE1MTUiLz48cGF0aCBkPSJNMTM3LjgxLDE5NS41M2EyMS45MywyMS45MywwLDEsMS0yNS40NCwxNy43MywyMS45NCwyMS45NCwwLDAsMSwyNS40NC0xNy43MyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiM1M2FlOTQiLz48cGF0aCBkPSJNMTM3LjEzLDIxNC43MmwuNTctMy4yMiw3LjM0LDEuMzIuODgtNC45LTIwLTMuNTctLjg4LDQuODksNy4zNCwxLjMyLS41NywzLjJjLTYtLjc5LTEwLjcxLS40MS0xMSwxczQsMy40LDEwLDQuNzRMMTI5LDIyOS43OWw1LjMxLDEsMS44My0xMC4yOGM2LC43OSwxMC43LjQxLDExLTFzLTQtMy4zOS05LjkyLTQuNzNtLS44Nyw0Ljg3aDBjLS4xNSwwLS45My0uMS0yLjY0LS40MS0xLjM3LS4yNS0yLjMzLS40Ni0yLjY3LS41M2gwYy01LjIzLTEuMTgtOS0yLjgtOC44LTMuOXM0LjI5LTEuMzEsOS42MS0uNmwtLjY0LDMuNThjLjM0LjA5LDEuMzIuMzIsMi42OC41NywxLjY0LjI5LDIuNDcuMzcsMi42Mi4zOGwuNjUtMy41OGM1LjIyLDEuMTcsOSwyLjc5LDguNzgsMy44OXMtNC4yOSwxLjMxLTkuNTkuNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNmZmYiLz48ZyBpZD0iTGF5ZXJfMV8wIiBkYXRhLW5hbWU9IkxheWVyXzEgMCI+PGcgaWQ9Il8zNDQ3MTcxMDQiIGRhdGEtbmFtZT0iIDM0NDcxNzEwNCI+PHBhdGggZD0iTTk5LjkyLDE5OGEyMS43MSwyMS43MSwwLDEsMS0xOC42MSwyNC40MkEyMS43LDIxLjcsMCwwLDEsOTkuOTIsMTk4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiMzNjc0YmEiLz48cGF0aCBkPSJNMTAwLjgxLDIzNS4wNmEuNjQuNjQsMCwwLDEtLjguNzYsMTYuMjksMTYuMjksMCwwLDEtNC4xNS0zMC43NS42NC42NCwwLDAsMSwxLC41MmwuMTcsMS4yNWExLDEsMCwwLDEtLjQ2LjkyQTEzLjU3LDEzLjU3LDAsMCwwLDk5Ljk0LDIzM2ExLDEsMCwwLDEsLjcuNzZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMDUuNTYsMjI5LjY4YS42OS42OSwwLDAsMS0uNTkuNzdsLTEuMzQuMThhLjY5LjY5LDAsMCwxLS43Ny0uNThsLS4yOS0yLjEzYy0zLDAtNC42NC0xLjQ1LTUuMzMtMy42M2EuNjMuNjMsMCwwLDEsLjUzLS44MWwxLjUzLS4yMWEuNjguNjgsMCwwLDEsLjczLjQ2Yy40NywxLjMsMS4zOCwyLjIxLDMuNzMsMS45LDEuNzQtLjI0LDIuODQtMS4zNywyLjY0LTIuODNzLTEtMS45LTMuNi0yYy0zLjgzLDAtNS43Ni0uOS02LjE2LTMuODUtLjMxLTIuMjgsMS4xNy00LjI4LDMuNzktNWwtLjI4LTIuMDhhLjY5LjY5LDAsMCwxLC41OC0uNzdsMS4zNC0uMThhLjY5LjY5LDAsMCwxLC43Ny41OGwuMjksMi4xNWE0LjU5LDQuNTksMCwwLDEsNC40OSwzLjEyLjY0LjY0LDAsMCwxLS41MS44NGwtMS40Mi4xOWEuNy43LDAsMCwxLS43Mi0uNDFjLS41Ni0xLjI1LTEuNTYtMS42OC0zLjE3LTEuNDctMS43OC4yNC0yLjU4LDEuMjMtMi40MiwyLjQ0cy43OCwxLjg0LDMuNTcsMS44N2MzLjc2LDAsNS44MS44MSw2LjI0LDQsLjMyLDIuMzgtMS4xOSw0LjU2LTMuOSw1LjM4bC4yOCwyLjEyaDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMDkuODUsMjM0LjQ5YS42NC42NCwwLDAsMS0xLS41MmwtLjE3LTEuMjVhLjkuOSwwLDAsMSwuNDctLjkyLDEzLjU3LDEzLjU3LDAsMCwwLTMuNDEtMjUuMjcsMSwxLDAsMCwxLS43LS43NmwtLjE3LTEuMjVhLjY1LjY1LDAsMCwxLC44MS0uNzYsMTYuMjgsMTYuMjgsMCwwLDEsNC4xNCwzMC43NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjZmZmIi8+PC9nPjwvZz48cGF0aCBkPSJNNDAyLDMxNi42MWMtNTcuMjUsOS42Mi0xMjAuMTMsNi4zLTE3Ny42MS0uNDZxLTMuNC0uMzktNi42Mi0xYy0xMy4yMi0yLjg2LTI3LjA5LTkuNjYtMzQuMTktMjEuODFhNDQuNDgsNDQuNDgsMCwwLDEtMi43My01LjYzLDUyLjQsNTIuNCwwLDAsMS0yLjA4LTYuMzgsOTAuNDUsOTAuNDUsMCwwLDEtMi4yMS0xMS4yYy00LjI2LTQ2LjY1LTQuNDEtOTQuMTcsNC4zMy0xNDAuMjFhNDIuMjEsNDIuMjEsMCwwLDEsNi0xMiwzNS40NSwzNS40NSwwLDAsMSwxMC40Ni05LjUyYzEwLjc1LTYuMzksMjIuODgtNS42NSwzNC41Ni03LDQuMDctLjI3LDguMTUtLjQ4LDEyLjI0LS42NnE1NC40My0yLjQ4LDEwOS0uODFjMjUuNTMuNzgsNTQuMzMtMyw3Ny40LDEwLjEsMjQuNjMsMTMuOTQsMjcuODYsNDEuNCwyOSw2Ni40NmE1MDYuMzQsNTA2LjM0LDAsMCwxLTEuODUsNzIuMjNjLTEuOTEsMTkuNDktNCw0MC0yMC4zNSw1My42N0M0MjcuOTEsMzEwLjExLDQxNS40OCwzMTQuMzQsNDAyLDMxNi42MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjY2U3NzYwIi8+PHBhdGggZD0iTTQ0Ni4xOSwyNTguODRhNjQuNDcsNjQuNDcsMCwwLDEsNyw1LjUzbC0uMS0uMDdhNDMsNDMsMCwwLDEsNy43Myw5LjQybDAtLjE3YTM4LjEzLDM4LjEzLDAsMCwxLDUuMzEsMTkuODljMCwuODksMCwxLjc4LS4wNSwyLjY3LDAsLjQ4LS4wNS45NS0uMDksMS40MiwwLC4yMiwwLC40NC0uMDUuNjdzMC0uMDcsMC0uMWMwLC4xNywwLC4zNC0uMDUuNWEyLDIsMCwwLDAsMS40OCwyLjM2LDIsMiwwLDAsMCwyLjM2LTEuNDgsNTUuNjIsNTUuNjIsMCwwLDAsLjEyLTEwLjMyYy0uNzQtMTMuNzUtMTAtMjUuNDYtMjEuMTQtMzIuODItMS0uNTQtMi4zMi0uNzUtMywuNDFhMS41NywxLjU3LDAsMCwwLC41NSwyLjA5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiMyZjE1MTUiLz48cGF0aCBkPSJNNDY2LjU2LDMwMC44YTUuNTIsNS41MiwwLDAsMSwxLjQ3LjQxLDYuNjEsNi42MSwwLDAsMSwxLjMuNzIsOC4wNSw4LjA1LDAsMCwxLDMuMzUsNy4zNyw4LjQ2LDguNDYsMCwwLDEtLjMzLDEuMzQsNS40Nyw1LjQ3LDAsMCwxLTYuNDIsMy45NWMtNC4yMi0xLjEzLTQuNjYtNi42Mi0yLjY0LTEwLjE3YTkuNDYsOS40NiwwLDAsMSwxLjEtMS42Nyw4LjY5LDguNjksMCwwLDEsMS4zNS0xLjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiMyZjE1MTUiLz48cGF0aCBkPSJNNDY2LjE2LDMwMi41MmE1LjQsNS40LDAsMCwxLDEuMTIuMjhjLS4zLS4xMi4yNi4xMi4yNS4xMi4xNy4wOC4zMy4xNy40OS4yNnMuNTEuMzguMTkuMTFsLjMzLjI4Yy4yMS4xOS40Mi4zOS42MS41OWwuMjkuMzFjLjA1LjA2LjM1LjQzLjA4LjA5LjE3LjIyLjM0LjQ1LjUuNjlzLjI1LjQuMzYuNjFsLjE5LjM4Yy0uMTktLjM5LjA2LjE3LjA4LjI1YTUuOTEsNS45MSwwLDAsMSwuMjQuODJsLjA2LjI4Yy0uMDgtLjQxLDAsLjA3LDAsLjEzYTguNjIsOC42MiwwLDAsMSwwLC44OGMwLC4wNi0uMDYuNTUsMCwuMTUsMCwuMjMtLjA3LjQ1LS4xMi42N3MtLjE1LjU1LS4yNC44My0uMDguMjgtLjEzLjQyYy4xNS0uNDMsMCwwLS4wNS4wOGE1LjQ4LDUuNDgsMCwwLDEtLjQzLjc0Yy4yNi0uMzksMCwwLS4wNi4wNnMtLjE4LjIxLS4yOC4zMWwtLjMuMjhjLS4zMy4zMS4zLS4xOC0uMDguMDZzLS40Ny4yOS0uNzEuNDMuMzQtLjExLS4wOCwwbC0uMzIuMTItLjMzLjA5LS4yNi4wNmMuMjIsMCwuMjMsMCwwLDBsLS44MSwwYy0uNDQsMCwuMzQuMDktLjA5LDBsLS4zNC0uMDctLjMzLS4xYy0uNDMtLjExLjMzLjE4LS4wNiwwLS4xNy0uMDktLjY5LS4yNS0uNzctLjQzbC4xOC4xMy0uMTktLjE1LS4yNi0uMjUtLjE3LS4xOGMtLjI5LS4yOS4yMS4zMiwwLDBhNS43LDUuNywwLDAsMS0uMzktLjYxYy0uMDYtLjExLS4yOC0uMzksMCwwYTIsMiwwLDAsMS0uMTctLjQ3LDUuOTQsNS45NCwwLDAsMS0uMTgtLjZjMC0uMTItLjA1LS4yNS0uMDctLjM3LjA4LjQ1LDAsMCwwLS4wN2E5LjE0LDkuMTQsMCwwLDEsMC0xLjU3YzAsLjQ2LDAsMCwwLS4wN2E0Ljg5LDQuODksMCwwLDEsLjA5LS41Myw5LjA4LDkuMDgsMCwwLDEsLjIyLS45bC4wOC0uMjYuMDktLjI1Yy0uMDkuMjQtLjEuMjYsMCwuMDdzLjI1LS41NS40LS44MmExMS40MywxMS40MywwLDAsMSwuNjItMS4wN3MuMjEtLjI4LDAtLjA2Yy4xNS0uMTkuMzEtLjM4LjQ3LS41NmExNS4xNSwxNS4xNSwwLDAsMSwxLjkzLTEuNjcsMS43OCwxLjc4LDAsMCwwLS4wNi0yLjUsMS44MiwxLjgyLDAsMCwwLTIuNS4wNWwtLjIyLjE5LS4wNSwwLS41Mi40MWE5LjI5LDkuMjksMCwwLDAtMS4xMywxLDExLjc3LDExLjc3LDAsMCwwLTEuNjIsMi4zNCwxMC44NywxMC44NywwLDAsMC0xLjI3LDMuNzZjLS4zNCwyLjY5LjE5LDUuNzgsMi40MSw3LjU5YTYuODIsNi44MiwwLDAsMCw4LjM2LjE5LDguNjUsOC42NSwwLDAsMCwzLjA1LTguNzcsOS42Niw5LjY2LDAsMCwwLTcuMzQtNy4yOSwxLjc3LDEuNzcsMCwwLDAtLjc5LDMuNDVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iIzJmMTUxNSIvPjxwYXRoIGQ9Ik00NjEuNDUsMzA0LjA1Yy0uMTcuMjMtLjM0LjQ3LS41My42OGExLDEsMCwwLDEtLjE3LjE4bC4xMi0uMDljLjEsMCwuNjItLjE0LjY1LS4wNWwtLjE2LDBjLS4xLDAtLjA4LDAsLjA1LDBzLjE1LjA2LjA2LDBsLS4xNi0uMDhjLS4yNy0uMTIuMTIuMDUuMDkuMDhsLS4wOC0uMDhjLS4xMS0uMTEtLjExLS4xLDAsMGwwLC4wNWEuNjQuNjQsMCwwLDEtLjA4LS4xNGMuMDgsMCwuMTMuNDEuMTMuNDYsMC0uMzEsMCwuMzEsMCwuMXMtLjA5LjE3LDAsMCwuMTMtLjI1LjE5LS4zNi4xLS4xNywwLDBhNS4xMyw1LjEzLDAsMCwxLC41NC0uNmMuMDktLjEuMTUtLjE0LDAsMGwuMzMtLjI0Yy4yLS4xMy40MS0uMjYuNjMtLjM4bC4zLS4xNC4xMS0uMDVjLjIzLS4wOS40Ni0uMTYuNjktLjI0YTIxLjMzLDIxLjMzLDAsMCwxLDMuMjMtLjg1bC0xLTMuMzlhNS43Myw1LjczLDAsMCwwLTMuNjMsMi40NWMtLjM4LjU2LS43NiwxLjEzLTEuMDksMS43Mi0uMTQuMjUtLjI3LjQ5LS4zOS43NWEzLjgyLDMuODIsMCwwLDAtLjMzLDEuNTMsMS43OSwxLjc5LDAsMCwwLDEuODMsMS43LDEuODIsMS44MiwwLDAsMCwxLjcxLTEuODNjMC0uNDMtLjA5LjI4LS4xLjI3YTIuNywyLjcsMCwwLDEsLjE1LS4yOWwuMzctLjY4Yy4yNi0uNDUuNTYtLjkxLjg2LTEuMzMtLjEuMTUsMCwwLC4wNSwwbC4yNC0uMjVjLjA5LS4wOS4xNy0uMTYsMCwwbC4yNS0uMTguMjctLjE2Yy4zNy0uMjItLjE0LDAsLjA5LS4wNXMuNDctLjE0LjcyLS4xOGExLjc3LDEuNzcsMCwwLDAsMS4xOC0yLjIsMS44MiwxLjgyLDAsMCwwLTIuMi0xLjE5LDE5LjI1LDE5LjI1LDAsMCwwLTQuMjIsMS4yMiw3LjQ1LDcuNDUsMCwwLDAtMy43OSwzLjE4LDMuNDMsMy40MywwLDAsMC0uNDMsMi41MSwzLjQ4LDMuNDgsMCwwLDAsMS40OCwxLjg5LDMuMTUsMy4xNSwwLDAsMCwyLjQyLjUxLDQuMTEsNC4xMSwwLDAsMCwyLjE1LTEuN0ExLjgyLDEuODIsMCwwLDAsNDY0LDMwNCwxLjc5LDEuNzksMCwwLDAsNDYxLjQ1LDMwNC4wNVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjMmYxNTE1Ii8+PHBhdGggZD0iTTM5NSwzMTQuNjJjLTUsMS42MS0xMC4xLDIuMTctMTUuMzIsMy41NC0yLjQ5LjQ4LTQuOTUuOS03LjQyLDEuMjdzLTQuOTMuNjktNy4zOC45NWMtMy4yNy4zMi02LjU1LjU5LTkuODQuODMtNDMuNDksMy4xOS04OC43LjUzLTEzMS4yNS00LjItMi41MS0uMjgtNS0uNTctNy40Ni0uOTEtMTUuMjMtMi43MS0zMi41MS04LjM3LTQwLjgzLTIyLjc4YTQ1LjMsNDUuMywwLDAsMS0yLjczLTUuNjQsNTQuMTksNTQuMTksMCwwLDEtMi4wOS02LjM4LDkyLjI5LDkyLjI5LDAsMCwxLTIuMi0xMS4yYy00LjI2LTQ2LjY1LTQuNDEtOTQuMTcsNC4zMy0xNDAuMjFhNDIuMjEsNDIuMjEsMCwwLDEsNi0xMiwzNS40NSwzNS40NSwwLDAsMSwxMC40Ni05LjUyYzEwLjc1LTYuMzksMjIuODgtNS42NSwzNC41Ni03LDQuMDctLjI3LDguMTUtLjQ4LDEyLjIzLS42NnE1NC40NS0yLjQ4LDEwOS0uODFjMjUuNTMuNzgsNTQuMzMtMyw3Ny40LDEwLjEsMjQuNjMsMTMuOTQsMjcuODYsNDEuNCwyOSw2Ni40NnExLDIyLjU3LjA2LDQ1LjE4LS4xOSw0LjUxLS40Nyw5Yy0xLDE2LjQ4LTEuMjQsMzIuOTEtNi4wNiw0OS4wNS01LjY2LDE4LjY5LTI0LjM2LDI5Ljc0LTQyLjYzLDMyLjkyUTM5OC43MywzMTMuNjYsMzk1LDMxNC42MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjMmYxNTE1Ii8+PHBhdGggZD0iTTE3MS40OCwyNDguMjFhNjUsNjUsMCwwLDEtOC41LDIuNmwuMTEsMGE0Mi45Miw0Mi45MiwwLDAsMS0xMi4xNCwxbC4xNi4wOGEzOC4xNSwzOC4xNSwwLDAsMS0xOS40LTYuOTFjLS43NC0uNS0xLjQ2LTEtMi4xNy0xLjU2bC0xLjEyLS44OC0uNTEtLjQyYy0uMTgtLjE0LDAsMCwuMDcuMDZsLS4zOS0uMzJhMiwyLDAsMCwwLTIuNzgtLjEyLDIsMiwwLDAsMC0uMTIsMi43OCw1NS4zOCw1NS4zOCwwLDAsMCw4LjQzLDZjMTEuNzQsNy4xOSwyNi42NCw2LjIyLDM5LDEuMjEsMS0uNSwxLjk0LTEuNDksMS4zNy0yLjcxYTEuNTYsMS41NiwwLDAsMC0yLS43NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjMmYxNTE1Ii8+PHBhdGggZD0iTTEyNS4zNywyNDEuMTlhNi43Niw2Ljc2LDAsMCwxLTEuMTcsMSw2LjU1LDYuNTUsMCwwLDEtMS4zMy42NWMtMi42NS44LTUuNzUuNjctOC0xLjQyYTguMDgsOC4wOCwwLDAsMS0uOTItMSw1LjQ2LDUuNDYsMCwwLDEsLjM5LTcuNTJjMy4zMi0yLjg0LDguMS0uMDksOS44NywzLjU5YTguNjUsOC42NSwwLDAsMSwuNzUsMS44NSw4LjEyLDguMTIsMCwwLDEsLjMsMS44NUMxMjUuMzEsMjQwLjQ0LDEyNS4zNCwyNDAuNzksMTI1LjM3LDI0MS4xOVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjMmYxNTE1Ii8+PHBhdGggZD0iTTEyNC4xOCwyMzkuODhhNS43OCw1Ljc4LDAsMCwxLS44Ny43N2MuMjctLjE5LS4yNC4xNC0uMjQuMTRsLS40OS4yNXMtLjYuMjEtLjIuMDlsLS40MS4xMWE4LjMzLDguMzMsMCwwLDEtLjg0LjE3LDMsMywwLDAsMS0uNDIuMDZjLS4wNywwLS41NS4wNS0uMTEsMGE4LjIzLDguMjMsMCwwLDEtLjg2LDBsLS43MSwwLS40Mi0uMDZjLjQzLjA3LS4xNy0uMDUtLjI1LS4wN2E1LjkyLDUuOTIsMCwwLDEtLjgxLS4yN2wtLjI3LS4xMWMuMzkuMTcsMCwwLS4xLS4wN2E2LDYsMCwwLDEtLjc1LS40OGMtLjA1LDAtLjQxLS4zNi0uMTItLjA5bC0uNDgtLjQ4Yy0uMTktLjIxLS4zNy0uNDMtLjU1LS42NmwtLjI3LS4zNGMuMjcuMzYsMCwwLDAtLjFhNS4yOCw1LjI4LDAsMCwxLS4zNi0uNzZjLjE3LjQyLDAsMCwwLS4wOWwtLjA5LS40MWMwLS4xMywwLS4yNy0uMDYtLjQxLS4wNy0uNDQsMCwuMzYsMC0uMDksMC0uMjgsMC0uNTUsMC0uODMsMC0uNDQtLjEuMzQsMC0uMDlsLjA5LS4zM2EzLDMsMCwwLDEsLjExLS4zMiwyLjc3LDIuNzcsMCwwLDEsLjEtLjI2Yy0uMS4yMS0uMTEuMjIsMCwuMDVhOC4wOSw4LjA5LDAsMCwxLC40NC0uNjljLjI1LS4zNi0uMjcuMjMuMDYtLjA3bC4yNS0uMjQuMjYtLjIyYy4zNC0uMjgtLjMzLjE4LDAsMCwuMTctLjA5LjYtLjQzLjgtLjM5bC0uMjEuMDguMjMtLjA3LjM2LS4wOC4yNCwwYy40LS4wNy0uMzksMCwwLDBsLjczLDBjLjExLDAsLjQ4LDAsMCwwYTEuNjcsMS42NywwLDAsMSwuNDguMTEsNS44OSw1Ljg5LDAsMCwxLC41OS4yMWwuMzUuMTRjLS40Mi0uMTgsMCwwLC4wNSwwYTkuNiw5LjYsMCwwLDEsMS4zMS44N2MtLjM2LS4yOCwwLDAsLjA1LDBsLjM5LjM3Yy4yMi4yMy40Mi40Ni42Mi43LjA1LjA3LjExLjE0LjE2LjIybC4xNi4yMWMtLjE1LS4yMS0uMTYtLjIzLDAtLjA2bC40Ni44Yy4xOS4zNy4zNi43My41MiwxLjExLDAsMCwuMTEuMzMsMCwuMDcuMDcuMjMuMTQuNDYuMTkuN2ExNC42MSwxNC42MSwwLDAsMSwuMjksMi41NCwxLjc4LDEuNzgsMCwwLDAsMi4wOSwxLjM3LDEuODIsMS44MiwwLDAsMCwxLjM3LTIuMSwyLjY0LDIuNjQsMCwwLDAsMC0uMjhjMC0uMzEsMCwuMjEsMC0uMDdzMC0uNDQsMC0uNjVhMTEsMTEsMCwwLDAtLjIxLTEuNTMsMTIuMDUsMTIuMDUsMCwwLDAtMS0yLjY2LDEwLjc0LDEwLjc0LDAsMCwwLTIuMzgtMy4xN2MtMi0xLjgxLTQuODctMy4xMy03LjYyLTIuMzNhNi44MSw2LjgxLDAsMCwwLTQuOSw2Ljc4LDguNjgsOC42OCwwLDAsMCw1LjQ5LDcuNDksOS42Nyw5LjY3LDAsMCwwLDEwLjE3LTEuOTEsMS44MSwxLjgxLDAsMCwwLC4xMS0yLjVBMS43OSwxLjc5LDAsMCwwLDEyNC4xOCwyMzkuODhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iIzJmMTUxNSIvPjxwYXRoIGQ9Ik0yNTIuNTUsMzUzYy0uNiw0Ljc3LDcsNS41MSw5LjkxLDYuMSwxMC4zNSwyLjEsMjAuODcuNCwzMS4yMS0xLDEuMTctLjI0LDIuMzQtLjQ3LDMuNTEtLjY3LDEwLjgtMS44LDIxLjM2LDEuMzcsMzIuMTMsMS43NEExNTQuODQsMTU0Ljg0LDAsMCwwLDM1Ni4xOCwzNThjMS40MS0uMiwzLjg3LS40MSw0Ljc3LTIuMzFhMi44NSwyLjg1LDAsMCwwLTEuMzUtNGMtNi4zNi0zLjE0LTEzLjI4LTMuMTUtMTkuOTItMy40OC0xMy41My0uNjctMjYuODksMy43OC00MC4zNywyLjY3YTcyLjM3LDcyLjM3LDAsMCwxLTguOTQtMS41NWMtMS0uMi0yLS40MS0zLS41OWE3MC4yNCw3MC4yNCwwLDAsMC0xNy4xOS0uODdjLTIuOTIuMTktNS44NC40Ny04Ljc0LjktMi40LjM1LTUuNjIuNC03LjY1LDJBMy4yMywzLjIzLDAsMCwwLDI1Mi41NSwzNTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iIzEzMTMxMyIgb3BhY2l0eT0iMC4wNSIvPjxwYXRoIGQ9Ik0zMzQuOTQsMjk1Yy0uMTEsMS41Ni0uMiwzLjEzLS40LDQuN3YtLjFhNC41OSw0LjU5LDAsMCwxLDAsLjcycS0uMjcsMi43Ni0uNiw1LjVjLS40NCwzLjcxLTEsNy40LTEuNTMsMTEuMDctMS4xMyw3LjMxLTIuNDYsMTQuNTUtMy44MiwyMS43Ny0uNzcsNC4wOS0xLjU1LDguMTgtMi4zMSwxMi4yNy0uMjUsMS4zNS4zMSwzLDEuMywzLjI4czItLjQyLDIuMjgtMS44NmMyLjczLTE0LjYyLDUuNzEtMjkuMTgsNy41NC00NC4xLjI3LTIuMTguNTItNC4zNy43My02LjU3cy40MS00LjQxLjU3LTYuNjRjLjEtMS40MS0uOTMtMi43OS0xLjg2LTIuNzQtMS4wOS4wNS0xLjc1LDEuMTctMS44NiwyLjdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iIzJmMTUxNSIvPjxwYXRoIGQ9Ik0zMjcuOTMsMzUyLjc3Yy40Mi4yNC44Ni40NiwxLjMxLjY3cy45Mi4zOCwxLjQuNTRhMjUuNjIsMjUuNjIsMCwwLDAsNi4wOS44MSw4LjIxLDguMjEsMCwwLDAsMS41MS0uMTgsOS4wNiw5LjA2LDAsMCwwLDEuMTMtLjMsNS4xNyw1LjE3LDAsMCwwLDEuMDktLjUxLDIuMDYsMi4wNiwwLDAsMCwuNjUtMi44NCw2LDYsMCwwLDAtMi40Ni0yLjUzLDYuODIsNi44MiwwLDAsMC0uODgtLjM3LDcuODIsNy44MiwwLDAsMC04LDIuMjFxLS4yOC4yOC0uNTQuNTdjLS4yMS41MS0uNzYuNzktMSwxLjNBNi4yNSw2LjI1LDAsMCwwLDMyNy45MywzNTIuNzdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iIzJmMTUxNSIvPjxwYXRoIGQ9Ik0zMjcuMTMsMzU0LjE0YTEzLjMyLDEzLjMyLDAsMCwwLDMuNzgsMS41MiwzNi4zOSwzNi4zOSwwLDAsMCw0LC42NiwxMi4xMiwxMi4xMiwwLDAsMCw0LjItLjI4LDUuMjIsNS4yMiwwLDAsMCwzLjQ0LTIuMTdjMS4yOS0yLjQzLS42OS01LjM1LTIuNzYtNi42MWE4LjY1LDguNjUsMCwwLDAtNy4yMy0uNjMsMTAuMTYsMTAuMTYsMCwwLDAtMy42NSwyLjIyYy0uMjEuMi0uNDIuNDItLjYyLjYzYTMuNDIsMy40MiwwLDAsMC0uNDYuNTZsLS4xMi4yMmMuMTItLjE2LjEzLS4xNywwLDBhNS42OSw1LjY5LDAsMCwwLTEuMTksMS43MywxLjU5LDEuNTksMCwxLDAsMi43NCwxLjYxYy4xLS4yMi4yMi0uNDIuMzMtLjYzcy4yNy0uMzcsMC0uMWwuMTctLjE4YTUuNDMsNS40MywwLDAsMCwuNTgtLjY5cy4yLS4zNS4wOS0uMTdsLjA3LS4wNy4yMS0uMjJjLjE3LS4xOC4zNC0uMzUuNTItLjUxbC4yMS0uMTkuMTctLjE0Yy0uMTguMTQuMTktLjEzLjE3LS4xM2wuMjktLjE5Yy4yMi0uMTQuNDQtLjI2LjY3LS4zOGwuMzctLjE4aDBsLjY1LS4yMi42NS0uMTcuMjcsMGMuMTgsMCwuMTgsMCwwLDBsLjI2LDBhOC4xNCw4LjE0LDAsMCwxLDEuMjEsMGMuMDcsMCwuNDkuMDkuMTEsMGwuMjYuMDVhNS4xNiw1LjE2LDAsMCwxLC43Ny4yMWwuMjYuMDljLS4xOS0uMDguMjkuMTQuMjUuMTJhNS42Niw1LjY2LDAsMCwxLC41OS4zNGMuMjUuMTcuMDUsMCwwLDBsLjMuMjcuMTkuMTkuMjIuMjZjLS4xNC0uMTguMTMuMTguMTIuMTdsLjE2LjI0LjIzLjM2Yy4xOC4yNiwwLDAsMCwwLDAsLjExLjIuNDYuMTYuNTdsMC0uMTlhMS43NywxLjc3LDAsMCwxLDAsLjIzdi4xMWMwLC4xOCwwLC4xNSwwLS4wOSwwLDAsMCwuMjEtLjA2LjIxbC4wOC0uMTctLjExLjE5Yy4xNC0uMjguMDgtLjE1LDAtLjA2bC4xNC0uMS0uMjIuMTMtLjI2LjE1cy0uNDYuMjEtLjE3LjA5Yy0uMjUuMS0uNTEuMTgtLjc4LjI2cy0uNTMuMTMtLjc5LjE4bC0uMjQsMC0uMzQsMGExMC45MywxMC45MywwLDAsMS0xLjgxLDBsLS45LS4wOWMtLjMxLDAsLjM3LjA2LS4xNSwwbC0uNDgtLjA4Yy0uNjItLjEtMS4yMy0uMjMtMS44NC0uMzZhMTEuMTIsMTEuMTIsMCwwLDEtMS42Mi0uNDZjLS41LS4xOS4xMi4wNi0uMTYtLjA2bC0uNTItLjI1Yy0uMy0uMTQtLjU4LS4yOS0uODctLjQ2YTEuNTksMS41OSwwLDAsMC0xLjYsMi43NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjMmYxNTE1Ii8+PHBhdGggZD0iTTI4MS43NiwyOTVjLjA3LjkzLjE0LDEuODUuMjIsMi43NywwLC40NC4wNy44Ny4xMSwxLjMxLDAsLjE5LDAsLjM4LjA1LjU4LDAtLjM2LjA1LjUuMDYuNTlxLjI3LDIuNzYuNiw1LjVjLjQ0LDMuNzEsMSw3LjQsMS41MywxMS4wNywxLjEzLDcuMzEsMi40NiwxNC41NSwzLjgyLDIxLjc3Ljc3LDQuMDksMS41NSw4LjE4LDIuMzEsMTIuMjcuMjUsMS4zNS0uMzEsMy0xLjMsMy4yOHMtMi0uNDItMi4yOC0xLjg2Yy0yLjczLTE0LjYyLTUuNy0yOS4xOC03LjU0LTQ0LjEtLjI3LTIuMTgtLjUyLTQuMzctLjczLTYuNTdzLS40MS00LjQtLjU3LTYuNjFjLS4xLTEuMzkuOTItMi43MywxLjg1LTIuNjcsMS4xLjA3LDEuNzYsMS4xOCwxLjg3LDIuNjdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iIzJmMTUxNSIvPjxwYXRoIGQ9Ik0yODguNzcsMzUyLjc3Yy0uNDIuMjQtLjg2LjQ2LTEuMzEuNjdzLS45Mi4zOC0xLjQuNTRhMjUuNjIsMjUuNjIsMCwwLDEtNi4wOS44MSw4LjIxLDguMjEsMCwwLDEtMS41MS0uMTgsOS41NCw5LjU0LDAsMCwxLTEuMTMtLjMsNS4xNyw1LjE3LDAsMCwxLTEuMDktLjUxLDIuMDYsMi4wNiwwLDAsMS0uNjUtMi44NCw2LDYsMCwwLDEsMi40Ni0yLjUzLDYuODIsNi44MiwwLDAsMSwuODgtLjM3LDcuODIsNy44MiwwLDAsMSw4LDIuMjFxLjI5LjI4LjU0LjU3Yy4yMS41MS43Ni43OSwxLDEuM0E2LjI1LDYuMjUsMCwwLDEsMjg4Ljc3LDM1Mi43N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjMmYxNTE1Ii8+PHBhdGggZD0iTTI4OS41NywzNTQuMTRhMTMuMzIsMTMuMzIsMCwwLDEtMy43OCwxLjUyLDM2LjM5LDM2LjM5LDAsMCwxLTQsLjY2LDEyLDEyLDAsMCwxLTQuMTktLjI4LDUuMjEsNS4yMSwwLDAsMS0zLjQ1LTIuMTdjLTEuMjktMi40My42OS01LjM1LDIuNzYtNi42MWE4LjY1LDguNjUsMCwwLDEsNy4yMy0uNjMsMTAuMTYsMTAuMTYsMCwwLDEsMy42NSwyLjIyYy4yMS4yLjQyLjQyLjYyLjYzYTMuNDIsMy40MiwwLDAsMSwuNDYuNTZsLjEyLjIyYy0uMTItLjE2LS4xMy0uMTcsMCwwYTUuNjksNS42OSwwLDAsMSwxLjE5LDEuNzMsMS41OSwxLjU5LDAsMSwxLTIuNzQsMS42MWMtLjEtLjIyLS4yMi0uNDItLjMzLS42M3MtLjI2LS4zNywwLS4xbC0uMTctLjE4YTYuNDIsNi40MiwwLDAsMS0uNTgtLjY5cy0uMi0uMzUtLjA5LS4xN2wtLjA2LS4wNy0uMjItLjIyYy0uMTctLjE4LS4zNC0uMzUtLjUyLS41MWwtLjIxLS4xOS0uMTctLjE0LS4xNy0uMTMtLjI5LS4xOWMtLjIyLS4xNC0uNDQtLjI2LS42Ny0uMzhsLS4zNy0uMThoMGwtLjY0LS4yMi0uNjYtLjE3LS4yNywwYy0uMTgsMC0uMTgsMCwwLDBsLS4yNiwwYTguMTUsOC4xNSwwLDAsMC0xLjIxLDBjLS4wNywwLS40OS4wOS0uMTEsMGwtLjI2LjA1YTUuMTYsNS4xNiwwLDAsMC0uNzcuMjFsLS4yNi4wOWMuMTktLjA4LS4yOS4xNC0uMjUuMTJhNS42Niw1LjY2LDAsMCwwLS41OS4zNGMtLjI1LjE3LS4wNSwwLDAsMGwtLjMuMjctLjE4LjE5cy0uMzQuNC0uMjMuMjYtLjEzLjE4LS4xMi4xN2wtLjE2LjI0LS4yMy4zNmMtLjE3LjI2LDAsMCwwLDAsMCwuMTEtLjIuNDYtLjE2LjU3bDAtLjE5YTEuNzcsMS43NywwLDAsMCwwLC4yM3YuMTFjMCwuMTgsMCwuMTUsMC0uMDksMCwwLDAsLjIxLjA2LjIxbC0uMDgtLjE3LjExLjE5Yy0uMTQtLjI4LS4wOC0uMTUsMC0uMDZsLS4xNC0uMS4yMi4xMy4yNi4xNXMuNDYuMjEuMTcuMDljLjI1LjEuNTEuMTguNzguMjZzLjUzLjEzLjc5LjE4bC4yNCwwYTIuMDcsMi4wNywwLDAsMCwuMzUsMCwxMC44MiwxMC44MiwwLDAsMCwxLjgsMGwuOS0uMDljLjMxLDAtLjM3LjA2LjE1LDBMMjgzLDM1M2MuNjItLjEsMS4yMy0uMjMsMS44NC0uMzZhMTEuMTIsMTEuMTIsMCwwLDAsMS42Mi0uNDZjLjUtLjE5LS4xMi4wNi4xNi0uMDZsLjUyLS4yNWE5LDksMCwwLDAsLjg3LS40NiwxLjU5LDEuNTksMCwwLDEsMS42LDIuNzVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iIzJmMTUxNSIvPjxwYXRoIGQ9Ik0zODcuNzMsMzIxLjk0Yy0zMy41Niw1LjgzLTY3LjY4LDYuNjYtMTAxLjYzLDUuODctMTUuOTQtLjM3LTMyLjIxLTItNDguMTMtMy4zNC0zLjg3LS4zMi04LS42MS0xMi4yNi0xLTIuMTItLjE4LTQuMjctLjM4LTYuNDItLjY1LTE4LjE3LTIuNjUtMzguNTctOC42LTQ4LjEtMjUuMzlhNDkuNTcsNDkuNTcsMCwwLDEtMi42Ny01LjcyLDUzLjgyLDUzLjgyLDAsMCwxLTEuOTItNiw5NC44NCw5NC44NCwwLDAsMS0yLjE4LTExLjQ3Yy0zLjg2LTQzLjY4LTQuMTMtODcuNjcsMi4xNC0xMzEuMTQsMi0xMy44Miw2LTI2Ljc4LDE4LjQzLTM0LjU1LDEwLjMzLTYuMzQsMjMuNDgtNi40NSwzNS4yNC03LjEzcTIyLjM0LTEuMzEsNDQuNzMtMS44NGMyNy41LS43MSw1NS0uNTgsODIuNTEuMjMsMjMuMTIuNjksNDcuNjUtMS44Miw2OC41LDEwLjM4LDI0LjM5LDE0LjI3LDI3LjU5LDQyLjQsMjguNzEsNjguMDhhNTM3LjY0LDUzNy42NCwwLDAsMS0xLjgzLDc0Yy0xLjksMjAtMy45Myw0MS0yMC4xNyw1NUM0MTMuNDMsMzE1LjI4LDQwMS4xMiwzMTkuNjEsMzg3LjczLDMyMS45NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjZDc4NTY4Ii8+PHBhdGggZD0iTTIwMi40NSwxMjAuNDhhMTguOTMsMTguOTMsMCwwLDAsMy42MS0uNjIsNyw3LDAsMCwwLDEuNjItLjYxLDIuNDQsMi40NCwwLDAsMCwxLjE2LTEuMjMsMi4yLDIuMiwwLDAsMC0uNy0yLjYsMi4zMiwyLjMyLDAsMCwwLTEuMzItLjNjLS41MiwwLTEsLjA5LTEuNTcuMTZhMjQuNDksMjQuNDksMCwwLDAtMi42OS41LDUsNSwwLDAsMC0yLjE0LjksMi4zOSwyLjM5LDAsMCwwLS40OSwyLjQyLDEuODYsMS44NiwwLDAsMCwxLjkzLDEuNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTIxNi44OCwxMTcuNzJhMTQuNjQsMTQuNjQsMCwwLDAsMy42OS0uMjRjMS4wNy0uMiwyLjQyLS40NiwzLTEuNTZhMi4xOSwyLjE5LDAsMCwwLS40Ny0yLjY1LDIuMywyLjMsMCwwLDAtMS4yOC0uNDIsMTMuNzEsMTMuNzEsMCwwLDAtMS41NywwYy0uOSwwLTEuOC4xMy0yLjcuMjVhNC41NSw0LjU1LDAsMCwwLTIuMjIuNjUsMi40MiwyLjQyLDAsMCwwLS43NSwyLjM2LDEuODQsMS44NCwwLDAsMCwxLjc3LDEuNTlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0yMzEuNiwxMTYuMjVhMTUuODcsMTUuODcsMCwwLDAsMy43MSwwYzEuMDktLjEyLDIuNDYtLjM0LDMuMDUtMS40MWEyLjE5LDIuMTksMCwwLDAtLjM0LTIuNjcsMi40LDIuNCwwLDAsMC0xLjI1LS40OGMtLjUxLS4wNi0xLS4wOC0xLjU2LS4xYTI0LjEsMjQuMSwwLDAsMC0yLjY5LjA4LDQuNzgsNC43OCwwLDAsMC0yLjI0LjUsMi4zOCwyLjM4LDAsMCwwLS45MiwyLjI5LDEuODQsMS44NCwwLDAsMCwxLjY1LDEuNzJBNS41OCw1LjU4LDAsMCwwLDIzMS42LDExNi4yNVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTI0Ni40NSwxMTUuNDdhMTUuNTQsMTUuNTQsMCwwLDAsMy43My4wN2MxLjEtLjExLDIuNDktLjMxLDMuMDgtMS4zN2EyLjE5LDIuMTksMCwwLDAtLjMtMi42NywyLjMxLDIuMzEsMCwwLDAtMS4yNC0uNWMtLjUxLS4wNy0xLS4wOS0xLjU1LS4xMmEyNCwyNCwwLDAsMC0yLjY4LDAsNC43OCw0Ljc4LDAsMCwwLTIuMjQuNDQsMi40LDIuNCwwLDAsMC0xLDIuMjUsMS44NSwxLjg1LDAsMCwwLDEuNiwxLjc4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNMjYxLjM5LDExNC44M2ExNS41MiwxNS41MiwwLDAsMCwzLjczLDBjMS4wOS0uMTUsMi40Ny0uMjksMy4wNi0xLjM0YTIuMjEsMi4yMSwwLDAsMC0uMy0yLjY4LDIuNTUsMi41NSwwLDAsMC0xLjI1LS41MywxMy40OCwxMy40OCwwLDAsMC0xLjU1LS4xMiwyNi43NywyNi43NywwLDAsMC0yLjY5LjA3LDQuODMsNC44MywwLDAsMC0yLjIzLjQ2LDIuNDIsMi40MiwwLDAsMC0xLDIuMjYsMS44NSwxLjg1LDAsMCwwLDEuNjIsMS43NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTI3Ni4yNiwxMTQuMzlhMTUuNDEsMTUuNDEsMCwwLDAsMy43MS4xNmMxLjEtLjA4LDIuNDgtLjI1LDMuMTEtMS4yOWEyLjE5LDIuMTksMCwwLDAtLjIxLTIuNjgsMi4zNSwyLjM1LDAsMCwwLTEuMjMtLjUzYy0uNTEtLjA5LTEtLjEyLTEuNTUtLjE2YTI0LjMzLDI0LjMzLDAsMCwwLTIuNywwLDQuODQsNC44NCwwLDAsMC0yLjI2LjM4LDIuNDEsMi40MSwwLDAsMC0xLDIuMjMsMS44NywxLjg3LDAsMCwwLDEuNTcsMS44MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTI5MS4xNSwxMTQuMjVhMTUuNTEsMTUuNTEsMCwwLDAsMy43Mi4yMmMxLjEtLjA2LDIuNDktLjIsMy4xMy0xLjIzYTIuMjEsMi4yMSwwLDAsMC0uMTgtMi42OSwyLjM5LDIuMzksMCwwLDAtMS4yMi0uNTVjLS41MS0uMDktMS0uMTQtMS41NC0uMTlhMjQuMTgsMjQuMTgsMCwwLDAtMi42OS0uMDksNC44NSw0Ljg1LDAsMCwwLTIuMjYuMzUsMi40MSwyLjQxLDAsMCwwLTEuMDgsMi4yMSwxLjg1LDEuODUsMCwwLDAsMS41MywxLjg0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNMzA2LjA2LDExNC4zMmExNSwxNSwwLDAsMCwzLjcxLjI2YzEuMTEsMCwyLjUtLjE2LDMuMTUtMS4xOWEyLjE5LDIuMTksMCwwLDAtLjE1LTIuNjksMi4zNCwyLjM0LDAsMCwwLTEuMjEtLjU2Yy0uNTEtLjEtMS0uMTUtMS41NC0uMjFhMjQuMSwyNC4xLDAsMCwwLTIuNjktLjEyLDQuODMsNC44MywwLDAsMC0yLjI2LjMyLDIuNCwyLjQsMCwwLDAtMS4xLDIuMiwxLjgzLDEuODMsMCwwLDAsMS41LDEuODVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0zMjEsMTE0LjU2YTE1LjA5LDE1LjA5LDAsMCwwLDMuNzIuMzFjMS4xLDAsMi40OS0uMTQsMy4xNi0xLjE2YTIuMTksMi4xOSwwLDAsMC0uMTItMi42OSwyLjMzLDIuMzMsMCwwLDAtMS4yMS0uNThjLS41LS4xLTEtLjE2LTEuNTQtLjIyYTI2LjU4LDI2LjU4LDAsMCwwLTIuNjgtLjE2LDQuODIsNC44MiwwLDAsMC0yLjI2LjMsMi40LDIuNCwwLDAsMC0xLjEzLDIuMTksMS44NSwxLjg1LDAsMCwwLDEuNDgsMS44N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTMzNS45MSwxMTQuOTNhMTQuMzksMTQuMzksMCwwLDAsMy43NS4yNWMxLjExLS4wNiwyLjUxLS4yLDMuMTUtMS4yNGEyLjIxLDIuMjEsMCwwLDAtLjItMi42OCwyLjMxLDIuMzEsMCwwLDAtMS4yMi0uNTVjLS41MS0uMDktMS0uMTMtMS41NC0uMThhMjYuMTcsMjYuMTcsMCwwLDAtMi42Ni0uMTEsNC44Nyw0Ljg3LDAsMCwwLTIuMjQuMzIsMi40MSwyLjQxLDAsMCwwLTEuMTIsMi4xOSwxLjgxLDEuODEsMCwwLDAsMS41LDEuODZBNS40NSw1LjQ1LDAsMCwwLDMzNS45MSwxMTQuOTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0zNTAuODgsMTE0LjkxYTE2LjExLDE2LjExLDAsMCwwLDMuNzIuMjJjMS4xLS4wNiwyLjQ4LS4yLDMuMTItMS4yMmEyLjE5LDIuMTksMCwwLDAtLjE2LTIuNjksMi40LDIuNCwwLDAsMC0xLjIyLS41NmMtLjUxLS4wOS0xLS4xNC0xLjU1LS4xOWEyNC4yNiwyNC4yNiwwLDAsMC0yLjY5LS4wOSw0LjY5LDQuNjksMCwwLDAtMi4yNi4zNiwyLjM5LDIuMzksMCwwLDAtMS4wNywyLjIyLDEuODQsMS44NCwwLDAsMCwxLjUzLDEuODNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0zNjUuNzEsMTE1LjE0YTE2LjI2LDE2LjI2LDAsMCwwLDMuNjYuNDNjMS4wOCwwLDIuNDUsMCwzLjE4LTFhMi4xOSwyLjE5LDAsMCwwLC4wNS0yLjY5LDIuMzcsMi4zNywwLDAsMC0xLjE4LS42NWMtLjUxLS4xMy0xLS4yMi0xLjU1LS4zYTIyLjM5LDIyLjM5LDAsMCwwLTIuNzEtLjI2LDQuNjEsNC42MSwwLDAsMC0yLjMuMjQsMi40LDIuNCwwLDAsMC0xLjE3LDIuMTcsMS44NSwxLjg1LDAsMCwwLDEuNDUsMS44OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTM4MC4yOSwxMTYuNjJjLjU3LjIxLDEuMTYuMzksMS43NS41NXMxLjIuMjUsMS43OC4zNWE3LjM4LDcuMzgsMCwwLDAsMS43MS4xMiwyLjI3LDIuMjcsMCwwLDAsMS41NS0uNjIsMi4xOCwyLjE4LDAsMCwwLC40OS0yLjY0LDIuNCwyLjQsMCwwLDAtMS4wOS0uODRjLS40OC0uMjEtMS0uMzYtMS41LS41M2EyMC40NSwyMC40NSwwLDAsMC0yLjY4LS42Myw0Ljc2LDQuNzYsMCwwLDAtMi4zNC0uMDYsMi4zNiwyLjM2LDAsMCwwLTEuNDEsMiwxLjg3LDEuODcsMCwwLDAsMS4yLDIuMDVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0zOTQuMjYsMTIwLjRhMTUuMjYsMTUuMjYsMCwwLDAsMS41OC44OSwxNS43MSwxNS43MSwwLDAsMCwxLjY0LjcyYzEsLjQxLDIuMjMuODYsMy4yNi4yNmEyLjE5LDIuMTksMCwwLDAsMS4xLTIuNDYsMi4zOCwyLjM4LDAsMCwwLS44Ny0xLjA3Yy0uNDMtLjMxLS45LS41OS0xLjM2LS44N2EyMC43LDIwLjcsMCwwLDAtMi41MS0xLjIxLDQuOTEsNC45MSwwLDAsMC0yLjMtLjUzLDIuMzYsMi4zNiwwLDAsMC0xLjc5LDEuNzEsMS44NSwxLjg1LDAsMCwwLC43OCwyLjIzQTUsNSwwLDAsMCwzOTQuMjYsMTIwLjRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik00MDYuNzMsMTI3LjM0YTE5LjcxLDE5LjcxLDAsMCwwLDIuNTQsMi40N2wuNjYuNWE0Ljc5LDQuNzksMCwwLDAsLjcxLjQ2LDIuMzgsMi4zOCwwLDAsMCwxLjY0LjI3LDIuMTcsMi4xNywwLDAsMCwxLjgzLTIsMi40MywyLjQzLDAsMCwwLS41LTEuMjljLS4xNS0uMjItLjMyLS40NC0uNDktLjY1cy0uMzYtLjQxLS41NC0uNjEtLjY1LS42OS0xLTEtLjcxLS42Mi0xLjA4LS45MmE5LjgsOS44LDAsMCwwLTEtLjc0LDMuMjksMy4yOSwwLDAsMC0xLjExLS40NSwyLjMsMi4zLDAsMCwwLTIuMTksMS4xNCwxLjg5LDEuODksMCwwLDAsLjExLDIuMzdDNDA2LjQ4LDEyNy4wNiw0MDYuNiwxMjcuMiw0MDYuNzMsMTI3LjM0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNNDE2LjIzLDEzNy44MWExOS43NiwxOS43NiwwLDAsMCwxLjYxLDMuMThjLjE0LjIzLjI5LjQ2LjQ2LjY5YTMuODEsMy44MSwwLDAsMCwuNTMuNjcsMi40NCwyLjQ0LDAsMCwwLDEuNDcuOCwyLjIsMi4yLDAsMCwwLDIuMzYtMS4zMSwyLjM4LDIuMzgsMCwwLDAtLjA2LTEuMzdBMTEuNTYsMTEuNTYsMCwwLDAsNDIyLDEzOWMtLjE4LS40My0uMzktLjg1LS42LTEuMjdzLS40Ny0uODEtLjcxLTEuMjFhNC41Nyw0LjU3LDAsMCwwLTEuNTYtMS44MSwyLjMsMi4zLDAsMCwwLTIuNDQuMzUsMS44MiwxLjgyLDAsMCwwLS43NCwxLDIuMTUsMi4xNSwwLDAsMCwwLDEuMjVDNDE2LjA5LDEzNy40Niw0MTYuMTYsMTM3LjYzLDQxNi4yMywxMzcuODFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik00MjIuMTUsMTUwLjg1YTEyLjQ5LDEyLjQ5LDAsMCwwLC4yOSwxLjhjLjE0LjU5LjI5LDEuMTguNDcsMS43NGE4LjIzLDguMjMsMCwwLDAsLjY1LDEuNTgsMi40MiwyLjQyLDAsMCwwLDEuMjYsMS4xMiwyLjIsMi4yLDAsMCwwLDIuNTktLjc2LDIuNDEsMi40MSwwLDAsMCwuMjUtMS4zMywxMy45LDEzLjksMCwwLDAtLjE5LTEuNTgsMjAuNjMsMjAuNjMsMCwwLDAtLjY0LTIuNjljLS4xMi0uMzktLjIyLS43Ny0uMzctMS4xM2EzLDMsMCwwLDAtLjY1LTEsMi4zLDIuMywwLDAsMC0yLjQ0LS4zNCwxLjg2LDEuODYsMCwwLDAtMS4yNywyQTUuNjcsNS42NywwLDAsMCw0MjIuMTUsMTUwLjg1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNNDI1LjE3LDE2NS4wOWExNi41OCwxNi41OCwwLDAsMCwuMjMsMy42N2MuMTgsMS4wNy40NCwyLjQyLDEuNTMsM2EyLjIxLDIuMjEsMCwwLDAsMi42Ni0uNDJBMi40MiwyLjQyLDAsMCwwLDQzMCwxNzBjMC0uNTIsMC0xLjA1LDAtMS41OGEyMC43OSwyMC43OSwwLDAsMC0uMjMtMi43Miw0LjY5LDQuNjksMCwwLDAtLjY1LTIuMjIsMi4zNCwyLjM0LDAsMCwwLTIuMzUtLjc1LDEuODYsMS44NiwwLDAsMC0xLjYsMS43NkM0MjUuMiwxNjQuNyw0MjUuMTksMTY0LjksNDI1LjE3LDE2NS4wOVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTQyNi40NiwxNzkuNzlhMTYsMTYsMCwwLDAsMCwzLjcyYy4xLDEuMDkuMywyLjQ3LDEuMzYsMy4wNmEyLjIsMi4yLDAsMCwwLDIuNjgtLjI4QTIuNDQsMi40NCwwLDAsMCw0MzEsMTg1Yy4wNy0uNTEuMS0xLC4xMi0xLjU1YTIwLjI4LDIwLjI4LDAsMCwwLDAtMi43LDQuNzIsNC43MiwwLDAsMC0uNDYtMi4yNSwyLjQsMi40LDAsMCwwLTIuMjctMSwxLjg2LDEuODYsMCwwLDAtMS43NSwxLjYzQzQyNi41MiwxNzkuNCw0MjYuNDksMTc5LjU5LDQyNi40NiwxNzkuNzlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik00MjcsMTk0LjY1YTE0LjkyLDE0LjkyLDAsMCwwLS4xNiwzLjcxYy4wNywxLjEuMjIsMi40OCwxLjI2LDMuMTFhMi4xOSwyLjE5LDAsMCwwLDIuNjgtLjIsMi4zNywyLjM3LDAsMCwwLC41NC0xLjIzYy4wOS0uNTEuMTMtMSwuMTgtMS41NS4wNy0uOS4wNy0xLjgsMC0yLjdhNC42OSw0LjY5LDAsMCwwLS4zOS0yLjI1LDIuMzksMi4zOSwwLDAsMC0yLjI0LTEsMS44NCwxLjg0LDAsMCwwLTEuOCwxLjU2QzQyNy4wNSwxOTQuMjUsNDI3LDE5NC40NSw0MjcsMTk0LjY1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNNDI3LDIwOS41MWExNi42MiwxNi42MiwwLDAsMC0uMjgsMy43MWMwLDEuMS4xNSwyLjQ4LDEuMTYsMy4xNWEyLjIxLDIuMjEsMCwwLDAsMi42OS0uMTIsMi4zOCwyLjM4LDAsMCwwLC41OS0xLjIxYy4xLS41MS4xNS0xLC4yMS0xLjU0YTI0LjQzLDI0LjQzLDAsMCwwLC4xNS0yLjcsNC44OSw0Ljg5LDAsMCwwLS4zMi0yLjI3LDIuNCwyLjQsMCwwLDAtMi4yLTEuMSwxLjg1LDEuODUsMCwwLDAtMS44NiwxLjVDNDI3LjExLDIwOS4xMiw0MjcuMDYsMjA5LjMyLDQyNywyMDkuNTFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik00MjYuNTksMjI0LjM3YTE1LjQ4LDE1LjQ4LDAsMCwwLS40LDMuN2MwLDEuMDkuMDYsMi40OCwxLjA2LDMuMThhMi4xOSwyLjE5LDAsMCwwLDIuNjksMCwyLjQsMi40LDAsMCwwLC42Mi0xLjE5Yy4xMi0uNS4xOS0xLC4yNy0xLjU0YTIxLjY4LDIxLjY4LDAsMCwwLC4yMi0yLjY4LDQuODcsNC44NywwLDAsMC0uMjMtMi4yOCwyLjQyLDIuNDIsMCwwLDAtMi4xNy0xLjE4LDEuODQsMS44NCwwLDAsMC0xLjksMS40NUM0MjYuNjksMjI0LDQyNi42NCwyMjQuMTgsNDI2LjU5LDIyNC4zN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTQyNS42NywyMzkuMjFhMTUuMzMsMTUuMzMsMCwwLDAtLjUyLDMuNjdjMCwxLjEsMCwyLjQ5LDEsMy4yMmEyLjE5LDIuMTksMCwwLDAsMi42OS4wNiwyLjM2LDIuMzYsMCwwLDAsLjY2LTEuMTdjLjE0LS41LjIzLTEsLjMyLTEuNTJhMjYuODMsMjYuODMsMCwwLDAsLjMyLTIuNjgsNC44LDQuOCwwLDAsMC0uMTctMi4yOSwyLjM4LDIuMzgsMCwwLDAtMi4xMy0xLjI0LDEuODIsMS44MiwwLDAsMC0xLjk0LDEuMzhDNDI1Ljc4LDIzOC44Miw0MjUuNzMsMjM5LDQyNS42NywyMzkuMjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik00MjQuMjgsMjU0YTE2LjM2LDE2LjM2LDAsMCwwLS42NCwzLjY0Yy0uMDgsMS4wOS0uMTIsMi40Ni44MSwzLjI0YTIuMTksMi4xOSwwLDAsMCwyLjY4LjE5LDIuMzgsMi4zOCwwLDAsMCwuNzItMS4xNWMuMTUtLjQ5LjI3LTEsLjM4LTEuNTJhMjEuOTQsMjEuOTQsMCwwLDAsLjQxLTIuNjgsNC42Nyw0LjY3LDAsMCwwLS4wOS0yLjI5LDIuMzksMi4zOSwwLDAsMC0yLjA5LTEuMzEsMS44NCwxLjg0LDAsMCwwLTIsMS4zMkM0MjQuNCwyNTMuNjMsNDI0LjM0LDI1My44Miw0MjQuMjgsMjU0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNNDIyLDI2OC41M0ExOCwxOCwwLDAsMCw0MjEsMjcyYTcuMTEsNy4xMSwwLDAsMC0uMjEsMS42OSwyLjM0LDIuMzQsMCwwLDAsLjUzLDEuNTksMi4xNywyLjE3LDAsMCwwLDIuNjEuNjQsMi40LDIuNCwwLDAsMCwuOS0xYy4yMy0uNDcuNDItMSwuNjItMS40N2EyMC43LDIwLjcsMCwwLDAsLjc3LTIuNjYsNC44Niw0Ljg2LDAsMCwwLC4xNy0yLjMzLDIuMzYsMi4zNiwwLDAsMC0xLjk1LTEuNTIsMS44OCwxLjg4LDAsMCwwLTIuMTEsMS4xMUM0MjIuMTksMjY4LjE3LDQyMi4xMSwyNjguMzUsNDIyLDI2OC41M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTQxNy4zOCwyODIuMTNhMTUuMzUsMTUuMzUsMCwwLDAtMSwxLjQ3LDE2Ljc2LDE2Ljc2LDAsMCwwLS44OCwxLjUzLDcuMjIsNy4yMiwwLDAsMC0uNjcsMS41MiwyLjM4LDIuMzgsMCwwLDAsLjA1LDEuNjYsMi41MiwyLjUyLDAsMCwwLC45MiwxLjEsMS43OCwxLjc4LDAsMCwwLDEuMzguMywyLjQ0LDIuNDQsMCwwLDAsMS4xNy0uNzRjLjM3LS40LjctLjg0LDEtMS4yN2ExNy4zMywxNy4zMywwLDAsMCwxLjQ3LTIuNCw0LjY1LDQuNjUsMCwwLDAsLjc2LTIuMjYsMi4zMywyLjMzLDAsMCwwLTEuNTUtMS45MywxLjg3LDEuODcsMCwwLDAtMS4yNi0uMTIsMi4yOSwyLjI5LDAsMCwwLTEsLjY5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNNDA5LDI5My40OGMtLjQ5LjMyLTEsLjY1LTEuNDYsMXMtLjkzLjc0LTEuMzUsMS4xMmE3Ljg3LDcuODcsMCwwLDAtLjYuNTcsNC45MSw0LjkxLDAsMCwwLS41Ny42MywyLjQ2LDIuNDYsMCwwLDAtLjUyLDEuNTgsMi4xOCwyLjE4LDAsMCwwLDEuNjgsMi4xMSwyLjQ1LDIuNDUsMCwwLDAsMS4zNC0uMjlxLjM2LS4xOC43Mi0uMzlsLjY4LS40NGMuNC0uMjYuNzgtLjUzLDEuMTYtLjgybDEuMDctLjkyYTguODMsOC44MywwLDAsMCwuODgtLjg1LDMsMywwLDAsMCwuNjItMSwyLjMyLDIuMzIsMCwwLDAtLjgxLTIuMzUsMS44NSwxLjg1LDAsMCwwLTEuMTQtLjUzLDIuMjIsMi4yMiwwLDAsMC0xLjIuMjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0zOTcuMiwzMDEuMzlhMTguNjcsMTguNjcsMCwwLDAtMy4zOCwxLjIzbC0uNzQuMzlhMy45MSwzLjkxLDAsMCwwLS43My40NiwyLjM5LDIuMzksMCwwLDAtMSwxLjM5LDIuMjEsMi4yMSwwLDAsMCwxLjA4LDIuNDcsMi4zMywyLjMzLDAsMCwwLDEuMzYuMDgsMTIuMTcsMTIuMTcsMCwwLDAsMS41NS0uNHEuNjYtLjE5LDEuMzItLjQ1Yy40My0uMTYuODUtLjM2LDEuMjctLjU1YTkuODMsOS44MywwLDAsMCwxLjA4LS41MywzLjE3LDMuMTcsMCwwLDAsLjg5LS43OCwyLjMsMi4zLDAsMCwwLDAtMi40NywxLjg4LDEuODgsMCwwLDAtMi4xNi0xWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNMzgzLjUyLDMwNi4xMWExNiwxNiwwLDAsMC0xLjgyLjE5Yy0uNjEuMS0xLjIxLjI1LTEuNzguMzlhNy4zMiw3LjMyLDAsMCwwLTEuNjIuNTgsMi4zMiwyLjMyLDAsMCwwLTEuMTgsMS4yMSwyLjE5LDIuMTksMCwwLDAsLjY1LDIuNjEsMi40MiwyLjQyLDAsMCwwLDEuMzIuMzJjLjUzLDAsMS4wNi0uMDcsMS41OC0uMTJhMjIuNDcsMjIuNDcsMCwwLDAsMi43LS40OSw0Ljc5LDQuNzksMCwwLDAsMi4xNi0uODgsMi4zNSwyLjM1LDAsMCwwLC41LTIuNDIsMS44NywxLjg3LDAsMCwwLTEuOTItMS40WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNMzY5LDMwOC43M2ExNS4yMiwxNS4yMiwwLDAsMC0zLjcuMzFjLTEuMDguMi0yLjQzLjUyLTIuOTMsMS42M2EyLjE4LDIuMTgsMCwwLDAsLjUzLDIuNjMsMi4zMywyLjMzLDAsMCwwLDEuMjkuMzljLjUxLDAsMSwwLDEuNTYsMGEyNC4xLDI0LjEsMCwwLDAsMi42OC0uMjgsNC44NCw0Ljg0LDAsMCwwLDIuMi0uNjcsMi40MSwyLjQxLDAsMCwwLC43NC0yLjM1LDEuODMsMS44MywwLDAsMC0xLjc4LTEuNTlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0zNTQuMywzMTAuNTlhMTQuOCwxNC44LDAsMCwwLTMuNzEuMTVjLTEuMDkuMTctMi40NS40My0zLDEuNTJhMi4yMSwyLjIxLDAsMCwwLC40MywyLjY2LDIuMzksMi4zOSwwLDAsMCwxLjI3LjQzYy41MiwwLDEsMCwxLjU2LDBhMjQuNDgsMjQuNDgsMCwwLDAsMi43LS4xOCw0LjU4LDQuNTgsMCwwLDAsMi4yMS0uNTgsMi4zOSwyLjM5LDAsMCwwLC44NC0yLjMyLDEuODMsMS44MywwLDAsMC0xLjcxLTEuNjZBNS45LDUuOSwwLDAsMCwzNTQuMywzMTAuNTlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0zMzkuNSwzMTEuODhhMTYsMTYsMCwwLDAtMy43MiwwYy0xLjA5LjEzLTIuNDYuMzUtMywxLjQyYTIuMiwyLjIsMCwwLDAsLjMzLDIuNjcsMi40NywyLjQ3LDAsMCwwLDEuMjYuNDhjLjUxLjA2LDEsLjA3LDEuNTYuMDkuODksMCwxLjc5LDAsMi42OS0uMDhhNSw1LDAsMCwwLDIuMjQtLjUsMi40MywyLjQzLDAsMCwwLC45Mi0yLjI5LDEuODQsMS44NCwwLDAsMC0xLjY2LTEuNzJBNS44MSw1LjgxLDAsMCwwLDMzOS41LDMxMS44OFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTMyNC42NSwzMTIuNjdhMTUuNDYsMTUuNDYsMCwwLDAtMy43Mi0uMWMtMS4wOS4xLTIuNDcuMjctMy4wOCwxLjMyYTIuMiwyLjIsMCwwLDAsLjI1LDIuNjgsMi4zMywyLjMzLDAsMCwwLDEuMjQuNTJjLjUxLjA4LDEsLjExLDEuNTUuMTQuOS4wNiwxLjgsMCwyLjcsMGE0Ljg0LDQuODQsMCwwLDAsMi4yNS0uNDMsMi40MSwyLjQxLDAsMCwwLDEtMi4yNiwxLjgzLDEuODMsMCwwLDAtMS41OS0xLjc3QTUuNTksNS41OSwwLDAsMCwzMjQuNjUsMzEyLjY3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNMzA5Ljc4LDMxM2ExNS40NCwxNS40NCwwLDAsMC0zLjcxLS4yYy0xLjEuMDYtMi40OC4yLTMuMTMsMS4yM2EyLjIxLDIuMjEsMCwwLDAsLjE5LDIuNjksMi4zNSwyLjM1LDAsMCwwLDEuMjIuNTVjLjUxLjA5LDEsLjEzLDEuNTUuMThhMjQuMSwyNC4xLDAsMCwwLDIuNjkuMDgsNC43Myw0LjczLDAsMCwwLDIuMjYtLjM2LDIuNDEsMi40MSwwLDAsMCwxLjA2LTIuMjMsMS44NSwxLjg1LDAsMCwwLTEuNTQtMS44MkMzMTAuMTcsMzEzLjA5LDMxMCwzMTMsMzA5Ljc4LDMxM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTI5NC45NCwzMTIuOWExNS4zMywxNS4zMywwLDAsMC0zLjY5LS4zOWMtMS4xLDAtMi41LjA5LTMuMTgsMS4wOWEyLjE5LDIuMTksMCwwLDAsLjA2LDIuNjksMi4zOCwyLjM4LDAsMCwwLDEuMi42MWMuNS4xMSwxLC4xOCwxLjUzLjI2YTI2LjYsMjYuNiwwLDAsMCwyLjY5LjIxLDQuNzUsNC43NSwwLDAsMCwyLjI4LS4yNCwyLjM4LDIuMzgsMCwwLDAsMS4xNS0yLjE5LDEuOTEsMS45MSwwLDAsMC0uMzktMS4yMSwyLjIxLDIuMjEsMCwwLDAtMS4wNy0uNjdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0yODAuMDYsMzEyLjE5YTE1LjU3LDE1LjU3LDAsMCwwLTMuNzEtLjQxYy0xLjEsMC0yLjQ5LjA3LTMuMTksMS4wNmEyLjIxLDIuMjEsMCwwLDAsMCwyLjY5LDIuNCwyLjQsMCwwLDAsMS4xOS42MmMuNS4xMiwxLC4xOSwxLjUzLjI3Ljg5LjEzLDEuNzkuMTksMi42OC4yM2E0Ljg1LDQuODUsMCwwLDAsMi4yNy0uMjMsMi40MiwyLjQyLDAsMCwwLDEuMi0yLjE2LDEuODUsMS44NSwwLDAsMC0xLjQzLTEuOTFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0yNjUuMTksMzExLjMyYTE2LjEyLDE2LjEyLDAsMCwwLTMuNy0uNDhjLTEuMDksMC0yLjQ5LDAtMy4yLDFhMi4xOSwyLjE5LDAsMCwwLDAsMi42OSwyLjM3LDIuMzcsMCwwLDAsMS4xOC42NWMuNS4xMiwxLC4yLDEuNTIuMjkuODkuMTUsMS43OS4yMywyLjY4LjI5YTQuNzYsNC43NiwwLDAsMCwyLjI4LS4yLDIuMzksMi4zOSwwLDAsMCwxLjIzLTIuMTMsMS44NiwxLjg2LDAsMCwwLTEuNC0xLjk0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNMjUwLjM2LDMxMC4xM2ExNS40NCwxNS40NCwwLDAsMC0zLjY3LS41OWMtMS4xLS4wNS0yLjQ4LS4wNy0zLjIzLjg5YTIuMTksMi4xOSwwLDAsMC0uMTEsMi42OSwyLjMyLDIuMzIsMCwwLDAsMS4xNi42OCwxNS4yNSwxNS4yNSwwLDAsMCwxLjUyLjM1LDIzLjc5LDIzLjc5LDAsMCwwLDIuNjcuMzYsNC42Nyw0LjY3LDAsMCwwLDIuMjktLjEyLDIuNCwyLjQsMCwwLDAsMS4yOC0yLjExLDEuODUsMS44NSwwLDAsMC0xLjM0LTJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0yMzUuNjEsMzA4LjQzYTE0LjgxLDE0LjgxLDAsMCwwLTMuNjQtLjc0Yy0xLjA5LS4xLTIuNDctLjE4LTMuMjYuNzRhMi4xOSwyLjE5LDAsMCwwLS4yMywyLjY4LDIuMzMsMi4zMywwLDAsMCwxLjEyLjc0Yy40OS4xNywxLC4yOSwxLjUxLjQyYTI2LjkzLDI2LjkzLDAsMCwwLDIuNjYuNDcsNC43MSw0LjcxLDAsMCwwLDIuMywwLDIuNCwyLjQsMCwwLDAsMS4zNi0yLjA2LDEuODMsMS44MywwLDAsMC0xLjI2LTJDMjM2LDMwOC41NiwyMzUuOCwzMDguNDksMjM1LjYxLDMwOC40M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTIyMSwzMDZhMTUsMTUsMCwwLDAtMy41Ni0uOTQsNy42Nyw3LjY3LDAsMCwwLTEuNzQtLjA4LDIuNCwyLjQsMCwwLDAtMS41NS42MiwyLjE5LDIuMTksMCwwLDAtLjQ4LDIuNjUsMi4zNiwyLjM2LDAsMCwwLDEuMDguODRjLjQ5LjE5LDEsLjMzLDEuNS40OGEyNi44LDI2LjgsMCwwLDAsMi42NS42Miw0Ljc3LDQuNzcsMCwwLDAsMi4zMS4xMSwyLjM0LDIuMzQsMCwwLDAsMS40Ny0yLDEuODUsMS44NSwwLDAsMC0xLjE1LTIuMDlBNS4wNSw1LjA1LDAsMCwwLDIyMSwzMDZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iI2I4NjU0ZiIvPjxwYXRoIGQ9Ik0yMDYuNiwzMDIuNjRhMTYsMTYsMCwwLDAtMy41MS0xLjE5Yy0xLjA3LS4yMy0yLjQyLS40OC0zLjMyLjMzYTIuMjEsMi4yMSwwLDAsMC0uNTksMi42MywyLjM3LDIuMzcsMCwwLDAsMSwuODdjLjQ3LjIzLDEsLjQyLDEuNDUuNjFhMjIuODQsMjIuODQsMCwwLDAsMi41OS44LDQuNjcsNC42NywwLDAsMCwyLjI4LjI1LDIuNDEsMi40MSwwLDAsMCwxLjYxLTEuODcsMS44NSwxLjg1LDAsMCwwLTEtMi4xNkE1LjI4LDUuMjgsMCwwLDAsMjA2LjYsMzAyLjY0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNiODY1NGYiLz48cGF0aCBkPSJNNDU4LjA1LDE5OC4zMWMtNS4zNS0xLjM2LTExLjYyLDAtMTYuOTMtLjI5LTYuNTctLjM0LTEzLjE2LS41NC0xOS43NC0uMzMtOC45LjI4LTE0LjY5LDQuOTQtMTcuNSwxMi41MWEyOS43OCwyOS43OCwwLDAsMC0xLjM0LDQuODgsMjUuNTYsMjUuNTYsMCwwLDAtLjQ2LDUuMTUsMjYuMzgsMjYuMzgsMCwwLDAsLjU3LDUuMWMxLjc2LDkuOSwxMCwxOC42OCwxOS44OSwxOS44MSwxNSwyLDM0LjU1LDQuMjUsNDMuMzQtMTAuOWEyOC41OCwyOC41OCwwLDAsMCwyLjI3LTYuMjQsMzguNTcsMzguNTcsMCwwLDAsLjEtMTcuNzVjLS45LTMuOTItMi4zOS03LjU1LTUuOC0xMEExMy4yLDEzLjIsMCwwLDAsNDU4LjA1LDE5OC4zMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjYjg2NTRmIi8+PHBhdGggZD0iTTI0OS45MiwyMzQuN2ExMi4zNywxMi4zNywwLDAsMSw5LjI0LTEyLjI1LDExLjExLDExLjExLDAsMCwxLDExLjExLDMuODIsMTIuODMsMTIuODMsMCwwLDEsMi4zMSwxMiwxMiwxMiwwLDAsMS0xMCw4LjU1LDExLjYxLDExLjYxLDAsMCwxLTExLjctNy4zOEExMi45LDEyLjksMCwwLDEsMjQ5LjkyLDIzNC43WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiMyZjE1MTUiLz48cGF0aCBkPSJNMjU1LjcyLDIzMy4xNmE0LjMsNC4zLDAsMCwxLDIuODItMy44OSw0LDQsMCwwLDEsNS4xNCw0LjI4LDQsNCwwLDAsMS0yLjUxLDMuMjUsMy44NywzLjg3LDAsMCwxLTQuMzEtLjgyQTMuOTQsMy45NCwwLDAsMSwyNTUuNzIsMjMzLjE2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMzMzLjY1LDIzNC42N2ExMi40NiwxMi40NiwwLDAsMSw4LjQ1LTEyLjA3YzYuMDgtMS43NiwxMi40NywyLjA3LDE0LjI1LDguM0ExMi45MywxMi45MywwLDAsMSwzNTIuOTEsMjQ0LDExLjIsMTEuMiwwLDAsMSwzNDEsMjQ2LjEyYTEyLjM2LDEyLjM2LDAsMCwxLTYuOS04LjE3QTEzLDEzLDAsMCwxLDMzMy42NSwyMzQuNjdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODEuMTEgLTk5LjE3KSIgZmlsbD0iIzJmMTUxNSIvPjxwYXRoIGQ9Ik0zMzkuMjQsMjMzLjIyYTQuMTMsNC4xMywwLDAsMSwyLjQ1LTMuNzEsNCw0LDAsMCwxLDMuNjcsNywzLjg4LDMuODgsMCwwLDEtNS0uNUEzLjk0LDMuOTQsMCwwLDEsMzM5LjI0LDIzMy4yMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTI2MC40NCwyNDguODVoLS4xM2MtMy41Ni41MS04LjIzLDIuNS05LjI3LDYuMzRzMyw2LjcyLDYuMjksNy41N2ExNS41NCwxNS41NCwwLDAsMCwxMC40NS0xLjE3YzIuOTMtMS40Miw1LjY1LTQuMzksNC03Ljc5QzI2OS43NSwyNDkuNzMsMjY0LjYyLDI0OC4zNCwyNjAuNDQsMjQ4Ljg1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNmYWJiYTkiLz48cGF0aCBkPSJNMzQ2LjU1LDI0OC43OWgtLjE0Yy0zLjkyLS40OC04LjEzLjYzLTEwLjYxLDMuODlhNSw1LDAsMCwwLTEsNC42LDcuMDgsNy4wOCwwLDAsMCwzLjEzLDMuNjNBMTUuNDUsMTUuNDUsMCwwLDAsMzQ4LjE0LDI2M2MzLjI4LS40OCw3Ljc1LTIuNjEsNy44Ni02LjQ1QzM1Ni4xMywyNTEuODgsMzUwLjM3LDI0OS4zNCwzNDYuNTUsMjQ4Ljc5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNmYWJiYTkiLz48cGF0aCBkPSJNMTg5LjUzLDE0Mi4zNWMtNi40NCw1Ljg3LTkuNDMsMTguMjgtNi4xOCwyNy4wN2ExNS44NCwxNS44NCwwLDAsMCwyLjcyLDQuNzVjMS4zNSwxLjMzLDIuOTIsMi42OSw0Ljg1LDIuNTEsMTIuNzctLjQ0LDE1LjU1LTE4LjY3LDE0LTI4LjQtLjc4LTUtNC42Mi0xMC41LTEwLjMtOC41N0ExMS4yNywxMS4yNywwLDAsMCwxODkuNTMsMTQyLjM1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTg1LjM3LDE4OGExMi41LDEyLjUsMCwwLDAtMywxMC40OGMxLDQuODMsNC44NCwxMS4zMSwxMC4yLDkuMzMsNi4xMS0yLjM1LDcuNTMtMTAuNDksNS45Mi0xNi41NGE4LjcyLDguNzIsMCwwLDAtNS40LTYuMTRDMTkwLjIxLDE4NC4yLDE4Ny40LDE4NS42OSwxODUuMzcsMTg4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMzA0LjUzLDI1Mi43NmMtMy4yLTMuNjItNy44My0xLjExLTEwLDIuMjRhMTMuNDEsMTMuNDEsMCwwLDAsOS44OSwzLjY5LDE0LjI4LDE0LjI4LDAsMCwwLDkuNjItNUMzMTEuMjYsMjUxLDMwNy41MiwyNDkuMjcsMzA0LjUzLDI1Mi43NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04MS4xMSAtOTkuMTcpIiBmaWxsPSIjZmFiYmE5Ii8+PHBhdGggZD0iTTMxNy41NCwyNDQuOGEyLjg2LDIuODYsMCwwLDAtMy0yYy0yLjExLDAtNCwxLjMxLTYsMS44MWEyMy4yOSwyMy4yOSwwLDAsMS0xMC42LjIyYy0xLjktLjQtNC4yMi0xLjQ0LTYuMTQtLjY1LTIuNiwxLjA3LTEuODcsNC42NC0uNzcsNi41OGExNy4yNywxNy4yNywwLDAsMCwzLjQ1LDQuMjhjMi4xNC0zLjM1LDYuNzctNS44NiwxMC0yLjI0LDMtMy40OSw2LjczLTEuNzcsOS41NC45YTE1Ljc5LDE1Ljc5LDAsMCwwLDMuNTEtN0EzLjg3LDMuODcsMCwwLDAsMzE3LjU0LDI0NC44WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgxLjExIC05OS4xNykiIGZpbGw9IiMyZjE1MTUiLz48Y2lyY2xlIGN4PSIzNDUuODciIGN5PSIxMjIuMTYiIHI9IjExLjA0IiBmaWxsPSIjZjJkZTY3Ii8+PGVsbGlwc2UgY3g9IjM0NC4xMiIgY3k9IjEyMS42MSIgcng9IjQuMDMiIHJ5PSI0LjU5IiBmaWxsPSIjZmZmIi8+PC9zdmc+", alt: "DePay", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 200}})
                , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName$1, lineNumber: 201}}, "Receive your first Web3 Payment with DePay."      )
              )
            )
          )
        )
      )
    } else {
      return(
        React.createElement(Fragment, {__self: this, __source: {fileName: _jsxFileName$1, lineNumber: 209}}
          , React.createElement('div', {
            className: "woocommerce-report-table__scroll-point",
            ref:  scrollPointRef ,
            'aria-hidden': true, __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 210}}
          )
          , React.createElement(TableCard, {
            className:  'woocommerce-report-table' ,
            title: "Transactions",
            query: query,
            actions: [],
            headers:  filteredHeaders ,
            isLoading:  isLoading ,
            showMenu:  false ,
            rows:  rows ,
            onQueryChange:  onQueryChange ,
            rowsPerPage:  getCurrentPerPage() ,
            summary:  summary ,
            totalRows:  totalRows , __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 215}}
          )
        )
      )
    }
  }

  const useEffect = window.React.useEffect;

  function SetupTask(props) {

    useEffect(()=>{ window.location.search = '?page=wc-admin&path=%2Fdepay%2Fsettings'; }, []);

    return(null)
  }

  const _jsxFileName = "/Users/sebastian/Work/DePay/web3-woocommerce-depay-payments/src/admin.js";
  (function ( React, hooks ) {

    wp.api.loadPromise.then(() => {
      const settings = new wp.api.models.Settings();
      settings.fetch().then((response)=> {
        let completed = !!(
          response.depay_wc_receiving_wallet_address &&
          response.depay_wc_accepted_payments &&
          response.depay_wc_tokens
        );

        hooks.addFilter( 'woocommerce_admin_onboarding_task_list', 'depay-woocommerce-payments', ( tasks ) => {
          const task = {
            key: 'setup_depay_wc_payments',
            title: 'Set up DePay',
            content: 'Simply connect your wallet and select the tokens you want to receive as payments.',
            container: React.createElement(SetupTask, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}),
            completed,
            visible: !completed,
            additionalInfo: 'Simply connect your wallet and select the tokens you want to receive as payments.',
            time: '1 minute',
            isDismissable: false,
            type: 'extension'
          };
          return [
            ...tasks,
            task,
            {...task,
              key: 'payments',
              visible: false
            }
          ]
        });
      });
    });

    hooks.addFilter( 'woocommerce_admin_pages_list', 'depay-woocommerce-payments', ( pages ) => {
      pages.push( {
          container: AdminSettingsPage,
          path: '/depay/settings',
          breadcrumbs: [ 'DePay', 'Settings' ],
          capability: "manage_woocommerce",
          wpOpenMenu: 'toplevel_page_wc-admin-path--depay-settings',
          navArgs: {
            id: 'depay-woocommerce-payments-settings'
          },
      });
      pages.push( {
          container: AdminTransactionsPage,
          path: '/depay/transactions',
          breadcrumbs: [ 'DePay', 'Transactions' ],
          capability: "manage_woocommerce",
          wpOpenMenu: 'toplevel_page_wc-admin-path--depay-settings',
          navArgs: {
            id: 'depay-woocommerce-payments-transactions'
          },
      });
      return pages
    });

  })(
    window.React,
    window.wp.hooks
  );

}));
