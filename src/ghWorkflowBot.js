const outdent = require('outdent')

const isMessageForBot = require('./utils/isMessageForBot')
const { getWorkflows, identifyWorkflowName } = require('./utils/getWorkflows')
const getPullRequest = require('./utils/getPullRequest')
const workflowDispatch = require('./utils/workflowDispatch')

async function ghWorkflowBot (context) {
  if (context.payload.issue.pull_request) {
    const message = context.payload.comment.body.toLowerCase()

    if (isMessageForBot(message) && context.payload.comment.user.login !== 'gh-workflow-bot[bot]') {
      if (message.indexOf('trigger') !== -1) { // check if trigger keyword is present
        const workflow = await identifyWorkflowName(context)
        if (workflow) {
          const pullRequest = await getPullRequest(context)

          try {
            const response = await workflowDispatch(context, workflow, pullRequest)
            context.log(response)
            const issueComment = context.issue({
              body: `Hey @${context.payload.comment.user.login}, I have triggered the "${workflow.name}" workflow for you 😇`
            })
            return context.github.issues.createComment(issueComment)
          } catch (error) {
            context.log('CATCH:', error)
            const issueComment = context.issue({
              body: `Hey @${context.payload.comment.user.login}, I am sorry but the "${workflow.name}" workflow does not have "workflow_dispatch" trigger defined.`
            })
            return context.github.issues.createComment(issueComment)
          }
        } else {
          const issueComment = context.issue({
            body: `Hey @${context.payload.comment.user.login}, I have not been able to find workflow 🥺 Are you shure there is one? 🤔`
          })
          return context.github.issues.createComment(issueComment)
        }
      } else if (message.indexOf('help') !== -1) {
        const issueComment = context.issue({
          body:
            outdent`
            Hey @${context.payload.comment.user.login}, here are some tasks I can do for you:

            \`@ghworkflow help\`
            \`@ghworkflow trigger <workflow-name>\`
            \`@ghworkflow list workflows\`
            `
        })
        return context.github.issues.createComment(issueComment)
      } else if (message.indexOf('list') !== -1) {
        const workflows = await getWorkflows(context)

        let message = 'Hey @' + context.payload.comment.user.login + ', I have found these workflows:\n'

        for (const workflow of workflows) {
          message += '\n- ' + workflow.name
        }

        const issueComment = context.issue({
          body: message
        })
        return context.github.issues.createComment(issueComment)
      } else {
        const issueComment = context.issue({
          body:
            outdent`
            Hey @${context.payload.comment.user.login}, I have not recognized any command 😕

            Here are some tasks I can do for you:

            \`@ghworkflow help\`
            \`@ghworkflow trigger <workflow-name>\`
            \`@ghworkflow list workflows\`
            `
        })
        return context.github.issues.createComment(issueComment)
      }
    }
  }
}

module.exports = ghWorkflowBot
