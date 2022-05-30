'use strict';

/* eslint-disable no-restricted-syntax */

const { rules } = require('./index');

const ruleTableRows = Object.keys(rules)
  .sort()
  .map((id) => {
    const { meta } = rules[id];
    const { fixable, docs } = meta;
    return [
      docs.recommended ? '✔' : '',
      fixable ? '🔧' : '',
      `[avensia/${id}](docs/rules/${id}.md)`,
      docs.description,
    ].join(' | ');
  });

const buildRulesTable = (rows) => {
  const header = '✔ | 🔧 | Rule | Description';
  const separator = ':---: | :---: | :--- | :---';

  return [header, separator, ...rows].map((row) => `| ${row} |`).join('\n');
};

const BASIC_RULES = () =>
  buildRulesTable(ruleTableRows.filter((rule) => !rule.includes('react/jsx-')));
// if you want to separate rules, create a new variable here to filter through the list
// and then add it to `transforms` under exports
// const GROUPED_RULES = () =>
//   buildRulesTable(
//     ruleTableRows.filter((rule) => rule.includes('avensia/some-pattern-'))
//   );

module.exports = {
  transforms: {
    BASIC_RULES,
    // GROUPED_RULES,
  },
  callback: () => {
    console.log('The auto-generating of rules finished!');
  },
};
