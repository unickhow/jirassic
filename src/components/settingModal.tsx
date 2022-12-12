import { useState, useEffect } from 'react';
import { Modal, ActionIcon, Divider, PasswordInput, MultiSelect, Space, TextInput, Button } from '@mantine/core';
import { IconSettings, IconKey, IconX, IconUserCircle, IconCheck } from '@tabler/icons';
import MdiJira from '~icons/mdi/jira'
import MdiGithubFace from '~icons/mdi/githubFace'
import MdiConnection from '~icons/mdi/connection'
import OcticonRepo from '~icons/octicon/repo'
import OcticonGitBranch16 from '~icons/octicon/git-branch-16'
import { ISettingState } from '../interface'
import lf from '../ls'

const SettingModal = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const [formState, setFormState] = useState<ISettingState>({
    githubToken: '',
    repositories: [],
    branches: [],
    jiraDomain: '',
    jiraAccount: '',
    jiraToken: ''
  })

  useEffect(() => {
    async function initForm () {
      lf.iterate((value, key) => {
        setFormState(form => ({ ...form, [key]: value }))
      }).catch((err) => {
        console.error(err)
      });
    }
    initForm()
  }, [])

  const handleSave = () => {
    Object.entries(formState).forEach(([key, value]) => {
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
            value={formState.githubToken}
            onChange={(e) => setFormState({ ...formState, githubToken: e.currentTarget.value })}
            description={
              <span>go <a href="/">generate</a></span>
            }
            icon={
              <IconKey size={20} />
            }
          />
          <Space h="sm" />
          <MultiSelect
            label="Repositories"
            value={formState.repositories}
            data={formState.repositories}
            searchable
            creatable
            icon={
              <OcticonRepo />
            }
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              setFormState({ ...formState, repositories: [...formState.repositories, query] })
              return query;
            }}
            onChange={val => setFormState({ ...formState, repositories: val })}
          />
          <Space h="sm" />
          <MultiSelect
            label="Branches"
            value={formState.branches}
            data={formState.branches}
            searchable
            creatable
            icon={
              <OcticonGitBranch16 />
            }
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              setFormState({ ...formState, branches: [...formState.branches, query] })
              return query;
            }}
            onChange={val => setFormState({ ...formState, branches: val })}
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
            value={formState.jiraDomain}
            onChange={(e) => setFormState({ ...formState, jiraDomain: e.currentTarget.value })}
            rightSection={
              formState.jiraDomain
                ? (<ActionIcon radius="xl" onClick={() => setFormState({ ...formState, jiraDomain: '' })}>
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
            value={formState.jiraAccount}
            onChange={(e) => setFormState({ ...formState, jiraAccount: e.currentTarget.value })}
            rightSection={
              formState.jiraAccount
                ? (<ActionIcon radius="xl" onClick={() => setFormState({ ...formState, jiraAccount: '' })}>
                    <IconX size={12} />
                  </ActionIcon>)
                : null
            }
          />
          <Space h="sm" />
          <PasswordInput
            label="Token"
            value={formState.jiraToken}
            onChange={(e) => setFormState({ ...formState, jiraToken: e.currentTarget.value })}
            description={
              <span>go <a href="/">generate</a></span>
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
