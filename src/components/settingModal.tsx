import { useState } from 'react';
import { Modal, ActionIcon, Divider, PasswordInput, MultiSelect, Space, TextInput, Button } from '@mantine/core';
import { IconSettings, IconKey, IconX, IconUserCircle, IconCheck } from '@tabler/icons';
import MdiJira from '~icons/mdi/jira'
import MdiGithubFace from '~icons/mdi/githubFace'
import MdiConnection from '~icons/mdi/connection'
import OcticonRepo from '~icons/octicon/repo'
import OcticonGitBranch16 from '~icons/octicon/git-branch-16'

const SettingModal = () => {
  const [opened, setOpened] = useState(false);
  const [githubToken, setGithubToken] = useState('');

  const [repos, setRepos] = useState([
    { value: 'react', label: 'React' },
    { value: 'ng', label: 'Angular' },
  ]);

  const [branches, setBranches] = useState([
    { value: 'master', label: 'master' },
    { value: 'release', label: 'release' },
    { value: 'dev', label: 'dev' },
  ]);

  const [jiraDomain, setJiraDomain] = useState('');
  const [jiraAccount, setJiraAccount] = useState('');
  const [jiraToken, setJiraToken] = useState('');

  const handleSave = () => {
    console.log('🚀 ~ file: settingModal.tsx:30 ~ handleSave ~ handleSave')
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
            value={githubToken}
            onChange={(e) => setGithubToken(e.currentTarget.value)}
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
            data={repos}
            searchable
            creatable
            icon={
              <OcticonRepo />
            }
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setRepos((current) => [...current, item]);
              return item;
            }}
          />
          <Space h="sm" />
          <MultiSelect
            label="Branches"
            data={branches}
            searchable
            creatable
            icon={
              <OcticonGitBranch16 />
            }
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setBranches((current) => [...current, item]);
              return item;
            }}
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
            value={jiraDomain}
            onChange={(e) => setJiraDomain(e.currentTarget.value)}
            rightSection={
              jiraDomain
                ? (<ActionIcon radius="xl" onClick={() => setJiraDomain('')}>
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
            value={jiraAccount}
            onChange={(e) => setJiraAccount(e.currentTarget.value)}
            rightSection={
              jiraAccount
                ? (<ActionIcon radius="xl" onClick={() => setJiraAccount('')}>
                    <IconX size={12} />
                  </ActionIcon>)
                : null
            }
          />
          <Space h="sm" />
          <PasswordInput
            label="Token"
            value={jiraToken}
            onChange={(e) => setJiraToken(e.currentTarget.value)}
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
