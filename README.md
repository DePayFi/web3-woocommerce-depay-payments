## DePay for WooCommerce

![Web3 Payments for WooCommerce](/.wordpress-org/screenshot-2.gif)

Accept Web3 payments, supporting various cryptocurrency tokens, blockchains and wallets, with the DePay Payments extension for WooCommerce. MetaMask, Phantom, USDC, USDT, ETH, SOL, BSC, POL, xDAI…

### Demo

### Installation

## Development

### Update Version

```
yarn update:version
```

### Release

```
yarn release
```

### Lint

Install linter if you have not yet:

```
cd lint && composer install && cd ..
```

Then run:

```
php ./lint/vendor/bin/phpcs --standard=./lint/pbs-rules-set.xml --warning-severity=0 --report-source --report-full=phpcs-report.txt --ignore-annotations --extensions=php,html depay-woocommerce-payments.php includes
```
