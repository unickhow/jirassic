import { Title, Button, Space } from '@mantine/core';
import { IconEggCracked, IconEgg } from '@tabler/icons';
import GitHubPanel from '../components/gitHubPanel';
import ResultPanel from '../components/resultPanel';
import SettingModal from '../components/settingModal';
import { useState, useEffect } from 'react';
import { ISettingState, IFormState, IResultState, IJiraCommit } from '../declare/interface'
import { Pattern } from '../declare/enum'
import lf from '../lf';
import { fetch } from '@tauri-apps/api/http';
import { encode } from 'js-base64'

function App() {
  // setting modal data
  const [opened, setOpened] = useState<boolean>(false);
  const [settingState, setSettingState] = useState<ISettingState>({
    githubToken: '',
    repositories: [],
    branches: [],
    jiraDomain: '',
    jiraAccount: '',
    jiraToken: ''
  })

  const [resultState, setResultState] = useState<IResultState>({
    title: '',
    content: '',
    isLoading: true,
    isParentDisplay: true
  })

  useEffect(() => {
    async function initForm () {
      lf.iterate((value, key) => {
        setSettingState((form: ISettingState) => ({ ...form, [key]: value }))
      }).catch((err) => {
        console.error(err)
      });
    }
    initForm()
  }, [opened])
  //

  // github panel data
  const [formState, setFormState] = useState<IFormState>({
    owner: '',
    repository: '',
    base: '',
    compare: ''
  })

  const fetchPullRequestCommits = async () => {
    const { owner, repository, base, compare } = formState
    return fetch(`https://api.github.com/repos/${owner}/${repository}/compare/${base}...${compare}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${settingState.githubToken}` }
    }).then((res: any) => {
      return Promise.resolve(res.data.commits)
    })
  }

  const fetchJiraIssuesByCommits = async (commits: IJiraCommit[]) => {
    const { jiraDomain, jiraAccount, jiraToken } = settingState
    const commitMessages = commits.map((commit) => commit.commit.message)
    const jiraIssueKeys = commitMessages
      .filter((message) => message.match(Pattern.JiraIssuePatternInCommit))
      .map((message) => message.match(Pattern.JiraIssuePattern)?.[0])

    return Promise.all(jiraIssueKeys.map((issueKey) => {
      const token = `${jiraAccount}:${jiraToken}`
      const domain = /^https:\/\//.test(jiraDomain) ? jiraDomain : `https://${jiraDomain}`
      return fetch(`${domain}rest/api/3/issue/${issueKey}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${(encode(token))}`
        }
      }).then((res: any) => {
        const { fields: { summary: subject, issuetype, parent } } = res.data
        const data = {
          id: issueKey,
          subject,
          title: `- ${subject} [${issueKey}](${jiraDomain}/browse/${issueKey})`,
          isSubTask: issuetype.subtask,
          parent: issuetype.subtask
            ? {
              id: parent.key,
              subject: parent.fields.summary,
              title: `  - Parent: ${parent.fields.summary} [${parent.key}](${jiraDomain}/browse/${parent.key})`
            }
            : null
        }
        return Promise.resolve(data)
      })
    }))
  }
  const handleGenerate = async () => {
    setResultState((state) => ({ ...state, isLoading: true }))
    const commits = await fetchPullRequestCommits()
    const result = await fetchJiraIssuesByCommits(commits)

    setResultState((state) => ({
      ...state,
      isLoading: false,
      title: `Merge ${formState.compare} into ${formState.base} (${result.map((item) => item.id).join(', ')})`,
      content: result.map((item) => {
        return state.isParentDisplay && item.parent
          ? item.title.concat(`\r\n${item.parent.title}`)
          : item.title
      }).join('\r\n')
    }))
  }
  //

  return (
    <main className="container max-w-[760px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Title
          order={1}
          className="jirassic-gradient">Jirassic</Title>
        <SettingModal
          opened={opened}
          setOpened={setOpened}
          settingState={settingState}
          setSettingState={setSettingState} />
      </div>

      <GitHubPanel
        settingState={settingState}
        formState={formState}
        setFormState={setFormState} />

      <div className="flex justify-center my-8">
        <Button
          variant="subtle"
          color="gray"
          leftIcon={<IconEgg size={16} />}>Reset</Button>
        <Space w="sm" />
        <Button
          variant="gradient" gradient={{ from: '#ffda33', to: '#ab3e02', deg: 35 }}
          leftIcon={<IconEggCracked size={16} />}
          onClick={handleGenerate}>Generate</Button>
      </div>

      <ResultPanel resultState={resultState} />
    </main>
  );
}

export default App;
