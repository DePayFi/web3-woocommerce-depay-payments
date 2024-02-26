const useRef = window.React.useRef
const useState = window.React.useState
const useEffect = window.React.useEffect

export default function(props) {

  const { Button } = window.wp.components
  const [ settingsAreLoaded, setSettingsAreLoaded ] = useState(false)
  const [ isSaving, setIsSaving ] = useState()
  const [ isDisabled, setIsDisabled ] = useState()
  const [ checkoutTitle, setCheckoutTitle ] = useState('DePay')
  const [ gatewayType, setGatewayType ] = useState('multichain')
  const [ checkoutDescription, setCheckoutDescription ] = useState('')
  const [ displayedCurrency, setDisplayedCurrency ] = useState('')
  const [ apiKey, setApiKey ] = useState()
  const [ tokens, setTokens ] = useState()
  const [ tooManyTokensPerChain, setTooManyTokensPerChain ] = useState(false)
  const [ denomination, setDenomination ] = useState()
  const [ tokenForDenomination, setTokenForDenomination ] = useState()

  const setReceivingWalletAddress = (receiver, index, blockchain)=>{
    
    let newTokens = [...tokens]
    if(!receiver || receiver.length === 0) {
      newTokens[index].error = 'Please enter a receiver address!'
    } else {
      try {
        if(blockchain === 'solana') {
          receiver = new SolanaWeb3js.PublicKey(receiver).toString()
        } else {
          receiver = ethers.ethers.utils.getAddress(receiver)
        }
        newTokens[index].error = undefined
      } catch {
        newTokens[index].error = 'This address is invalid!'
      }
    }

    newTokens[index].receiver = receiver
    setTokens(newTokens)
  }

  const connectWallet = async(index, blockchain)=> {
    let { account, accounts, wallet }  = await window.DePayWidgets.Connect()
    setReceivingWalletAddress(account, index, blockchain)
  }

  const addToken = async ()=>{
    let token = await DePayWidgets.Select({ what: 'token' })
    if((tokens instanceof Array) && tokens.find((selectedToken)=>(selectedToken.blockchain == token.blockchain && selectedToken.address == token.address))) { return }
    token.error = 'Please enter a receiver address!'
    if(tokens instanceof Array) {
      setTokens(tokens.concat([token]))
    } else {
      setTokens([token])
    }
  }

  const removeToken = (index)=> {
    let newTokens = tokens.slice()
    newTokens.splice(index, 1)
    setTokens(newTokens)
  }

  const selectTokenForDenomination = async ()=>{
    let token = await DePayWidgets.Select({ what: 'token' })
    setTokenForDenomination(token)
  }

  const unsetTokenForDenomination = ()=> {
    setTokenForDenomination(undefined)
  }

  const saveSettings = ()=>{
    setIsSaving(true)
    const settings = new window.wp.api.models.Settings({
      depay_wc_tokens: JSON.stringify(tokens),
      depay_wc_token_for_denomination: tokenForDenomination ? JSON.stringify(tokenForDenomination) : '',
      depay_wc_blockchains: JSON.stringify([...new Set(tokens.map((token)=>token.blockchain))]),
      depay_wc_accepted_payments: JSON.stringify(tokens.map((token)=>{
        return({
          blockchain: token.blockchain,
          token: token.address,
          receiver: token.receiver
        })
      })),
      depay_wc_checkout_title: checkoutTitle,
      depay_wc_gateway_type: gatewayType,
      depay_wc_checkout_description: checkoutDescription,
      depay_wc_displayed_currency: displayedCurrency,
      depay_wc_api_key: apiKey,
    })

    settings.save().then((response) => {
      window.location.hash = 'depay-settings-saved'
      window.location.reload(true)
    })
  }

  useEffect(()=>{
    wp.api.loadPromise.then(() => {
      const settings = new wp.api.models.Settings()
      settings.fetch().then((response)=> {
        if(response.depay_wc_tokens) {
          let parsedTokens = JSON.parse(response.depay_wc_tokens)
          parsedTokens.forEach((parsedToken)=>{
            if(parsedToken.receiver === undefined && response.depay_wc_receiving_wallet_address) {
              parsedToken.receiver = response.depay_wc_receiving_wallet_address
            }
          })
          setTokens(parsedTokens)
        } else {
          setTokens([])
        }
        setTokenForDenomination(response.depay_wc_token_for_denomination?.length ? JSON.parse(response.depay_wc_token_for_denomination) : null)
        setSettingsAreLoaded(true)
        setCheckoutTitle(response.depay_wc_checkout_title || 'DePay')
        setGatewayType(response.depay_wc_gateway_type || 'multichain')
        setCheckoutDescription(response.depay_wc_checkout_description || '')
        setDisplayedCurrency(response.depay_wc_displayed_currency || '')
        setApiKey(response.depay_wc_api_key || '')
      })
    }).catch(()=>{})
  }, [])

  useEffect(()=>{
    if(tokens) {
      let count = {}
      tokens.forEach((token)=>{
        if(count[token.blockchain] == undefined) {
          count[token.blockchain] = 1
        } else {
          count[token.blockchain] += 1
        }
      })
      setTooManyTokensPerChain(
        !!Object.values(count).find((value)=>value > 2)
      )
    }
  }, [tokens])

  useEffect(()=>{
    setIsDisabled( ! (tokens && tokens.length && tokens.every((token)=>token.receiver && token.receiver.length > 0 && token.error === undefined) ) )
  }, [ tokens ])

  if(!settingsAreLoaded) { return null }

  return(
    <div>

      <div className="woocommerce-section-header">
        <h2 className="woocommerce-section-header__title woocommerce-section-header__header-item">
          Settings
        </h2>
        <hr role="presentation"/>
      </div>

      { window.DEPAY_WC_SETUP.bcmath !== '1' &&
        <div className="woocommerce-settings__wrapper">
          <div className="woocommerce-setting">
            <div className="woocommerce-setting__label">
              <label for="depay-woocommerce-payment-receiver-address">
                Missing Requirements
              </label>
            </div>
            <div className="woocommerce-setting__input">
              <div className="notice inline notice-warning notice-alt">
                <p>
                  You need to install the "bcmath" php package!&nbsp;
                  <a href="https://www.google.com/search?q=how+to+install+bcmath+php+wordpress" target="_blank">
                    Learn How
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      { window.location.hash.match('depay-settings-saved') &&
        <div className="woocommerce-settings__wrapper">
          <div className="woocommerce-setting">
            <div className="woocommerce-setting__label">
              <label for="depay-woocommerce-payment-receiver-address">
              </label>
            </div>
            <div className="woocommerce-setting__input">
              <div className="notice inline notice-success notice-alt">
                <p>
                  Settings have been saved successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      <div className="woocommerce-settings__wrapper">
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label">
            <label>
              Accepted Payments
            </label>
          </div>
          <div className="woocommerce-setting__input">
            { tooManyTokensPerChain &&
              <div className="notice inline notice-warning notice-alt">
                <p>
                  Select as few tokens per blockchain as possible!&nbsp;
                  <a href="https://depay.com/docs/payments/plugins/woocommerce#why-should-i-select-as-few-tokens-per-chain-as-possible" target="_blank">
                    Learn More
                  </a>
                </p>
              </div>
            }
            <p className="description">
              Select the tokens that you want to receive as payment:
            </p>
            <div className="woocommerce-setting__options-group">
              {
                tokens && tokens.map((token, index)=>{
                  return(
                    <table key={ `${index}-${token.blockchain}-${token.symbol}` } className="wp-list-table widefat fixed striped table-view-list page" style={{ marginBottom: "0.4rem"}}>
                      <tr>
                        <td style={{ padding: "1rem 1rem 0.4rem 1rem", display: "flex" }}>
                          <div>
                            <div style={{ position: 'relative', display: 'block' }}>
                              <ReactTokenImage.TokenImage blockchain={ token.blockchain } address={ token.address } className="DePay_woocommerce_token_image"/>
                              <img src={ Web3Blockchains[token.blockchain].logo } style={{ position: 'absolute', bottom: '5px', right: '0px', width: "20px", height: "20px", border: "1px solid white", borderRadius: "4px", backgroundColor: Web3Blockchains[token.blockchain].logoBackgroundColor }}/>
                            </div>
                          </div>
                          <div style={{ paddingLeft: "1rem", paddingBottom: "0.3rem", flex: 1 }}>
                            <div style={{ display: 'flex', justifyontent: 'space-between', fontSize: '1rem' }}>
                              <div>
                                <strong>{ token.symbol }</strong> ({ token.name }) on { Web3Blockchains[token.blockchain].label }
                              </div>
                              <div class="row-actions visible" style={{ marginLeft: "auto" }}>
                                <span className="delete">
                                  <a href="#" onClick={ ()=>removeToken(index) }>Remove</a>
                                </span>
                              </div>
                            </div>
                            <div className="woocommerce-setting__input__addition">
                              <label style={{ marginBottom: 0 }}>
                                <span className="">Receiver</span>
                                <div className="components-base-control">
                                  <input
                                    required="required"
                                    style={{ width: "100%" }}
                                    id="depay-woocommerce-payment-receiver-address" 
                                    type="text" 
                                    value={ token.receiver }
                                    onChange={ (event)=> setReceivingWalletAddress(event.target.value, index, token.blockchain) }
                                  />
                                </div>
                                { token.error &&
                                  <div className="notice inline notice-warning notice-alt" style={{ marginBottom: 0 }}>
                                    {token.error}
                                  </div>
                                }
                              </label>
                            </div>
                            <div className="row-actions visible">
                              <div className="woocommerce-setting__input__addition">
                                <button type="button" className="components-button is-secondary" onClick={ ()=>connectWallet(index, token.blockchain) }>Connect Wallet</button>
                              </div>
                            </div>
                            { !token.routable &&
                              <div className="notice inline notice-warning notice-alt">
                                <span>
                                  This token is not supported for conversion!&nbsp;
                                </span>
                                <a href="https://depay.com/docs/payments/plugins/woocommerce#why-are-some-tokens-not-supported-for-conversion" target="_blank">
                                  Learn More
                                </a>
                              </div>
                            }
                          </div>
                        </td>
                      </tr>
                    </table>
                  )
                })
              }
            </div>
            <div className="woocommerce-setting__input__addition">
              <button onClick={ addToken } type="button" className="components-button is-secondary">Add Token</button>
            </div>
            <div>
              <p className="description">&nbsp;</p>
            </div>
            <div>
              <p className="description">
                Each incoming payment will be converted on-the-fly into your selected tokens on the selected blockchains.
                Customers will be able to use any convertible token as means of payment.
              </p>
              <p className="description">
                <strong>Payments are sent directly into your wallet.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="woocommerce-settings__wrapper">
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label">
            <label>
              Checkout
            </label>
          </div>
          <div className="woocommerce-setting__input">
            <div className="woocommerce-setting__options-group">
              <p className="description">
                Configure how the payment method should be displayed during checkout:
              </p>
              <div>
                <label>
                  <span className="woocommerce-settings-historical-data__progress-label">Checkout option (Gateway)</span>
                  <div>
                    <select className="components-select-control__input" value={ gatewayType } onChange={ (e)=> { setGatewayType(e.target.value) } }>
                      <option value="multichain">Single checkout / multiple blockchains (recommended)</option>
                      <option value="multigateway">Multiple checkouts / 1 per blockchain</option>
                    </select>
                  </div>
                </label>
              </div>
              {
                gatewayType === 'multichain' &&
                <div>
                  <label>
                    <span className="woocommerce-settings-historical-data__progress-label">Payment method name</span>
                    <div>
                      <select className="components-select-control__input" value={ checkoutTitle } onChange={ (e)=> { setCheckoutTitle(e.target.value) } }>
                        <option value="DePay">DePay</option>
                        <option value="Crypto">Crypto</option>
                        <option value="Web3">Web3</option>
                      </select>
                    </div>
                  </label>
                </div>
              }
            </div>
            { gatewayType === 'multichain' &&
              <div>
                <div>
                  <label>
                    <span className="woocommerce-settings-historical-data__progress-label">Additional description</span>
                    <textarea value={ checkoutDescription } onChange={(e)=>{ setCheckoutDescription(e.target.value) } } style={{ width: '100%' }}>
                    </textarea>
                  </label>
                </div>
              </div>
            }
            <div>
              <div>
                <label>
                  <span className="woocommerce-settings-historical-data__progress-label">Displayed currency (within payment widget)</span>
                  <div>
                    <select className="components-select-control__input" value={ displayedCurrency } onChange={ (e)=> { setDisplayedCurrency(e.target.value) } }>
                      <option value="">Customer's local currency</option>
                      <option value="store">Store's default currency</option>
                    </select>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="woocommerce-settings__wrapper">
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label">
            <label>
              Denomination
            </label>
          </div>
          <div className="woocommerce-setting__input">
            <div className="woocommerce-setting__options-group">
              <p className="description">
                Denominate your store items in crypto currency tokens:
              </p>

              { !tokenForDenomination &&
                <div className="woocommerce-setting__input__addition">
                  <button onClick={ selectTokenForDenomination } type="button" className="components-button is-secondary">Select Token</button>
                </div>
              }

              {
                tokenForDenomination &&
                  <div>
                    <table className="wp-list-table widefat fixed striped table-view-list page" style={{ marginBottom: "0.4rem"}}>
                      <tr>
                        <td style={{ padding: "1rem 1rem 0.4rem 1rem", display: "flex" }}>
                          <ReactTokenImage.TokenImage blockchain={ tokenForDenomination.blockchain } address={ tokenForDenomination.address } className="DePay_woocommerce_token_image"/>
                          <div style={{ paddingLeft: "1rem", paddingBottom: "0.3rem" }}>
                            <div><strong>{ tokenForDenomination.symbol }</strong> ({ tokenForDenomination.name })</div>
                            <div>on { tokenForDenomination.blockchain.toUpperCase() }</div>
                            <div className="row-actions visible">
                              <span className="delete">
                                <a href="#" onClick={ ()=>unsetTokenForDenomination() }>Remove</a>
                              </span>
                            </div>
                            { !tokenForDenomination.routable &&
                              <div className="notice inline notice-warning notice-alt">
                                <span>
                                  This token is not supported for auto-conversion!&nbsp;
                                </span>
                                <a href="https://depay.com/docs/payments/plugins/woocommerce#why-are-some-tokens-not-supported-for-auto-conversion" target="_blank">
                                  Learn More
                                </a>
                              </div>
                            }
                          </div>
                        </td>
                      </tr>
                    </table>
                    <div className="notice inline notice-warning notice-alt">
                      <p>
                        After saving this, please make sure to also change your default shop currency:
                        <br/>
                        <a href="/wp-admin/admin.php?page=wc-settings" target="_blank">
                          WooCommerce -> Settings -> Currency options -> Currency
                        </a>
                      </p>
                    </div>
                  </div>
              }

            </div>
          </div>
        </div>
      </div>

      <div className="woocommerce-settings__wrapper">
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label">
            <label>
              API Key
            </label>
          </div>
          <div className="woocommerce-setting__input">
            <div className="woocommerce-setting__options-group">
              <p className="description">
                To increase your request limit towards DePay APIs, please enter your API key here:
              </p>
              <div>
                <label>
                  <span className="woocommerce-settings-historical-data__progress-label">API Key</span>
                  <input type="text" value={ apiKey || '' } onChange={(e)=>{ setApiKey(e.target.value) } } style={{ width: '100%' }}/>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="woocommerce-settings__wrapper">
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label">
            <label>
              Save
            </label>
          </div>
          <div className="woocommerce-setting__input">
            <div className="woocommerce-setting__options-group">
              <p className="description">
                Make sure to save your settings:
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="woocommerce-settings__wrapper">
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label"></div>
          <div className="woocommerce-setting__input">
            <Button
              isPrimary
              isLarge
              onClick={ () => saveSettings() }
            >Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
