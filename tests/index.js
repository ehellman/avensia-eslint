/* eslint-env mocha */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const plugin = require('..');

const ruleFiles = fs.readdirSync(path.resolve(__dirname, '../lib/rules/')).map((f) => path.basename(f, '.js'));
const ruleTestFiles = fs.readdirSync(path.resolve(__dirname, './lib/rules/')).map((f) => path.basename(f, '.js'));

describe('all rule files should be exported by the plugin', () => {
  ruleFiles.forEach((ruleName) => {
    it(`should export ${ruleName}`, () => {
      assert.equal(plugin.rules[ruleName], require(path.join('../lib/rules', ruleName))); // eslint-disable-line global-require, import/no-dynamic-require
    });
  });
});

describe('all rule files should have a corresponding test', () => {
  const rules = [];
  const rulesWithoutTests = [];

  ruleFiles.forEach((ruleName) => {
    rules.push(ruleName);
  });

  ruleTestFiles.forEach((ruleName) => {
    if (rules.includes(ruleName)) return;
    rulesWithoutTests.push(ruleName);
  });

  assert.deepEqual(rulesWithoutTests, []);
});

describe('deprecated rules', () => {
  it('marks all deprecated rules as deprecated', () => {
    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const isDeprecated = plugin.rules[ruleName].meta.deprecated;
      if (inDeprecatedRules) {
        assert(isDeprecated, `${ruleName} metadata should mark it as deprecated`);
      } else {
        assert(!isDeprecated, `${ruleName} metadata should not mark it as deprecated`);
      }
    });
  });
});

describe('configurations', () => {
  it('should export a ‘recommended’ configuration', () => {
    const configName = 'recommended';
    assert(plugin.configs[configName]);
  });
  it('should export a ‘recommended’ configuration with the correct rules', () => {
    const configName = 'recommended';
    ruleFiles.forEach((ruleName) => {
      const inRecommendedConfig = !!plugin.configs[configName].rules[`avensia/${ruleName}`];
      const isRecommended = plugin.rules[ruleName].meta.docs[configName];
      if (inRecommendedConfig) {
        assert(isRecommended, `${ruleName} metadata should mark it as recommended`);
      } else {
        assert(!isRecommended, `${ruleName} metadata should not mark it as recommended`);
      }
    });
  });
});
