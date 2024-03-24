import { Modal, ActionIcon, CloseButton, Divider, PasswordInput, TagsInput, Space, TextInput, Button, Popover, Group, ColorPicker } from '@mantine/core'
import { IconSettings, IconX, IconUser, IconCheck, IconCubePlus } from '@tabler/icons-react'
import MdiJira from '~icons/mdi/jira'
import MdiGithubFace from '~icons/mdi/githubFace'
import MdiSearchWeb from '~icons/mdi/searchWeb'
import MdiShieldKey from '~icons/mdi/shieldKey'
import OcticonRepo from '~icons/octicon/repo'
import OcticonGitBranch16 from '~icons/octicon/git-branch-16'
import { IWorkspace } from '../declare/interface'
import { open as OpenLink } from '@tauri-apps/api/shell'
import WorkspaceBadge from './workspaceBadge'
import { useStore } from '../store'
import { useState, useEffect } from 'react'

const SettingModal = ({ opened, setOpened, reset }: {
  opened: boolean,
  setOpened: (opened: boolean) => void,
  reset: () => void
}) => {
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>('')
  const [isNewWorkspaceNaming, setIsNewWorkspaceNaming] = useState<boolean>(false)
  const [workspaceColor, setWorkspaceColor] = useState('#ff7800')
  const colors = ['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#ff7800']

  const store = useStore() as any

  // deep clone setting state from store
  const [settingState, setSettingState] = useState<IWorkspace>({ ...store.currentWorkspace })

  useEffect(() => {
    setSettingState({ ...store.currentWorkspace })
  }, [opened])

  const handleWorkspaceCreate = () => {
    if (!newWorkspaceName) return
    store.setWorkspace({
      ...settingState,
      name: newWorkspaceName,
      color: workspaceColor
    })
    setIsNewWorkspaceNaming(false)
    reset()
    setOpened(false)
  }

  const handleSave = async () => {
    store.setWorkspace(settingState)
    setOpened(false)
  }

  return  (
    <>
      <ActionIcon
        variant="transparent"
        color="gray"
        onClick={() => setOpened(true)}>
        <IconSettings size={20} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <div className="flex items-center gap-2">
            <span className="jirassic-gradient m-0 text-3xl font-bold">Setting</span>
            <WorkspaceBadge />
          </div>
        }
        overlayProps={{
          blur: 4
        }}
      >
        <div className="github-block p-2">
          <Divider
            my="xs"
            labelPosition="left"
            label={
              <>
                <MdiGithubFace className="text-lg text-[#2e4052] mr-2" />
                <span className="text-lg font-bold">GitHub</span>
              </>
            }
          />
          <PasswordInput
            label="Token"
            value={settingState.githubToken}
            onChange={(e) => setSettingState({ ...settingState, githubToken: e.currentTarget.value })}
            description={
              <span>go <a className="cursor-pointer" onClick={() => OpenLink('https://github.com/settings/tokens')}>generate</a></span>
            }
            leftSection={
              <MdiShieldKey />
            }
          />
          <Space h="sm" />
          <TagsInput
            label="Repositories"
            value={settingState.repositories}
            onChange={val => setSettingState({ ...settingState, repositories: val })}
            placeholder="Add repository"
            rightSection={
              <OcticonRepo />
            }
          />
          <Space h="sm" />
          <TagsInput
            label="Branches"
            value={settingState.branches}
            onChange={val => setSettingState({ ...settingState, branches: val })}
            placeholder="Add branch"
            rightSection={
              <OcticonGitBranch16 />
            }
          />
        </div>
        <div className="jira-block p-2">
          <Divider
            my="xs"
            labelPosition="left"
            label={
              <>
                <MdiJira className="text-lg text-[#0052CC] mr-2" />
                <span className="text-lg font-bold">Jira</span>
              </>
            }
          />
          <TextInput
            label="Domain"
            leftSection={
              <MdiSearchWeb />
            }
            value={settingState.jiraDomain}
            onChange={(e) => setSettingState({ ...settingState, jiraDomain: e.currentTarget.value })}
            rightSection={
              settingState.jiraDomain
                ? (<CloseButton
                    variant="transparent"
                    size="sm"
                    tabIndex={-1}
                    onClick={() => setSettingState({ ...settingState, jiraDomain: '' })} />)
                : null
            }
          />
          <Space h="sm" />
          <TextInput
            label="Account"
            leftSection={
              <IconUser size={20} />
            }
            value={settingState.jiraAccount}
            onChange={(e) => setSettingState({ ...settingState, jiraAccount: e.currentTarget.value })}
            rightSection={
              settingState.jiraAccount
                ? (<CloseButton
                    variant="transparent"
                    size="sm"
                    tabIndex={-1}
                    onClick={() => setSettingState({ ...settingState, jiraAccount: '' })} />)
                : null
            }
          />
          <Space h="sm" />
          <PasswordInput
            label="Token"
            value={settingState.jiraToken}
            onChange={(e) => setSettingState({ ...settingState, jiraToken: e.currentTarget.value })}
            description={
              <span>go <a className="cursor-pointer" onClick={() => OpenLink('https://id.atlassian.com/manage-profile/security/api-tokens')}>generate</a></span>
            }
            leftSection={
              <MdiShieldKey />
            }
          />

          <div className="modal-actions mt-8 flex justify-between">
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              leftSection={<IconX size={20} />}
              onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Space w="sm" />
            <Popover
              position="bottom"
              withArrow
              shadow="md"
              opened={isNewWorkspaceNaming}
              onOpen={() => {
                setNewWorkspaceName('')
                setIsNewWorkspaceNaming(true)
              }}
              onClose={() => setIsNewWorkspaceNaming(false)} >
              <Popover.Target>
                <Button
                  variant="subtle"
                  size="xs"
                  color="#dfa153"
                  leftSection={<IconCubePlus size={20} />}
                  onClick={() => setIsNewWorkspaceNaming(true)}>
                  Save as
                </Button>
              </Popover.Target>
              <Popover.Dropdown bg="var(--mantine-color-body)">
                <div>
                  <ColorPicker
                    format="hex"
                    swatches={colors}
                    withPicker={false}
                    fullWidth
                    className="mb-4"
                    value={workspaceColor}
                    onChange={setWorkspaceColor} />
                  <Group>
                    <TextInput
                      placeholder="New workspace name"
                      value={newWorkspaceName}
                      leftSection={
                        <div className="w-4 h-4 rounded" style={{ background: workspaceColor }} />
                      }
                      onChange={(e) => setNewWorkspaceName(e.currentTarget.value)} />
                    <Button
                      variant="gradient"
                      size="xs"
                      disabled={!newWorkspaceName}
                      gradient={{ from: '#ffda33', to: '#ab3e02', deg: 35 }}
                      leftSection={<IconCheck size={20} />}
                      onClick={handleWorkspaceCreate}>
                      Save
                    </Button>
                  </Group>
                </div>
              </Popover.Dropdown>
            </Popover>
            <Space w="sm" />
            <Button
              variant="gradient"
              size="xs"
              disabled={isNewWorkspaceNaming}
              gradient={{ from: '#ffda33', to: '#ab3e02', deg: 35 }}
              leftSection={<IconCheck size={20} />}
              onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SettingModal
