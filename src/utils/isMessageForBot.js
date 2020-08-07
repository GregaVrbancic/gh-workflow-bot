function isMessageForBot (message) {
  const lowerCaseMessage = message.toLowerCase()
  const isMessageForBot =
    /@gh-workflow\s/.test(lowerCaseMessage) ||
    /@gh-workflowbot\s/.test(lowerCaseMessage) ||
    /@gh-workflow-bot\s/.test(lowerCaseMessage) ||
    /@ghworkflow\s/.test(lowerCaseMessage) ||
    /@ghworkflowbot\s/.test(lowerCaseMessage) ||
    /@ghworkflow-bot\s/.test(lowerCaseMessage)
  return isMessageForBot
}

module.exports = isMessageForBot
