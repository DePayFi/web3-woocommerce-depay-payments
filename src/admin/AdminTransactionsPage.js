const useEffect = window.React.useEffect

export default function(props) {

  useEffect(()=>{
    wp.api.loadPromise.then(() => {
      const settings = new wp.api.models.Settings()
      settings.fetch().then((response)=> {
        if(
          !response.depay_wc_receiving_wallet_address &&
          !response.depay_wc_accepted_payments &&
          !response.depay_wc_tokens
        ) {
          window.location.search = '?page=wc-admin&path=%2Fdepay%2Fsettings'
        }
      })
    })
  }, [])

  return(
    <div>
      <div className="woocommerce-section-header">
        <h2 className="woocommerce-section-header__title woocommerce-section-header__header-item">
          Transactions
        </h2>
        <hr role="presentation"/>
      </div>
    </div>
  )
}
