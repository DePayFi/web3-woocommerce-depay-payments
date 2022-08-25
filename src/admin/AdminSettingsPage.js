export default function(props) {
  return(
    <div>
      <div className="woocommerce-section-header">
        <h2 className="woocommerce-section-header__title woocommerce-section-header__header-item">
          Settings
        </h2>
        <hr role="presentation"/>
      </div>
      <div className="woocommerce-settings__wrapper">
        <div className="woocommerce-setting">
          <div className="woocommerce-setting__label">
            <label for="depay-woocommerce-payment-receiver-address">
              Receiving Wallet Address
            </label>
          </div>
          <div className="woocommerce-setting__input">
            <div className="woocommerce-setting__options-group" aria-labelledby="woocommerce_excluded_report_order_statuses-label">
              <div className="components-base-control components-checkbox-control css-1wzzj1a ej5x27r4">
                <div className="components-base-control__field css-1t5ousf ej5x27r3">
                  <span className="components-checkbox-control__input-container">
                    <input id="depay-woocommerce-payment-receiver-address" type="text" name="woocommerce_excluded_report_order_statuses"/>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
