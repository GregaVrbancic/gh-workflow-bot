async function identifyWorkflowName (context) {
  const params = {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name
  }

  const message = context.payload.comment.body.toLowerCase().trim()
  const response = await context.github.actions.listRepoWorkflows(params)

  console.log(response.data)
  for (const workflow of response.data.workflows) {
    context.log(
      workflow.name.toLowerCase(),
      '=>',
      message,
      ':::',
      message.indexOf(workflow.name.toLowerCase().trim())
    )

    if (message.indexOf(workflow.name.toLowerCase().trim()) !== -1) {
      return workflow
    }
  }

  return null
}

async function getWorkflows (context) {
  const params = {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name
  }

  const response = await context.github.actions.listRepoWorkflows(params)
  return response.data.workflows
}

module.exports = {
  getWorkflows: getWorkflows,
  identifyWorkflowName: identifyWorkflowName
}
