## DePay WooCommerce Payments

WooCommerce DePay plugin to accept Web3 payments directly into your wallet with on-the-fly conversion.

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
