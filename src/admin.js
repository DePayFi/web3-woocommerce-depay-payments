import AdminSettingsPage from './admin/AdminSettingsPage'
import AdminTransactionsPage from './admin/AdminTransactionsPage'

(function ( React, hooks ) {
  
  hooks.addFilter( 'woocommerce_admin_pages_list', 'depay-woocommerce-payments', ( pages ) => {
    console.log(pages)
    pages.push( {
        container: AdminSettingsPage,
        path: '/depay/settings',
        breadcrumbs: [ 'DePay', 'Settings' ],
        capability: "manage_woocommerce",
        wpOpenMenu: 'toplevel_page_wc-admin-path--depay-settings',
        navArgs: {
          id: 'depay-woocommerce-payments-settings'
        },
    })
    pages.push( {
        container: AdminTransactionsPage,
        path: '/depay/transactions',
        breadcrumbs: [ 'DePay', 'Transactions' ],
        capability: "manage_woocommerce",
        wpOpenMenu: 'toplevel_page_wc-admin-path--depay-settings',
        navArgs: {
          id: 'depay-woocommerce-payments-transactions'
        },
    })
    return pages
  })

})(
  window.React,
  window.wp.hooks
)

