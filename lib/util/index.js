'use strict';

const ESLINT_RULE_PATTERN = /^\s*(?:eslint|jshint\s+|jslint\s+|istanbul\s+|globals?\s+|exported\s+|jscs)/u;

function isComment(token) {
  return token.type === 'Line' || token.type === 'Block';
}

function matchCommentTokenFormatting(comment, token, newLineAtEnd) {
  if (token.type === 'Block') {
    return `/* ${comment} */${newLineAtEnd ? '\n' : ''}`;
  }
  // assume token.type is Line
  return `// ${comment}${newLineAtEnd ? '\n' : ''}`;
}

function insertTextAt(index, text) {
  return {
    range: [index, index],
    text,
  };
}

function insertTextBeforeRange(range, text) {
  return insertTextAt(range[0], text);
}

function isEslintRule(token) {
  return ESLINT_RULE_PATTERN.test(token.value);
}

function getCommentsLineNumbers(comments) {
  const lines = [];

  comments.forEach((token) => {
    lines.push(token.loc.start.line, token.loc.end.line);
  });

  return lines;
}

function getEmptyLineNumbers(lines) {
  const emptyLines = lines
    .map((line, i) => ({
      code: line.trim(),
      num: i + 1,
    }))
    .filter((line) => !line.code)
    .map((line) => line.num);

  return emptyLines;
}

module.exports = {
  ESLINT_RULE_PATTERN,
  isComment,
  matchCommentTokenFormatting,
  insertTextAt,
  insertTextBeforeRange,
  isEslintRule,
  getCommentsLineNumbers,
  getEmptyLineNumbers,
};
