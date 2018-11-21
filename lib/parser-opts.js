'use strict'

module.exports = {
  headerPattern: /^(\S+) (?:\((.*)\))? \S+: (.*)$/,
  headerCorrespondence: [`type`, `scope`, `subject`],
  noteKeywords: [`BREAKING CHANGE`],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: [`header`, `hash`]
}
