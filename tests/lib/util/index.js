/* eslint-env mocha */

'use strict';

const assert = require('assert');
const { isComment, matchCommentTokenFormatting } = require('../../../lib/util');

describe('isComment', () => {
  it('should be able to tell if a node/token is a comment or not', () => {
    const commentToken = {
      type: 'Line',
    };
    const commentToken2 = {
      type: 'Block',
    };
    const invalidToken = {
      type: 'FunctionExpression',
    };
    const invalidToken2 = {
      type: 'VariableDeclaration',
    };

    assert.equal(isComment(commentToken), true);
    assert.equal(isComment(commentToken2), true);
    assert.equal(isComment(invalidToken), false);
    assert.equal(isComment(invalidToken2), false);
  });
});

describe('matchCommentTokenFormatting', () => {
  const comment = 'Hello world';

  it('should match comment style', () => {
    const lineCommentToken = {
      type: 'Line',
    };
    const blockCommentToken = {
      type: 'Block',
    };

    const lineCommentExpectation = `// ${comment}`;
    const blockCommentExpectation = `/* ${comment} */`;
    assert.equal(
      matchCommentTokenFormatting(comment, lineCommentToken),
      lineCommentExpectation
    );
    assert.equal(
      matchCommentTokenFormatting(comment, blockCommentToken),
      blockCommentExpectation
    );
  });

  it('should return a Line comment as default', () => {
    const specialCommentToken = {
      type: 'SomeUnknownCommentType',
    };

    const expectation = `// ${comment}`;

    assert.equal(
      matchCommentTokenFormatting(comment, specialCommentToken),
      expectation
    );
  });

  it('should add a new line at the end of the comment when prompted', () => {
    const lineCommentToken = {
      type: 'Line',
    };

    const expectation = `// ${comment}\n`;

    assert.equal(
      matchCommentTokenFormatting(comment, lineCommentToken, true),
      expectation
    );
  });
});
