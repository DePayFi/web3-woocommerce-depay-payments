import AdminSettingsPage from './admin/AdminSettingsPage'
import AdminTransactionsPage from './admin/AdminTransactionsPage'
import SetupTask from './admin/SetupTask'

(function ( React, hooks ) {

  hooks.addFilter( 'woocommerce_admin_onboarding_task_list', 'depay-woocommerce-payments', (tasks) => {
    let completed = window.DEPAY_WC_SETUP.done == '1'
    const task = {
      key: 'setup_depay_wc_payments',
      title: 'Set up DePay',
      content: 'Simply connect your wallet and select the tokens you want to receive as payments.',
      container: <SetupTask/>,
      completed,
      visible: !completed,
      additionalInfo: 'Simply connect your wallet and select the tokens you want to receive as payments.',
      time: '1 minute',
      isDismissable: false,
      type: 'extension'
    }
    return [
      ...tasks,
      task,
      {...task,
        key: 'payments',
        visible: false
      }
    ]
  })

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

