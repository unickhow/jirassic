import { useEffect } from 'react';
import { Modal, ActionIcon, Divider, PasswordInput, MultiSelect, Space, TextInput, Button } from '@mantine/core';
import { IconSettings, IconKey, IconX, IconUserCircle, IconCheck } from '@tabler/icons';
import MdiJira from '~icons/mdi/jira'
import MdiGithubFace from '~icons/mdi/githubFace'
import MdiConnection from '~icons/mdi/connection'
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
      <ActionIcon onClick={() => setOpened(true)}><IconSettings size={20} /></ActionIcon>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <h2 className="jirassic-gradient m-0">Setting</h2>
        }
        overlayColor="#fafafa"
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <div className="github-block p-2">
          <Divider my="xs" label={
            <>
              <MdiGithubFace className="text-lg text-[#2e4052] mr-2" />
              <span className="text-lg font-bold">GitHub</span>
            </>
          } />
          <PasswordInput
            label="Token"
            value={settingState.githubToken}
            onChange={(e) => setSettingState({ ...settingState, githubToken: e.currentTarget.value })}
            description={
              <span>go <a className="cursor-pointer" onClick={() => OpenLink('https://github.com/settings/tokens')}>generate</a></span>
            }
            icon={
              <IconKey size={20} />
            }
          />
          <Space h="sm" />
          <MultiSelect
            label="Repositories"
            value={settingState.repositories}
            data={settingState.repositories}
            searchable
            creatable
            icon={
              <OcticonRepo />
            }
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              setSettingState({ ...settingState, repositories: [...settingState.repositories, query] })
              return query;
            }}
            onChange={val => setSettingState({ ...settingState, repositories: val })}
          />
          <Space h="sm" />
          <MultiSelect
            label="Branches"
            value={settingState.branches}
            data={settingState.branches}
            searchable
            creatable
            icon={
              <OcticonGitBranch16 />
            }
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              setSettingState({ ...settingState, branches: [...settingState.branches, query] })
              return query;
            }}
            onChange={val => setSettingState({ ...settingState, branches: val })}
          />
        </div>
        <div className="jira-block p-2">
          <Divider my="xs" label={
            <>
              <MdiJira className="text-lg text-[#0052CC] mr-2" />
              <span className="text-lg font-bold">Jira</span>
            </>
          } />
          <TextInput
            label="Domain"
            icon={
              <MdiConnection />
            }
            value={settingState.jiraDomain}
            onChange={(e) => setSettingState({ ...settingState, jiraDomain: e.currentTarget.value })}
            rightSection={
              settingState.jiraDomain
                ? (<ActionIcon radius="xl" onClick={() => setSettingState({ ...settingState, jiraDomain: '' })}>
                    <IconX size={12} />
                  </ActionIcon>)
                : null
            }
          />
          <Space h="sm" />
          <TextInput
            label="Account"
            icon={
              <IconUserCircle />
            }
            value={settingState.jiraAccount}
            onChange={(e) => setSettingState({ ...settingState, jiraAccount: e.currentTarget.value })}
            rightSection={
              settingState.jiraAccount
                ? (<ActionIcon radius="xl" onClick={() => setSettingState({ ...settingState, jiraAccount: '' })}>
                    <IconX size={12} />
                  </ActionIcon>)
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
            icon={
              <IconKey size={20} />
            }
          />

          <div className="modal-actions mt-8 flex justify-center">
            <Button
              variant="subtle"
              color="gray"
              leftIcon={<IconX size={20} />}
              onClick={() => setOpened(false)}
            >Cancel</Button>
            <Space w="sm" />
            <Button
              color="orange"
              leftIcon={<IconCheck size={20} />}
              onClick={handleSave}
            >Save</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SettingModal
