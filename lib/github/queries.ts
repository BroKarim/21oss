export const repositoryQuery = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      owner {
        login
      }
      description
      url
      homepageUrl
      createdAt
      updatedAt
      pushedAt
      stargazerCount
      forkCount
      mentionableUsers(first: 30) {
        totalCount
        nodes {
          login
        }
      }
      watchers {
        totalCount
      }
      licenseInfo {
        spdxId
      }
      repositoryTopics(first: 10) {
        nodes {
          topic {
            name
          }
        }
      }
    }
  }
`;
