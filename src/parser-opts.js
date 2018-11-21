'use strict'

module.exports = {
  headerPattern: /^(\W*)(?:\((.*)\))?: (.*)$/,
  headerCorrespondence: [
    `type`,
    `scope`,
    `subject`
  ],
  noteKeywords: [`BREAKING CHANGE`],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: [`header`, `hash`]
}
