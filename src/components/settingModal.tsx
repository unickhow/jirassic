import { useEffect } from 'react';
import { Modal, ActionIcon, CloseButton, Divider, PasswordInput, TagsInput, Space, TextInput, Button } from '@mantine/core';
import { IconSettings, IconX, IconUser, IconCheck } from '@tabler/icons';
import MdiJira from '~icons/mdi/jira'
import MdiGithubFace from '~icons/mdi/githubFace'
import MdiSearchWeb from '~icons/mdi/searchWeb'
import MdiShieldKey from '~icons/mdi/shieldKey'
import OcticonRepo from '~icons/octicon/repo'
import OcticonGitBranch16 from '~icons/octicon/git-branch-16'
import { ISettingState } from '../declare/interface'
import lf from '../lf'
import { open as OpenLink } from '@tauri-apps/api/shell'

const SettingModal = ({ opened, setOpened, settingState, setSettingState }: {
  opened: boolean,
  setOpened: (opened: boolean) => void,
  settingState: ISettingState,
  setSettingState: (settingState: ISettingState) => void
}) => {

  useEffect(() => {
    async function initForm () {
      lf.iterate((value, key) => {
        setSettingState({ ...settingState, [key]: value })
      }).catch((err) => {
        console.error(err)
      });
    }
    initForm()
  }, [])

  const handleSave = () => {
    Object.entries(settingState).forEach(([key, value]) => {
      lf.setItem(key, value)
    })
    setOpened(false);
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
          <span className="jirassic-gradient m-0 text-3xl font-bold">Setting</span>
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

          <div className="modal-actions mt-8 flex justify-center">
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconX size={20} />}
              onClick={() => setOpened(false)}
            >Cancel</Button>
            <Space w="sm" />
            <Button
              variant="gradient"
              gradient={{ from: '#ffda33', to: '#ab3e02', deg: 35 }}
              leftSection={<IconCheck size={20} />}
              onClick={handleSave}
            >Save</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SettingModal
