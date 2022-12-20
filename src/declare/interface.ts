export interface ISettingState {
  githubToken: string;
  repositories: string[];
  branches: string[];
  jiraDomain: string;
  jiraAccount: string;
  jiraToken: string;
}

export interface IFormState {
  owner: string,
  repository: string,
  base: string,
  compare: string
}

export interface IResultState {
  title: string,
  content: string,
  isLoading: boolean
}

export interface IGitHubCommit {
  id: string,
  commit: {
    message: string
  }
}

export interface IGitHubBranchDiffResponse {
  commits: IGitHubCommit[]
}
export interface IJiraIssueResponse {
  key: string,
  fields: {
    summary: string,
    issuetype: {
      subtask: boolean
    },
    parent?: {
      key: string,
      fields: {
        summary: string
      }
    }
  }
}

export interface IMatchedResult {
  id: string,
  title: string,
  isSubTask: boolean,
  parent?: {
    id: string,
    subject: string,
    title: string
  } | null
}
