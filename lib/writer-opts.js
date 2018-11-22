'use strict'

const compareFunc = require(`compare-func`)
const readFileSync = require(`fs`).readFileSync
const resolve = require(`path`).resolve
const types = require('./types')

const getTpl = (name) => readFileSync(resolve(__dirname, `./templates/${name}.hbs`), `utf-8`)

module.exports = {
  ...getWriterOpts(),
  mainTemplate: getTpl('template'),
  headerPartial: getTpl('header'),
  commitPartial: getTpl('commit'),
  footerPartial: getTpl('footer')
}

function getWriterOpts() {
  return {
    transform: (commit, context) => {
      let discard = true
      const issues = []

      commit.notes.forEach((note) => {
        note.title = `BREAKING CHANGES`
        discard = false
      })

      if (commit.typeName) {
        const type = types.filter(({ name }) => commit.typeName === name)[0] || {}

        if (type.name === `feature`) {
          commit.type = `Features`
        } else if (type.name === `fix`) {
          commit.type = `Bug Fixes`
        } else if (type.name === `perf`) {
          commit.type = `Performance Improvements`
        } else if (type.name === `revert`) {
          commit.type = `Reverts`
        } else if (discard) {
          return
        } else if (type.name === `docs`) {
          commit.type = `Documentation`
        } else if (type.name === `style`) {
          commit.type = `Styles`
        } else if (type.name === `refactoring`) {
          commit.type = `Code Refactoring`
        } else if (type.name === `test`) {
          commit.type = `Tests`
        } else if (type.name === `building-construction`) {
          commit.type = `Build System`
        } else if (type.name === `ci`) {
          commit.type = `Continuous Integration`
        }

        commit.type = [type.emoji, commit.type].join(' ')
      }

      if (commit.scope === `*`) {
        commit.scope = ``
      }

      if (typeof commit.hash === `string`) {
        commit.hash = commit.hash.substring(0, 7)
      }

      if (typeof commit.subject === `string`) {
        let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl
        if (url) {
          url = `${url}/issues/`
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue)
            return `[#${issue}](${url}${issue})`
          })
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9]){0,38})/g, `[@$1](${context.host}/$1)`)
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter((reference) => {
        if (issues.indexOf(reference.issue) === -1) {
          return true
        }

        return false
      })

      return commit
    },
    groupBy: `type`,
    commitGroupsSort: `title`,
    commitsSort: [`scope`, `subject`],
    noteGroupsSort: `title`,
    notesSort: compareFunc
  }
}
