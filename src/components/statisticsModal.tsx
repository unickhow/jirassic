import { ActionIcon, Modal, Badge, LoadingOverlay, Tooltip } from '@mantine/core'
import MdiHumanMaleBoardPoll from '~icons/mdi/humanMaleBoardPoll'
import { useStore } from '../store'
import { ReactComponent as Loader } from '../assets/loading-dna.svg'
import fetch from '../utils/request'
import MaterialSymbolsOpenInNewRounded from '~icons/material-symbols/open-in-new-rounded'
import { open as OpenLink } from '@tauri-apps/api/shell'
import { useState } from 'react'
import { IconReload } from '@tabler/icons-react'
import type { IUnmergedPullRequest, IGitHubPullRequest } from '../declare/interface'
import { showNotification } from '@mantine/notifications'

const StatisticsModal = ({ opened, setOpened }: {
  opened: boolean,
  setOpened: (opened: boolean) => void
}) => {
  const setStatistics = useStore((state: any) => state.setStatistics)
  const currentStatistics = useStore((state: any) => state.getCurrentWorkspaceStatistics())
  const currentWorkspace = useStore((state: any) => state.currentWorkspace)
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const canFetchStatistics = currentWorkspace.owner && currentWorkspace.githubToken && currentWorkspace.repositories.length > 0

  const fetchUnMergedPullRequests = async (repo: string) => {
    return fetch(`https://api.github.com/repos/${currentWorkspace.owner}/${repo}/pulls?state=open`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${currentWorkspace.githubToken}` }
    }).then((res: any) => {
      if (!res.ok) {
        return Promise.reject(new Error(res.data?.message || 'GitHub compare failed'))
      }
      return Promise.resolve(res.data)
    }).catch(err => {
      return Promise.reject(err)
    })
  }

  async function fetchStatistics() {
    setIsFetching(true)
    try {
      const allPullRequests = {} as any
      const promises = currentWorkspace.repositories.map(async (repo: string) => {
        const unMergedPullRequests = await fetchUnMergedPullRequests(repo)
        allPullRequests[repo] = unMergedPullRequests.map((pr: IGitHubPullRequest) => ({
          title: pr.title,
          url: pr.html_url,
          isDraft: pr.draft,
          base: pr.base,
          head: pr.head,
          author: pr.user.login
        }))
      })

      await Promise.all(promises)
      const timestamp = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
      setStatistics({
        lastFetchTime: timestamp,
        repos: allPullRequests
      })
    } catch (err: any) {
      showNotification({
        title: 'GitHub fetch error',
        message: err.message,
        color: 'red',
        autoClose: 5000
      })
    } finally {
      setIsFetching(false)
    }
  }

  // trim text if longer than 16 characters, keep first 8 and last 8, and add '...'
  function trimText (text: string) {
    if (text.length > 16) {
      return text.slice(0, 10) + '...' + text.slice(-10)
    }
    return text
  }

  return (
    <>
      <Tooltip label="GitHub setting is incomplete." disabled={canFetchStatistics}>
        <ActionIcon
          id="btn_statistics_modal"
          variant="transparent"
          color="gray"
          onClick={() => setOpened(true)}>
          <MdiHumanMaleBoardPoll className="text-lg" />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <div className="flex items-center gap-2">
            <span className="jirassic-gradient m-0 text-2xl font-bold">Unmerged Pull Requests</span>
          </div>
        }
        overlayProps={{
          blur: 4
        }}>
          <LoadingOverlay
            overlayProps={{
              blur: 2,
            }}
            loaderProps={{
              children: <Loader />,
            }}
            visible={isFetching} />

          <div className="text-xs flex items-center gap-4">
            <p>Last updated: {currentStatistics?.lastFetchTime || '---'}</p>
            <ActionIcon
              id="btn_refresh_statistics"
              variant="transparent"
              color="gray"
              size="xs"
              disabled={!canFetchStatistics}
              onClick={() => fetchStatistics()}>
              <IconReload size={20} />
            </ActionIcon>
          </div>
        {
          Object.entries(currentStatistics?.repos || []).length === 0
            ? <p className="text-center text-sm text-gray-500 mt-4">
                { canFetchStatistics ? 'No unmerged pull requests' : 'GitHub setting is incomplete.' }
              </p>
            : Object.entries(currentStatistics?.repos || []).map(([repo, prs]: [string, any]) => (
              <div key={repo} className="p-2">
                <h3 className="flex items-center gap-2 mb-2">
                  <span>{repo}</span>
                  <ActionIcon
                    variant="light"
                    size="xs"
                    color="#dfa153"
                    onClick={() => OpenLink(`https://github.com/${currentWorkspace.owner}/${repo}/pulls`)}>
                    <MaterialSymbolsOpenInNewRounded />
                  </ActionIcon>

                  <Badge
                    variant="filled"
                    color="#ab3e02"
                    className="ml-auto px-2">
                    {prs?.length}
                  </Badge>
                </h3>
                <div className="">
                  <div className="flex items-center gap-2">
                    <ul className="pl-4 ml-0 flex flex-col gap-4 w-full">
                      {
                        prs.map((pr: IUnmergedPullRequest) => (
                          <li key={pr.url} className="flex flex-col gap-2">
                            <div className="text-xs flex items-start justify-between gap-8">
                              <a
                                className="cursor-pointer underline text-gray-500 hover:text-[#ab3e02]"
                                onClick={() => OpenLink(pr.url)}>
                                {pr.title}
                              </a>
                              <span className="text-gray-500">{pr.author}</span>
                            </div>
                            <div className="text-xs text-gray-500 flex flex-wrap items-center">
                              <span>{trimText(pr.base.ref)} ← {trimText(pr.head.ref)}</span>
                              {
                                pr.isDraft && (
                                  <Badge
                                    variant="filled"
                                    color="#a0a0a0"
                                    size="xs"
                                    className="ml-2">
                                    Draft
                                  </Badge>
                                )
                              }
                            </div>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
            ))
        }
      </Modal>
    </>
  )
}

export default StatisticsModal
