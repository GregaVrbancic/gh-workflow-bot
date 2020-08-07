function isKeywordPresent (message) {
  const lowerCaseMessage = message.toLowerCase()
  const isKeywordPresent =
    /\strigger\s/.test(lowerCaseMessage) || /\strigger/.test(lowerCaseMessage) ||
    /\shelp\s/.test(lowerCaseMessage) || /\shelp/.test(lowerCaseMessage) ||
    /\slist workflows\s/.test(lowerCaseMessage) || /\slist workflows/.test(lowerCaseMessage)
  return isKeywordPresent
}

module.exports = isKeywordPresent
