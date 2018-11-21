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

      if (commit.type) {
        const commitType = commit.type.trim()
        const type = types.filter(({ emoji, code }) => commitType === emoji || commitType === code)[0]

        if (type) {
          commit.type = [type.emoji, type.name.toLowerCase().replace(/^\S/g, (s) => s.toUpperCase())].join(' ')
        }
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
