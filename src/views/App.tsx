import { Title, Button, Space, LoadingOverlay } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconEggCracked, IconEgg } from '@tabler/icons-react'
import GitHubPanel from '../components/gitHubPanel'
import ResultPanel from '../components/resultPanel'
import SettingModal from '../components/settingModal'
import RemoveWorkspace from '../components/removeWorkspace'
import { useState, useEffect, useMemo } from 'react'
import { IFormState, IResultState, IGitHubCommit, IJiraIssueResponse, IMatchedResult } from '../declare/interface'
import { JiraIssuePatternInCommit, JiraIssuePattern } from '../declare/enum'
import fetch from '../utils/request'
import { encode } from 'js-base64'
import { ReactComponent as Loader } from '../assets/loading-dna.svg'
import WorkspaceBadge from '../components/workspaceBadge'
import { useStore } from '../store'
import CONSTANTS from '../utils/constants'

function App() {
  // setting modal data
  const [opened, setOpened] = useState<boolean>(false)
  const store = useStore() as any

  // github panel data
  const [formState, setFormState] = useState<IFormState>({
    owner: '',
    repository: '',
    base: '',
    compare: ''
  })

  // init owner from current workspace
  useEffect(() => {
    setFormState(state => ({
      ...state,
      owner: store.currentWorkspace.owner
    }))
  }, [])

  const [resultState, setResultState] = useState<IResultState>({
    title: '',
    content: '',
    isLoading: false
  })
  const [isParentDisplay, setIsParentDisplay] = useState<boolean>(false)

  const fetchPullRequestCommits = async () => {
    const { owner, repository, base, compare } = formState
    return fetch(`https://api.github.com/repos/${owner}/${repository}/compare/${base}...${compare}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${store.currentWorkspace.githubToken}` }
    }).then((res: any) => {
      if (!res.ok) {
        return Promise.reject(new Error(res.data?.message || 'GitHub compare failed'))
      }
      return Promise.resolve(res.data.commits)
    }).catch(err => {
      showNotification({
        title: 'GitHub fetch error',
        message: err.message,
        color: 'red',
        autoClose: CONSTANTS.NOTIFICATION_DURATION
      })
      throw new Error(err)
    })
  }

  const [matchedResults, setMatchedResults] = useState<IMatchedResult[]>([])
  const fetchJiraIssuesByCommits = async (commits: IGitHubCommit[]) => {
    setMatchedResults([])
    const { jiraDomain, jiraAccount, jiraToken } = store.currentWorkspace
    const commitMessages: string[] = commits?.map((commit) => commit.commit.message) ?? []
    const jiraIssueKeys: string[] = [...new Set(commitMessages
      ?.filter((message) => message.match(JiraIssuePatternInCommit))
      ?.map((message) => message.match(JiraIssuePattern)?.[0] || '')
      ?.filter(Boolean))] ?? []

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
        if (!res.ok) {
          return Promise.reject(new Error(res.data?.errorMessages?.[0] || 'Jira issue not found'))
        }
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
      }).catch(err => {
        showNotification({
          title: `Jira fetch error: ${issueKey}`,
          message: err.message,
          color: 'red',
          autoClose: CONSTANTS.NOTIFICATION_DURATION
        })
        throw new Error(err)
      })
    }))
  }
  //

  const isGenerateAvailable = useMemo(() => {
    const { owner, repository, base, compare } = formState
    return owner && repository && base && compare
  }, [formState])
  const handleGenerate = async () => {
    store.setWorkspace({
      ...store.currentWorkspace,
      owner: formState.owner
    })

    setResultState((state) => ({
      title: '',
      content: '',
      isLoading: true
    }))

    try {
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
    } catch (err) {
      console.error('🚀 ~ handleGenerate err: ', err)
      setResultState((state) => ({ ...state, isLoading: false }))
    }
  }

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

  const handleReset = ({ includeOwner = true } = {}) => {
    // reset github panel
    if (includeOwner) {
      setFormState({
        owner: '',
        repository: '',
        base: '',
        compare: ''
      })
    } else {
      setFormState(state => ({
        owner: state.owner,
        repository: '',
        base: '',
        compare: ''
      }))
    }
    // reset result panel
    setResultState({
      title: '',
      content: '',
      isLoading: false
    })
    setMatchedResults([])
    setIsParentDisplay(false)
  }

  return (
    <main className="container max-w-[760px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Title
          order={1}
          className="jirassic-gradient">Jirassic</Title>
        <div className="flex items-center gap-2">
          <WorkspaceBadge
            selectable
            setOwner={() => {
              handleReset()
              setFormState(state => ({
                ...state,
                owner: store.currentWorkspace.owner
              }))
            }} />
          <SettingModal
            opened={opened}
            setOpened={setOpened}
            reset={handleReset} />
        </div>
      </div>

      <GitHubPanel
        formState={formState}
        setFormState={setFormState} />

      <div className="flex justify-center my-8">
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconEgg size={16} />}
          onClick={() => handleReset({ includeOwner: false })}>Reset</Button>
        <Space w="sm" />
        <Button
          variant="gradient"
          gradient={{ from: '#ffda33', to: '#ab3e02', deg: 35 }}
          leftSection={<IconEggCracked size={16} />}
          disabled={!isGenerateAvailable}
          onClick={handleGenerate}>Generate</Button>
      </div>

      <ResultPanel
        resultState={resultState}
        isParentDisplay={isParentDisplay}
        setIsParentDisplay={setIsParentDisplay} />

      <RemoveWorkspace />

      {/* loader */}
      <LoadingOverlay
        overlayProps={{
          blur: 2,
        }}
        loaderProps={{
          children: <Loader />,
        }}
        visible={resultState.isLoading} />
    </main>
  )
}

export default App
