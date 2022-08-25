
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  const _jsxFileName$1 = "/Users/sebastian/Work/DePay/web3-woocommerce-depay-payments/src/admin/AdminSettingsPage.js";function AdminSettingsPage(props) {
    return(
      React.createElement('div', {__self: this, __source: {fileName: _jsxFileName$1, lineNumber: 3}}
        , React.createElement('div', { className: "woocommerce-section-header", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 4}}
          , React.createElement('h2', { className: "woocommerce-section-header__title woocommerce-section-header__header-item" , __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 5}}, "Settings"

          )
          , React.createElement('hr', { role: "presentation", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 8}})
        )
        , React.createElement('div', { className: "woocommerce-settings__wrapper", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 10}}
          , React.createElement('div', { className: "woocommerce-setting", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 11}}
            , React.createElement('div', { className: "woocommerce-setting__label", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 12}}
              , React.createElement('label', { for: "depay-woocommerce-payment-receiver-address", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 13}}, "Receiving Wallet Address"

              )
            )
            , React.createElement('div', { className: "woocommerce-setting__input", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 17}}
              , React.createElement('div', { className: "woocommerce-setting__options-group", 'aria-labelledby': "woocommerce_excluded_report_order_statuses-label", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 18}}
                , React.createElement('div', { className: "components-base-control components-checkbox-control css-1wzzj1a ej5x27r4"   , __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 19}}
                  , React.createElement('div', { className: "components-base-control__field css-1t5ousf ej5x27r3"  , __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 20}}
                    , React.createElement('span', { className: "components-checkbox-control__input-container", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 21}}
                      , React.createElement('input', { id: "depay-woocommerce-payment-receiver-address", type: "text", name: "woocommerce_excluded_report_order_statuses", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 22}})
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  }

  const _jsxFileName = "/Users/sebastian/Work/DePay/web3-woocommerce-depay-payments/src/admin/AdminTransactionsPage.js";function AdminTransactionsPage(props) {
    return(
      React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3}}
        , React.createElement('div', { className: "woocommerce-section-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4}}
          , React.createElement('h2', { className: "woocommerce-section-header__title woocommerce-section-header__header-item" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5}}, "Transactions"

          )
          , React.createElement('hr', { role: "presentation", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}})
        )
      )
    )
  }

  (function ( React, hooks ) {
    
    hooks.addFilter( 'woocommerce_admin_pages_list', 'depay-woocommerce-payments', ( pages ) => {
      console.log(pages);
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
