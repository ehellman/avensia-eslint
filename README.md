# `avensia-eslint`

Work in progress...

# List of supported rules

✔: Enabled in the [`recommended`](#recommended) configuration.\
🔧: Fixable with [`eslint --fix`](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems).

<!-- AUTO-GENERATED-CONTENT:START (BASIC_RULES) -->
| ✔ | 🔧 | Rule | Description |
| :---: | :---: | :--- | :--- |
| ✔ | 🔧 | [avensia/require-comment-for-hook-ignore](docs/rules/require-comment-for-hook-ignore.md) | Prevent ignoring exhaustive-deps or rules-of-hooks without describing why |
<!-- AUTO-GENERATED-CONTENT:END -->

## Rules documentation

See [`eslint` documentation](https://eslint.org/docs/developer-guide/working-with-rules) for more information about working with ESLint rules.

## CONTRIBUTING

An important note about contributing right now is that there is a problem in the `markdown-magic` package which is currently at `2.6.0`. It has a dependency called `@technote-space/doctoc` that completely removed the possiblity to use `require()` and instead wants `import()`. The package has not been properly updated yet, so if you want to run the `npm run generate-list-of-rules` command, you have to open `node_modules\markdown-magic\lib\transforms\toc.js` and change: https://github.com/DavidWells/markdown-magic/issues/62 and https://github.com/DavidWells/markdown-magic/pull/64 and perhaps https://github.com/DavidWells/markdown-magic/pull/63

```js
// this
const { transform } = require('@technote-space/doctoc')
// to this
const { transform } = import('@technote-space/doctoc')
```

And you should now be able to properly update README.md with your new rules. Follow these topics for updates on the topic: https://github.com/DavidWells/markdown-magic/issues/62

# License

`avensia-eslint` is licensed under the [MIT License](https://opensource.org/licenses/mit-license.php).

[npm-url]: https://npmjs.org/package/eslint-plugin-react
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-react.svg
[deps-url]: https://david-dm.org/jsx-eslint/eslint-plugin-react
[deps-image]: https://img.shields.io/david/dev/jsx-eslint/eslint-plugin-react.svg
[climate-url]: https://codeclimate.com/github/jsx-eslint/eslint-plugin-react
[climate-image]: https://img.shields.io/codeclimate/maintainability/jsx-eslint/eslint-plugin-react.svg
[status-url]: https://github.com/jsx-eslint/eslint-plugin-react/pulse
[status-image]: https://img.shields.io/github/last-commit/jsx-eslint/eslint-plugin-react.svg
[tidelift-url]: https://tidelift.com/subscription/pkg/npm-eslint-plugin-react?utm_source=npm-eslint-plugin-react&utm_medium=referral&utm_campaign=readme
[tidelift-image]: https://tidelift.com/badges/github/jsx-eslint/eslint-plugin-react?style=flat
