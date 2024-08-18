import { Modal, ActionIcon, CloseButton, Divider, Input, PasswordInput, TagsInput, Space, TextInput, Button, Popover, ColorPicker } from '@mantine/core'
import { IconSettings, IconX, IconUser, IconCheck, IconCubePlus, IconGitBranch, IconNotebook, IconBrandGithub } from '@tabler/icons-react'
import MdiJira from '~icons/mdi/jira'
import MdiGithubFace from '~icons/mdi/githubFace'
import MdiSearchWeb from '~icons/mdi/searchWeb'
import MdiShieldKey from '~icons/mdi/shieldKey'
import { IWorkspace } from '../declare/interface'
import { open as OpenLink } from '@tauri-apps/api/shell'
import WorkspaceBadge from './workspaceBadge'
import { useStore } from '../store'
import { useState, useEffect } from 'react'
import CONSTANTS from '../utils/constants'
import { randomId } from '../utils/helper'

const SettingModal = ({ opened, setOpened, reset }: {
  opened: boolean,
  setOpened: (opened: boolean) => void,
  reset: () => void
}) => {
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>('')
  const [isNewWorkspaceNaming, setIsNewWorkspaceNaming] = useState<boolean>(false)
  const [workspaceColor, setWorkspaceColor] = useState('#ff7800')
  const colors = CONSTANTS.COLORS.WORKSPACE_COLORS

  const currentWorkspace = useStore((state: any) => state.currentWorkspace || {})
  const setWorkspace = useStore((state: any) => state.setWorkspace)

  const [settingState, setSettingState] = useState<IWorkspace>({ ...currentWorkspace })

  useEffect(() => {
    setSettingState({ ...currentWorkspace })
  }, [opened])

  const handleWorkspaceCreate = () => {
    const name = newWorkspaceName.trim()
    if (!name) return
    setWorkspace({
      ...settingState,
      name,
      color: workspaceColor,
      id: randomId()
    })
    setIsNewWorkspaceNaming(false)
    reset()
    setOpened(false)
  }

  const handleSave = async () => {
    setWorkspace(settingState)
    setOpened(false)
  }

  return  (
    <>
      <ActionIcon
        id="btn_setting_modal"
        variant="subtle"
        color="gray"
        onClick={() => setOpened(true)}>
        <IconSettings size={20} />
      </ActionIcon>

      <Modal
        id="setting_modal"
        className="relative"
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
        <div id="github_block" className="p-2">
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
          <Input.Wrapper label="Owner" className="w-full">
            <Input
              id="github_owner"
              autoFocus
              value={settingState.owner}
              onChange={(e) => setSettingState({ ...settingState, owner: e.currentTarget.value })}
              leftSection={<IconBrandGithub size={16} />}
              rightSectionPointerEvents="all"
              rightSection={
                settingState.owner
                  ? (<CloseButton
                      variant="transparent"
                      size="sm"
                      tabIndex={-1}
                      onClick={() => setSettingState({ ...settingState, owner: '' })} />)
                  : null
              }
            />
          </Input.Wrapper>
          <Space h="sm" />
          <PasswordInput
            id="github_token"
            label="Token"
            value={settingState.githubToken}
            onChange={(e) => setSettingState({ ...settingState, githubToken: e.currentTarget.value })}
            description={
              <a className="cursor-pointer" onClick={() => OpenLink('https://github.com/settings/tokens')}>generate</a>
            }
            leftSection={
              <MdiShieldKey />
            }
          />
          <Space h="sm" />
          <TagsInput
            id="github_repositories"
            label="Repositories"
            value={settingState.repositories}
            onChange={val => setSettingState({ ...settingState, repositories: val })}
            placeholder="Add repository"
            leftSection={
              <IconNotebook size={20} />
            }
          />
          <Space h="sm" />
          <TagsInput
            id="github_branches"
            label="Branches"
            value={settingState.branches}
            onChange={val => setSettingState({ ...settingState, branches: val })}
            placeholder="Add branch"
            leftSection={
              <IconGitBranch size={20} />
            }
          />
        </div>
        <div id="jira_block" className="p-2 mb-20">
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
            id="jira_domain"
            label="Domain"
            leftSection={
              <MdiSearchWeb />
            }
            placeholder="https://your-domain.atlassian.net"
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
            id="jira_account"
            label="Account"
            leftSection={
              <IconUser size={20} />
            }
            placeholder="user@mail.com"
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
            id="jira_token"
            label="Token"
            value={settingState.jiraToken}
            onChange={(e) => setSettingState({ ...settingState, jiraToken: e.currentTarget.value })}
            description={
              <a className="cursor-pointer" onClick={() => OpenLink('https://id.atlassian.com/manage-profile/security/api-tokens')}>generate</a>
            }
            leftSection={
              <MdiShieldKey />
            }
          />
        </div>
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
            shadow="md"
            classNames={{
              dropdown: 'max-w-[300px]'
            }}
            opened={isNewWorkspaceNaming}
            onOpen={() => {
              setNewWorkspaceName('')
              setIsNewWorkspaceNaming(true)
            }}
            onClose={() => setIsNewWorkspaceNaming(false)} >
            <Popover.Target>
              <Button
                className="btn-save-as"
                variant="subtle"
                size="xs"
                color="#FF9946"
                leftSection={<IconCubePlus size={20} />}
                onClick={() => setIsNewWorkspaceNaming(true)}>
                Save as
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <div>
                <ColorPicker
                  format="hex"
                  swatches={colors}
                  withPicker={false}
                  fullWidth
                  className="mb-4"
                  value={workspaceColor}
                  onChange={setWorkspaceColor} />
                <div className="flex items-center gap-2">
                  <TextInput
                    placeholder="New workspace name"
                    value={newWorkspaceName.trim()}
                    size="xs"
                    leftSection={
                      <div className="w-4 h-4 rounded" style={{ background: workspaceColor }} />
                    }
                    onChange={(e) => setNewWorkspaceName(e.currentTarget.value)} />
                  <Button
                    variant="filled"
                    color="#FF9946"
                    size="xs"
                    className="flex-shrink-0"
                    disabled={!newWorkspaceName.trim()}
                    leftSection={<IconCheck size={20} />}
                    onClick={handleWorkspaceCreate}>
                    Save
                  </Button>
                </div>
              </div>
            </Popover.Dropdown>
          </Popover>
          <Space w="sm" />
          <Button
            variant="filled"
            color="#FF9946"
            size="xs"
            disabled={isNewWorkspaceNaming}
            leftSection={<IconCheck size={20} />}
            onClick={handleSave}>
            Save
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default SettingModal
