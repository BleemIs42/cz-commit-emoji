'use strict'

module.exports = {
  headerPattern: /^(\S+)\s+(?:\((.*)\)\s+)?(\S+):\s+(.*)$/,
  headerCorrespondence: [`type`, `scope`, `typeName`, `subject`],
  noteKeywords: [`BREAKING CHANGE`],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: [`header`, `hash`]
}
