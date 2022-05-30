/**
 * @fileoverview Prevent ignoring exhaustive-deps or rules-of-hooks without describing why
 * @author Erik Hellman
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const {
  isComment,
  matchCommentTokenFormatting,
  isEslintRule,
} = require('../util');
const {
  EXHAUSTIVE_DEPS_ERROR_MESSAGE,
  RULES_OF_HOOKS_ERROR_MESSAGE,
} = require('../messages');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const RULES_OF_HOOKS_RULE_PATTERN =
  /(eslint).(?!.*enable).*(react-hooks\/rules-of-hooks)/u;
const EXHAUSTIVE_DEPS_RULE_PATTERN =
  /(eslint).(?!.*enable).*(react-hooks\/exhaustive-deps)/u;

//------------------------------------------------------------------------------
// Error Messages
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function isExhaustiveDepsRule(token) {
  return EXHAUSTIVE_DEPS_RULE_PATTERN.test(token.value);
}

function isRulesOfHooksRule(token) {
  return RULES_OF_HOOKS_RULE_PATTERN.test(token.value);
}
const messages = {
  exhaustiveDeps: EXHAUSTIVE_DEPS_ERROR_MESSAGE,
  rulesOfHooks: RULES_OF_HOOKS_ERROR_MESSAGE,
};

module.exports = {
  meta: {
    docs: {
      description:
        'Prevent ignoring exhaustive-deps or rules-of-hooks without describing why',
      recommended: true,
      url: docsUrl('require-comment-for-hook-ignore'),
    },
    fixable: 'code',
    hasSuggestions: true,

    messages,

    schema: [
      {
        type: 'object',
        properties: {
          noStrings: {
            type: 'boolean',
          },
          allowedStrings: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'string',
            },
          },
          ignoreProps: {
            type: 'boolean',
          },
          noAttributeStrings: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const comments = sourceCode.getAllComments();

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Program() {
        comments.forEach((token) => {
          const lineStart = token.range[0] - token.loc.start.column;
          const range = [lineStart, lineStart];
          const lineNumber = token.loc.start.line;
          const prevLineNumber = lineNumber - 1;

          if (prevLineNumber < 1) return;

          const prevToken = sourceCode.getTokenBefore(token, {
            includeComments: true,
          });

          // 1. Look for ESLint rule
          if (isEslintRule(token)) {
            // 2. Look for Exhaustive Deps rule
            if (isExhaustiveDepsRule(token)) {
              // 3. Check if the token before is a comment and not an ESLint comment
              if (isComment(prevToken) && !isEslintRule(prevToken)) {
                return;
              }
              // 4. Token before is not a comment, continue.
              // 5. Throw error, all exhaustive-deps ignores should have a descriptive comment before it.
              context.report({
                node: token,
                messageId: 'exhaustiveDeps',
                suggest: [
                  {
                    desc: 'Write a comment describing why you are ignoring react-hooks/exhaustive-deps',
                    fix(fixer) {
                      return fixer.insertTextBeforeRange(
                        range,
                        matchCommentTokenFormatting(
                          'Write a comment describing why you are ignoring react-hooks/exhaustive-deps here...',
                          token,
                          true
                        )
                      );
                    },
                  },
                  {
                    desc: 'Remove the ignore and let ESLint correctly populate the dependency array.',
                    fix(fixer) {
                      return fixer.removeRange([
                        prevToken.range[1],
                        token.range[1],
                      ]);
                    },
                  },
                ],
              });
            }
            // 2. Look for Rules of Hooks rule
            if (isRulesOfHooksRule(token)) {
              // 3. Check if the token before is a comment and not an ESLint comment
              if (isComment(prevToken) && !isEslintRule(prevToken)) {
                return;
              }
              // 4. Token before is not a comment, continue.
              // 5. Throw error, all rules-of-hooks ignores should have a descriptive comment before it.
              context.report({
                node: token,
                messageId: 'rulesOfHooks',
                suggest: [
                  {
                    desc: 'Write a comment describing why you are ignoring react-hooks/rules-of-hooks',
                    fix(fixer) {
                      return fixer.insertTextBeforeRange(
                        range,
                        matchCommentTokenFormatting(
                          'Write a comment describing why you are ignoring react-hooks/rules-of-hooks here...',
                          token,
                          true
                        )
                      );
                    },
                  },
                  {
                    desc: 'Remove the ignore and rethink your logic',
                    fix(fixer) {
                      return fixer.removeRange([
                        prevToken.range[1],
                        token.range[1],
                      ]);
                    },
                  },
                ],
              });
            }
          }
        });
      },
    };
  },
};
