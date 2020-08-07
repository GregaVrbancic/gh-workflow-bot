async function getPullRequest (context) {
  const params = {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    pull_number: context.payload.issue.pull_request.url.split('/').pop()
  }

  const response = await context.github.pulls.get(params)

  return response.data
}

module.exports = getPullRequest
