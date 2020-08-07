const isKeywordPresent = require('../src/utils/isKeywordPresent')

describe('isKeywordPresent', () => {
  test('if no keyword present', () => {
    expect(isKeywordPresent('@ghworkflow this is message without workflow')).toBe(false)
  })

  test('if trigger keyword is present', () => {
    expect(isKeywordPresent('@ghworkflow trigger test')).toBe(true)
    expect(isKeywordPresent('@ghworkflow trigger test workflow')).toBe(true)
    expect(isKeywordPresent('@ghworkflow please trigger test')).toBe(true)
  })

  test('if help keyword is present', () => {
    expect(isKeywordPresent('@ghworkflow help')).toBe(true)
    expect(isKeywordPresent('@ghworkflow help me')).toBe(true)
    expect(isKeywordPresent('@ghworkflow please help')).toBe(true)
  })
})
