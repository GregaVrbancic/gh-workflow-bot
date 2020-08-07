const isMessageForBot = require('../src/utils/isMessageForBot')

describe('isMessageForBot', () => {
  test('if @gh-workflow is recognized mention in a message', () => {
    expect(isMessageForBot('@gh-workflow please trigger test')).toBe(true)
  })

  test('if @ghworkflow-bot is recognized mention a message', () => {
    expect(isMessageForBot('@ghworkflow-bot please trigger test')).toBe(true)
  })

  test('if @gh-workflow-bot is recognized mention a message', () => {
    expect(isMessageForBot('@gh-workflow-bot please trigger test')).toBe(true)
  })

  test('if @ghworkflow is recognized mention in a message', () => {
    expect(isMessageForBot('@ghworkflow please trigger test')).toBe(true)
  })

  test('if @ghworkflowbot is recognized mention a message', () => {
    expect(isMessageForBot('@ghworkflowbot please trigger test')).toBe(true)
  })

  test('if @ghworkflow-bot is recognized mention a message', () => {
    expect(isMessageForBot('@ghworkflowbot please trigger test')).toBe(true)
  })
})
