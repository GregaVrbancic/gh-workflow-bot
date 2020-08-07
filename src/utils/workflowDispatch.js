async function workflowDispatch (context, workflow, pullRequest) {
  return context.github.request(
    `POST /repos/${context.payload.repository.owner.login}/${context.payload.repository.name}/actions/workflows/${workflow.id}/dispatches`,
    {
      ref: pullRequest.head.ref
    }
  )
}

module.exports = workflowDispatch
