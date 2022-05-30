'use strict';

exports.EXHAUSTIVE_DEPS_ERROR_MESSAGE = `You are ignoring \`react-hooks/exhaustive-deps\` without providing an explanation as to why. 

Please remember that you should only ignore the \`react-hooks/exhaustive-deps\` rule if you know exactly what you are doing, as ignoring it can cause serious problems/bugs that are very difficult to track.

If your use case is to create a \`useEffect\` that only runs once, or a \`useCallback\`/\`useMemo\` that should never change, you can add a comment above this line explaining why it is being ignored. This will make the error go away.`;

exports.RULES_OF_HOOKS_ERROR_MESSAGE = `WARNING!!! What you are doing is extremely dangerous!

You are ignoring \`react-hooks/rules-of-hooks\` which is an anti-pattern and highly discouraged. You should **NOT** use react hooks conditionally or within a loop, if you do this your logic is wrong and should be rethought.

Please remember that you should only ignore the \`react-hooks/rules-of-hooks\` rule if you know exactly what you are doing as it can cause serious problems.

If you still need to do this for whatever reason, please add a comment above this line that describes why you are ignoring this important ESLint rule, adding a comment will make this error go away.`;
