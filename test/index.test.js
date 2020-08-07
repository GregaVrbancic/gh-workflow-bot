const nock = require('nock')
const github = require('@octokit/rest')()
const outdent = require('outdent')
// Requiring our app implementation
const myProbotApp = require('../src/index')
const { Probot } = require('probot')
const ghWorkflowBot = require('../src/ghWorkflowBot')
// Requiring our fixtures
const payloadUnknownWorkflow = require('./fixtures/issue_comment.created.unknown-workflow.json')
const payloadKnownWorkflow = require('./fixtures/issue_comment.created.known-workflow.json')
const payloadHelp = require('./fixtures/issue_comment.created.help.json')
const payloadList = require('./fixtures/issue_comment.created.list.json')
const payloadNoCommand = require('./fixtures/issue_comment.created.no-command.json')
const listRepoWorkflowsResponse = require('./fixtures/listRepoWorkflows')
const payloadIssuesOpened = require('./fixtures/issues.opened.json')
const payloadGhWorkflowBot = require('./fixtures/issue_comment.created.ghWorkflowBot.json')
const fs = require('fs')
const path = require('path')

describe('gh-workflow-bot app', () => {
  let probot
  let mockCert

  beforeAll((done) => {
    fs.readFile(path.join(__dirname, 'fixtures/mock-cert.pem'), (err, cert) => {
      if (err) return done(err)
      mockCert = cert
      done()
    })
  })

  beforeEach(() => {
    nock.disableNetConnect()
    probot = new Probot({ id: 123, cert: mockCert })
    // Load our app into probot
    probot.load(myProbotApp)
    probot.github = github
    probot.log = console.log
    probot.issue = (body) => {
      return { owner: 'GregaVrbancic', repo: 'gh-workflow-bot-test', number: 5, ...body }
    }

    nock('https://api.github.com')
      .get('/repos/GregaVrbancic/gh-workflow-bot-test/actions/workflows')
      .reply(200, async () => {
        return listRepoWorkflowsResponse
      })

    nock('https://api.github.com')
      .get('/repos/GregaVrbancic/gh-workflow-bot-test/pulls/5')
      .reply(200, async () => {
        return {
          head: {
            ref: 'update'
          }
        }
      })

    nock('https://api.github.com')
      .post('/repos/GregaVrbancic/gh-workflow-bot-test/actions/workflows/161335/dispatches')
      .reply(204)
  })

  test('ignores if issues opened is created', async () => {
    probot.payload = payloadIssuesOpened
    await probot.receive({ name: 'issues', payload: payloadIssuesOpened })
    await ghWorkflowBot(probot)
  })

  test('ignores if @gh-workflow-bot mentiones itself', async () => {
    nock('https://api.github.com')
      .post('/repos/GregaVrbancic/gh-workflow-bot-test/issues/5/comments', (body) => {
        expect(body).toMatchObject({})
        return true
      })
      .reply(200)

    probot.payload = payloadGhWorkflowBot
    await probot.receive({ name: 'issues', payload: payloadGhWorkflowBot })
    await ghWorkflowBot(probot)
  })

  test('creates a comment when no workflow found', async () => {
    const expectedComment = {
      body: 'Hey @GregaVrbancic, I have not been able to find workflow 🥺 Are you shure there is one? 🤔'
    }

    nock('https://api.github.com')
      .post('/repos/GregaVrbancic/gh-workflow-bot-test/issues/5/comments', (body) => {
        expect(body).toMatchObject(expectedComment)
        return true
      })
      .reply(200)

    probot.payload = payloadUnknownWorkflow
    await probot.receive({ name: 'issues', payload: payloadUnknownWorkflow })
    await ghWorkflowBot(probot)
  })

  test('creates a comment when workflow is found and triggered', async () => {
    const expectedComment = {
      body: 'Hey @GregaVrbancic, I have triggered the "Test" workflow for you 😇'
    }

    nock('https://api.github.com')
      .post('/repos/GregaVrbancic/gh-workflow-bot-test/issues/5/comments', (body) => {
        expect(body).toMatchObject(expectedComment)
        return true
      })
      .reply(200)

    probot.payload = payloadKnownWorkflow
    await probot.receive({ name: 'issues', payload: payloadKnownWorkflow })
    await ghWorkflowBot(probot)
  })

  test('creates a comment when help command is present', async () => {
    const expectedComment = {
      body:
        outdent`
        Hey @GregaVrbancic, here are some tasks I can do for you:

        @ghworkflow help
        @ghworkflow trigger <workflow-name>
        @ghworkflow list workflows
        `
    }

    nock('https://api.github.com')
      .post('/repos/GregaVrbancic/gh-workflow-bot-test/issues/5/comments', (body) => {
        expect(body).toMatchObject(expectedComment)
        return true
      })
      .reply(200)

    probot.payload = payloadHelp
    await probot.receive({ name: 'issues', payload: payloadHelp })
    await ghWorkflowBot(probot)
  })

  test('creates a comment when list command is received', async () => {
    const expectedComment = {
      body:
        outdent`
        Hey @GregaVrbancic, I have found these workflows:

        - Test`
    }

    nock('https://api.github.com')
      .post('/repos/GregaVrbancic/gh-workflow-bot-test/issues/5/comments', (body) => {
        expect(body).toMatchObject(expectedComment)
        return true
      })
      .reply(200)

    probot.payload = payloadList
    await probot.receive({ name: 'issues', payload: payloadList })
    await ghWorkflowBot(probot)
  })

  test('creates a comment when no command is received', async () => {
    const expectedComment = {
      body:
        outdent`
        Hey @GregaVrbancic, I have not recognized any command 😕

        Here are some tasks I can do for you:

        @ghworkflow help
        @ghworkflow trigger <workflow-name>
        @ghworkflow list workflows
        `
    }

    nock('https://api.github.com')
      .post('/repos/GregaVrbancic/gh-workflow-bot-test/issues/5/comments', (body) => {
        expect(body.body).toMatch(expectedComment.body)
        return true
      })
      .reply(200)

    probot.payload = payloadNoCommand
    await probot.receive({ name: 'issues', payload: payloadNoCommand })
    await ghWorkflowBot(probot)
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
})
