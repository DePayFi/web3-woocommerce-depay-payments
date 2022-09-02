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

In order to release this plugin simply push a git tag:

```
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | sed 's/^ *//g')
echo v$PACKAGE_VERSION
git tag v$PACKAGE_VERSION
git push origin v$PACKAGE_VERSION
```
