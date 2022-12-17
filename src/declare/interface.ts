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
  isParentDisplay: boolean,
  isLoading: boolean
}

export interface IJiraCommit {
  id: string,
  commit: {
    message: string
  }
}
