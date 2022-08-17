'use strict';

/* eslint-disable global-require */
const allRules = {
  'require-comment-for-hook-ignore': require('./lib/rules/require-comment-for-hook-ignore'),
};
/* eslint-enable */

function filterRules(rules, predicate) {
  return Object.fromEntries(Object.entries(rules).filter((entry) => predicate(entry[1])));
}

const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

module.exports = {
  deprecatedRules,
  rules: allRules,
  configs: {
    recommended: {
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        // turn off the need to prefix interface names with an I, i.e. IMyInterface
        // https://github.com/bradzacher/eslint-plugin-typescript/blob/master/docs/rules/interface-name-prefix.md
        '@typescript-eslint/naming-convention': [
          'error',
          {
            // forbid the use of I prefix for interfaces because it goes against best practices of TypeScript
            selector: 'interface',
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Z]',
              match: false,
            },
          },
          {
            // enforce Pascal Casing for types
            selector: ['enum', 'enumMember', 'interface', 'typeAlias', 'typeParameter'],
            format: ['PascalCase'],
          },
        ],
        'avensia/require-comment-for-hook-ignore': 'error',
      },
    },
  },
};
