'use strict';

/* eslint-disable global-require */
const allRules = {
  'require-comment-for-hook-ignore': require('./lib/rules/require-comment-for-hook-ignore'),
};
/* eslint-enable */

function filterRules(rules, predicate) {
  return Object.fromEntries(
    Object.entries(rules).filter((entry) => predicate(entry[1]))
  );
}

const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

module.exports = {
  deprecatedRules,
  rules: allRules,
};
