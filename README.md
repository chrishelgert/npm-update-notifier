# npm-update-notifier

[![npm version](https://badge.fury.io/js/npm-update-notifier.svg)](https://badge.fury.io/js/npm-update-notifier)

Show all outdated dependencies for your package.json.

## Install

```bash
  npm i -g npm-update-notifier
```

## Usage

```bash
  nun --help

  Notifies when a new version from a npm-dependency is published

  Usage
    $ nun <package-file>
  Options
    --interval, interval for checking updates
    --console, output only in console
  Example
    nun ./package.json
```

## Todo

* Tests with ava

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new [Pull Request](../../pull/new/master)

## License

Copyright (c) 2016 Chris Helgert. See [LICENSE](./LICENSE.md) for details.
