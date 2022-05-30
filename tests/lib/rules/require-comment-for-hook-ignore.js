/**
 * @fileoverview Forbid "button" element without an explicit "type" attribute
 * @author Filipp Riabchun
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/require-comment-for-hook-ignore');

const parserOptions = {
  ecmaVersion: 2015, // or 2018?
  sourceType: 'module',
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
// create dummy rule for exhaustive-deps to bypass not-defined error
ruleTester.defineRule('react-hooks/exhaustive-deps', {});
// create dummy rule for rules-of-hooks to bypass not-defined error
ruleTester.defineRule('react-hooks/rules-of-hooks', {});

ruleTester.run('require-comment-for-hook-ignore', rule, {
  valid: [
    {
      name: 'exhaustive-deps | does not throw an error when a descriptive comment is present',
      code: `
function MyComponent(props) {
  var someFunction = useCallback(function() {
      // descriptive comment that explains why deps are being ignored
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])
}
      `.trim(),
      errors: [
        {
          messageId: 'exhaustiveDeps',
          type: 'Line',
        },
      ],
    },
    {
      name: 'exhaustive-deps | does not throw an error when a descriptive comment is present',
      code: `
function MyComponent(props) {
  var someFunction = useCallback(function() {
      /* descriptive comment that explains why deps are being ignored */
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [props])
}      
      `.trim(),
      errors: [
        {
          messageId: 'exhaustiveDeps',
          type: 'Block',
        },
      ],
    },
    {
      name: 'rules-of-hooks | does not throw an error when a descriptive comment is present',
      code: `
if (true) {
  // descriptive comment that explains why rules-of-hooks are being ignored
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(function() {
    doSomething();
  }, [])
}
      `.trim(),
      errors: [
        {
          messageId: 'rulesOfHooks',
          type: 'Line',
        },
      ],
    },
  ],
  invalid: [
    {
      name: 'exhaustive-deps ignore (Block Comment) throws an error',
      code: `
function MyComponent(props) {
  var someFunction = useCallback(function() {
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [props])
}      
      `.trim(),
      errors: [
        {
          messageId: 'exhaustiveDeps',
          type: 'Block',
          suggestions: [
            {
              // a comment is added to show how to get rid of the error
              // suggests a comment of the same comment type
              output: `
function MyComponent(props) {
  var someFunction = useCallback(function() {
/* Write a comment describing why you are ignoring react-hooks/exhaustive-deps here... */
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [props])
}
              `.trim(),
            },
            {
              // the line is removed
              output: `
function MyComponent(props) {
  var someFunction = useCallback(function() {
  }, [props])
}
              `.trim(),
            },
          ],
        },
      ],
    },
    {
      name: 'exhaustive-deps ignore (Line Comment) throws an error',
      code: `
function MyComponent(props) {
  var someFunction = useCallback(function() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])
}      
      `.trim(),
      errors: [
        {
          messageId: 'exhaustiveDeps',
          type: 'Line',
          suggestions: [
            {
              // a comment is added to show how to get rid of the error
              output: `
function MyComponent(props) {
  var someFunction = useCallback(function() {
// Write a comment describing why you are ignoring react-hooks/exhaustive-deps here...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])
}
              `.trim(),
            },
            {
              // the line is removed
              output: `
function MyComponent(props) {
  var someFunction = useCallback(function() {
  }, [props])
}
              `.trim(),
            },
          ],
        },
      ],
    },
    {
      name: 'rules-of-hooks ignore (Line Comment) throws an error',
      code: `
if (true) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(function() {
    doSomething();
  }, [])
}
      `.trim(),
      errors: [
        {
          messageId: 'rulesOfHooks',
          type: 'Line',
          suggestions: [
            {
              // a comment is added to show how to get rid of the error
              output: `
if (true) {
// Write a comment describing why you are ignoring react-hooks/rules-of-hooks here...
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(function() {
    doSomething();
  }, [])
}      
              `.trim(),
            },
            {
              // the line is removed
              output: `
if (true) {
  useEffect(function() {
    doSomething();
  }, [])
}      
              `.trim(),
            },
          ],
        },
      ],
    },
  ],
});
