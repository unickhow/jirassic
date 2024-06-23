export interface IWorkspace {
  id: string
  name: string
  owner: string
  githubToken: string
  repositories: string[]
  branches: string[]
  jiraDomain: string
  jiraAccount: string
  jiraToken: string
  color: string
}

export interface IFormState {
  owner: string
  repository: string
  base: string
  compare: string
}

export interface IResultState {
  title: string
  content: string
  isLoading: boolean
}

export interface IGitHubCommit {
  id: string
  commit: {
    message: string
  }
}

export interface IGitHubBranchDiffResponse {
  commits: IGitHubCommit[]
}
export interface IJiraIssueResponse {
  key: string
  fields: {
    summary: string
    issuetype: {
      subtask: boolean
    }
    parent?: {
      key: string
      fields: {
        summary: string
      }
    }
  }
}

export interface IMatchedResult {
  id: string
  title: string
  isSubTask: boolean
  parent?: {
    id: string
    subject: string
    title: string
  } | null
}

export interface IUnmergedPullRequest {
  title: string
  url: string
  isDraft: boolean
  base: {
    ref: string
    label: string
    sha: string
    repo: any
    user: any
  }
  head: {
    ref: string
    label: string
    sha: string
    repo: any
    user: any
  }
  author: string
}

export interface IStatisticsRecord {
  unmergedPullRequests: IUnmergedPullRequest[]
}

export interface IStoreStatistics {
  [workspace: string]: {
    repos: {
      [repo: string]: IStatisticsRecord
    }
  } & {
    lastFetchTime: string
  }
}

export interface IGitHubPullRequest {
  base: {
    ref: string
    label: string
    sha: string
    repo: any
    user: any
  }
  head: {
    ref: string
    label: string
    sha: string
    repo: any
    user: any
  }
  user: {
    login: string
  }
  html_url: string
  draft: boolean
  title: string
  state: string
  // ... and more
}
