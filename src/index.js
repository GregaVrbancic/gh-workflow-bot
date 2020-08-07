/**
 * This is the main entrypoint to gh-workflow-bot app
 * @param {import('probot').Application} app
 */

const ghWorkflowBot = require('./ghWorkflowBot')

module.exports = app => {
  app.log('Yay, the gh-workflow-bot app was loaded!')
  app.on('issue_comment.created', ghWorkflowBot)
}
