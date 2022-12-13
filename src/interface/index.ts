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
