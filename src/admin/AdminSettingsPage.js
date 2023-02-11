const useRef = window.React.useRef
const useState = window.React.useState
const useEffect = window.React.useEffect

export default function(props) {

  const { Button } = window.wp.components
  const [ settingsAreLoaded, setSettingsAreLoaded ] = useState(false)
  const [ isSaving, setIsSaving ] = useState()
  const [ isDisabled, setIsDisabled ] = useState()
  const [ receivingWalletAddress, setReceivingWalletAddress ] = useState()
  const [ checkoutTitle, setCheckoutTitle ] = useState('DePay')
  const [ checkoutDescription, setCheckoutDescription ] = useState('')
  const [ displayedCurrency, setDisplayedCurrency ] = useState('')
  const [ tokens, setTokens ] = useState()
  const [ tooManyTokensPerChain, setTooManyTokensPerChain ] = useState(false)
  const [ denomination, setDenomination ] = useState()
  const [ tokenForDenomination, setTokenForDenomination ] = useState()

  const connectWallet = async()=> {
    let { account, accounts, wallet }  = await window.DePayWidgets.Connect()
    setReceivingWalletAddress(account)
  }

  const addToken = async ()=>{
    let token = await DePayWidgets.Select({ what: 'token' })
    if((tokens instanceof Array) && tokens.find((selectedToken)=>(selectedToken.blockchain == token.blockchain && selectedToken.address == token.address))) { return }
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
      depay_wc_receiving_wallet_address: receivingWalletAddress,
      depay_wc_tokens: JSON.stringify(tokens),
      depay_wc_token_for_denomination: tokenForDenomination ? JSON.stringify(tokenForDenomination) : '',
      depay_wc_blockchains: JSON.stringify([...new Set(tokens.map((token)=>token.blockchain))]),
      depay_wc_accepted_payments: JSON.stringify(tokens.map((token)=>{
        return({
          blockchain: token.blockchain,
          token: token.address,
          receiver: receivingWalletAddress
        })
      })),
      depay_wc_checkout_title: checkoutTitle,
      depay_wc_checkout_description: checkoutDescription,
      depay_wc_displayed_currency: displayedCurrency,
    })

    settings.save().then((response) => {
      setIsSaving(false)
      window.location.search = '?page=wc-admin&path=%2Fdepay%2Ftransactions'
    })
  }

  useEffect(()=>{
    wp.api.loadPromise.then(() => {
      const settings = new wp.api.models.Settings()
      settings.fetch().then((response)=> {
        setReceivingWalletAddress(response.depay_wc_receiving_wallet_address)
        if(response.depay_wc_tokens) {
          setTokens(JSON.parse(response.depay_wc_tokens))
        } else {
          setTokens([])
        }
        setTokenForDenomination(response.depay_wc_token_for_denomination?.length ? JSON.parse(response.depay_wc_token_for_denomination) : null)
        setSettingsAreLoaded(true)
        setCheckoutTitle(response.depay_wc_checkout_title || 'DePay')
        setCheckoutDescription(response.depay_wc_checkout_description || '')
        setDisplayedCurrency(response.depay_wc_displayed_currency || '')
      })
    }).catch(()=>{ setIsLoading(false) })
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
    setIsDisabled( ! (receivingWalletAddress && receivingWalletAddress.length && tokens && tokens.length) )
  }, [ receivingWalletAddress, tokens ])

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
              <div class="notice inline notice-warning notice-alt">
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

      <div className="woocommerce-settings__wrapper">
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label">
            <label for="depay-woocommerce-payment-receiver-address">
              Wallet Address
            </label>
          </div>
          <div className="woocommerce-setting__input">
            <div className="woocommerce-setting__options-group">
              <div className="components-base-control">
                <input 
                  id="depay-woocommerce-payment-receiver-address" 
                  type="text" 
                  value={ receivingWalletAddress }
                  onChange={ (event)=>setReceivingWalletAddress(event.target.value) }
                />
              </div>
            </div>
            <div className="woocommerce-setting__input__addition">
              <button type="button" className="components-button is-secondary" onClick={ connectWallet }>Connect Wallet</button>
            </div>
            <div>
              <p class="description">
                This address is used to receive payments.
                <br/>
                <strong>Please double check that it is set to your wallet address.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="woocommerce-settings__wrapper">
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label">
            <label>
              Accepted Payments
            </label>
          </div>
          <div className="woocommerce-setting__input">
            { tooManyTokensPerChain &&
              <div class="notice inline notice-warning notice-alt">
                <p>
                  Select as few tokens per blockchain as possible!&nbsp;
                  <a href="https://depay.com/docs/payments/plugins/woocommerce#why-should-i-select-as-few-tokens-per-chain-as-possible" target="_blank">
                    Learn More
                  </a>
                </p>
              </div>
            }
            <p class="description">
              Select the tokens that you want to receive as payment:
            </p>
            <div className="woocommerce-setting__options-group">
              {
                tokens && tokens.map((token, index)=>{
                  return(
                    <table key={ index } class="wp-list-table widefat fixed striped table-view-list page" style={{ marginBottom: "0.4rem"}}>
                      <tr>
                        <td style={{ padding: "1rem 1rem 0.4rem 1rem", display: "flex" }}>
                          <img src={ token.logo } style={{ width: "3rem", height: "3rem" }}/>
                          <div style={{ paddingLeft: "1rem", paddingBottom: "0.3rem" }}>
                            <div><strong>{ token.symbol }</strong> ({ token.name })</div>
                            <div>on { token.blockchain.toUpperCase() }</div>
                            <div class="row-actions visible">
                              <span class="delete">
                                <a href="#" onClick={ ()=>removeToken(index) }>Remove</a>
                              </span>
                            </div>
                            { !token.routable &&
                              <div class="notice inline notice-warning notice-alt">
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
              <p class="description">
                Each incoming payment will be converted on-the-fly into your selected tokens on the selected blockchain.
                Payment senders will be able to use any routable token as means of payment.
                Tokens will be converted on-the-fly using decentralized finance to ensure you will always get the tokens you've configured.
              </p>
              <p class="description">
                <strong>Payments are peer-to-peer and will always be sent directly to your wallet.</strong>
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
              <p class="description">
                Configure how the payment method should be displayed during checkout:
              </p>
              <div>
                <label>
                  <span class="woocommerce-settings-historical-data__progress-label">Payment Method Name</span>
                  <div>
                    <select class="components-select-control__input" value={ checkoutTitle } onChange={ (e)=> setCheckoutTitle(e.target.value) }>
                      <option value="DePay">DePay</option>
                      <option value="Crypto">Crypto</option>
                      <option value="Web3">Web3</option>
                    </select>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <div>
                <label>
                  <span class="woocommerce-settings-historical-data__progress-label">Additional Description</span>
                  <textarea value={ checkoutDescription } onChange={(e)=>setCheckoutDescription(e.target.value)} style={{ width: '100%' }}>
                  </textarea>
                </label>
              </div>
            </div>
            <div>
              <div>
                <label>
                  <span class="woocommerce-settings-historical-data__progress-label">Displayed currency (within payment widget)</span>
                  <div>
                    <select class="components-select-control__input" value={ displayedCurrency } onChange={ (e)=> setDisplayedCurrency(e.target.value) }>
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
              <p class="description">
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
                    <table class="wp-list-table widefat fixed striped table-view-list page" style={{ marginBottom: "0.4rem"}}>
                      <tr>
                        <td style={{ padding: "1rem 1rem 0.4rem 1rem", display: "flex" }}>
                          <img src={ tokenForDenomination.logo } style={{ width: "3rem", height: "3rem" }}/>
                          <div style={{ paddingLeft: "1rem", paddingBottom: "0.3rem" }}>
                            <div><strong>{ tokenForDenomination.symbol }</strong> ({ tokenForDenomination.name })</div>
                            <div>on { tokenForDenomination.blockchain.toUpperCase() }</div>
                            <div class="row-actions visible">
                              <span class="delete">
                                <a href="#" onClick={ ()=>unsetTokenForDenomination() }>Remove</a>
                              </span>
                            </div>
                            { !tokenForDenomination.routable &&
                              <div class="notice inline notice-warning notice-alt">
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
                    <div class="notice inline notice-warning notice-alt">
                      <p>
                        Please make sure to also set your shop currency after saving this:&nbsp;
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
      
      <div className="woocommerce-settings__wrapper" style={{ paddingTop: '20px' }}>
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label"></div>
          <div className="woocommerce-setting__input">
            <Button
              isPrimary
              isLarge
              onClick={ () => saveSettings('') }
              disabled={ isSaving || isDisabled }
            >Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
