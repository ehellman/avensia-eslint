/**
 * @fileoverview Prevent ignoring exhaustive-deps or rules-of-hooks without describing why
 * @author Erik Hellman
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const { isComment, matchCommentTokenFormatting, isEslintRule } = require('../util');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const RULES_OF_HOOKS_RULE_PATTERN = /(eslint).(?!.*enable).*(react-hooks\/rules-of-hooks)/u;
const EXHAUSTIVE_DEPS_RULE_PATTERN = /(eslint).(?!.*enable).*(react-hooks\/exhaustive-deps)/u;

//------------------------------------------------------------------------------
// Error Messages
//------------------------------------------------------------------------------
const messages = {
  exhaustiveDeps: `You are ignoring \`react-hooks/exhaustive-deps\` without providing an explanation as to why. 

Please remember that you should only ignore the \`react-hooks/exhaustive-deps\` rule if you know exactly what you are doing, as ignoring it can cause serious problems/bugs that are very difficult to track.

If your use case is to create a \`useEffect\` that only runs once, or a \`useCallback\`/\`useMemo\` that should never change, you can add a comment above this line explaining why it is being ignored. This will make the error go away.`,
  rulesOfHooks: `WARNING!!! What you are doing is extremely dangerous!

You are ignoring \`react-hooks/rules-of-hooks\` which is an anti-pattern and highly discouraged. You should **NOT** use react hooks conditionally or within a loop, if you do this your logic is wrong and should be rethought.

Please remember that you should only ignore the \`react-hooks/rules-of-hooks\` rule if you know exactly what you are doing as it can cause serious problems.

If you still need to do this for whatever reason, please add a comment above this line that describes why you are ignoring this important ESLint rule, adding a comment will make this error go away.`,
};
//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function isExhaustiveDepsRule(token) {
  return EXHAUSTIVE_DEPS_RULE_PATTERN.test(token.value);
}

function isRulesOfHooksRule(token) {
  return RULES_OF_HOOKS_RULE_PATTERN.test(token.value);
}

module.exports = {
  meta: {
    /**
     * True if the rule is deprecated, false otherwise
     */
    deprecated: false,
    /**
     * Documentation for the rule
     */
    docs: {
      description: 'Prevent ignoring exhaustive-deps or rules-of-hooks without describing why',
      /**
       * If this is set to `true`, it is expected that the rule is
       * included in the `recommended` configuration.
       */
      recommended: true,
      url: docsUrl('require-comment-for-hook-ignore'),
    },
    /**
     * The fixer category. Omit if there is no fixer
     */
    fixable: 'code',
    /**
     * Specifies whether rules can return suggestions. Omit if there is no suggestions
     */
    hasSuggestions: true,
    /**
     * The type of rule.
     * - `"problem"` means the rule is identifying code that either will cause an error or may cause a confusing behavior. Developers should consider this a high priority to resolve.
     * - `"suggestion"` means the rule is identifying something that could be done in a better way but no errors will occur if the code isn’t changed.
     * - `"layout"` means the rule cares primarily about whitespace, semicolons, commas, and parentheses, all the parts of the program that determine how the code looks rather than how it executes. These rules work on parts of the code that aren’t specified in the AST.
     */
    type: 'problem',
    /**
     * A map of messages which the rule can report.
     * The key is the messageId, and the string is the parameterised error string.
     * See: https://eslint.org/docs/developer-guide/working-with-rules#messageids
     */
    messages,
    /**
     * The name of the rule this rule was replaced by, if it was deprecated.
     *
     */
    // replacedBy: 'old-rule-name',
    /**
     * The options schema. Supply an empty array if there are no options.
     */
    schema: [],
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
                        matchCommentTokenFormatting('Write a comment describing why you are ignoring react-hooks/exhaustive-deps here...', token, true)
                      );
                    },
                  },
                  {
                    desc: 'Remove the ignore and let ESLint correctly populate the dependency array.',
                    fix(fixer) {
                      return fixer.removeRange([prevToken.range[1], token.range[1]]);
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
                        matchCommentTokenFormatting('Write a comment describing why you are ignoring react-hooks/rules-of-hooks here...', token, true)
                      );
                    },
                  },
                  {
                    desc: 'Remove the ignore and rethink your logic',
                    fix(fixer) {
                      return fixer.removeRange([prevToken.range[1], token.range[1]]);
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
