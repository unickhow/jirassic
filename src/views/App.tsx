import { Title, Button, Space } from '@mantine/core';
import { IconEggCracked, IconEgg } from '@tabler/icons';
import GitHubPanel from '../components/gitHubPanel';
import ResultPanel from '../components/resultPanel';
import SettingModal from '../components/settingModal';
import { useState, useEffect, useMemo } from 'react';
import { ISettingState, IFormState, IResultState, IGitHubCommit, IJiraIssueResponse, IMatchedResult } from '../declare/interface';
import { JiraIssuePatternInCommit, JiraIssuePattern } from '../declare/enum';
import lf from '../lf';
import { fetch } from '@tauri-apps/api/http';
import { encode } from 'js-base64';

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
    isLoading: false
  })
  const [isParentDisplay, setIsParentDisplay] = useState<boolean>(false)

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

  const [matchedResults, setMatchedResults] = useState<IMatchedResult[]>([])
  const fetchJiraIssuesByCommits = async (commits: IGitHubCommit[]) => {
    setMatchedResults([])
    const { jiraDomain, jiraAccount, jiraToken } = settingState
    const commitMessages: string[] = commits.map((commit) => commit.commit.message)
    const jiraIssueKeys: string[] = [...new Set(commitMessages
      .filter((message) => message.match(JiraIssuePatternInCommit))
      .map((message) => message.match(JiraIssuePattern)?.[0] || '')
      .filter(Boolean))]

    return Promise.all(jiraIssueKeys.map((issueKey) => {
      const token = `${jiraAccount}:${jiraToken}`
      const domain = /^https:\/\//.test(jiraDomain) ? jiraDomain : `https://${jiraDomain}`
      const url = domain.endsWith('/') ? domain : `${domain}/`
      return fetch(`${url}rest/api/3/issue/${issueKey}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${(encode(token))}`
        }
      }).then((res: any) => {
        const { fields: { summary, issuetype, parent } } = res.data as IJiraIssueResponse
        const result: IMatchedResult = {
          id: issueKey,
          title: `- ${summary} [(${issueKey})](${url}browse/${issueKey})`,
          isSubTask: issuetype.subtask,
          parent: issuetype.subtask && parent
            ? {
              id: parent.key,
              subject: parent.fields.summary,
              title: `  - Parent: ${parent.fields.summary} [(${parent.key})](${url}browse/${parent.key})`
            }
            : null
        }
        setMatchedResults((state) => [...state, result])
        return Promise.resolve(result)
      })
    }))
  }
  //

  const isGenerateAvailable = useMemo(() => {
    const { owner, repository, base, compare } = formState
    return owner && repository && base && compare
  }, [formState])
  useEffect(() => {
    let result = ''
    if (isParentDisplay) {
      result = matchedResults.map((item) => {
        return item.parent
          ? item.title.concat(`\r\n${item.parent.title}`)
          : item.title
      }).join('\r\n')
    } else {
      result = matchedResults.map((item) => item.title).join('\r\n')
    }
    setResultState((state) => ({ ...state, content: result }))
  }, [isParentDisplay])
  const handleGenerate = async () => {
    setResultState((state) => ({ ...state, isLoading: true }))
    const commits = await fetchPullRequestCommits()
    const result = await fetchJiraIssuesByCommits(commits)

    setResultState((state) => ({
      ...state,
      isLoading: false,
      title: `Merge ${formState.compare} into ${formState.base} (${result.map((item) => item.id).join(', ')})`,
      content: result.map((item) => {
        return isParentDisplay && item.parent
          ? item.title.concat(`\r\n${item.parent.title}`)
          : item.title
      }).join('\r\n')
    }))
  }

  const isResetAvailable = useMemo(() => {
    return resultState.title || resultState.content
  }, [resultState])
  const handleReset = () => {
    setFormState({
      owner: '',
      repository: '',
      base: '',
      compare: ''
    })
    setResultState({
      title: '',
      content: '',
      isLoading: false
    })
    setIsParentDisplay(false)
  }

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
          leftIcon={<IconEgg size={16} />}
          disabled={!isResetAvailable}
          onClick={handleReset}>Reset</Button>
        <Space w="sm" />
        <Button
          variant="gradient" gradient={{ from: '#ffda33', to: '#ab3e02', deg: 35 }}
          leftIcon={<IconEggCracked size={16} />}
          disabled={!isGenerateAvailable}
          onClick={handleGenerate}>Generate</Button>
      </div>

      <ResultPanel
        {...{
          resultState,
          isParentDisplay,
          setIsParentDisplay
        }} />
    </main>
  );
}

export default App;
