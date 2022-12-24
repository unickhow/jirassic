import { Paper, Input, ActionIcon, Select } from '@mantine/core';
import { IconBrandGithub, IconX, IconGitBranch, IconArrowLeftCircle } from '@tabler/icons';
import { ISettingState, IFormState } from '../declare/interface'
import lf from '../lf'
import { useEffect } from 'react';

const GitHubPanel = ({settingState, formState, setFormState}: {
  settingState: ISettingState,
  formState: IFormState,
  setFormState: (formState: IFormState) => void
}) => {
  useEffect(() => {
    lf.getItem('owner').then((value) => {
      if (value && typeof value === 'string') {
        setFormState({ ...formState, owner: value })
      }
    }).catch((err) => {
      console.error(err)
    })
  }, [])

  const swapBranch = () => {
    setFormState({
      ...formState,
      base: formState.compare,
      compare: formState.base
    })
  }

  return (
    <Paper shadow="sm" p="md">
      <div className="flex-wrap sm:flex-nowrap flex items-end mb-2">
        <Input.Wrapper label="Owner" className="w-full sm:w-[300px]">
          <Input
            autoFocus
            value={formState.owner}
            onChange={(evt) => setFormState({ ...formState, owner: evt.target.value })}
            onBlur={() => lf.setItem('owner', formState.owner)}
            icon={<IconBrandGithub size={16} />}
            placeholder="Owner"
            rightSection={
              formState.owner
                ? (<ActionIcon
                    radius="xl"
                    tabIndex={-1}
                    onClick={() => setFormState({ ...formState, owner: '' })}>
                    <IconX size={12} />
                  </ActionIcon>)
                : null
            }
          />
        </Input.Wrapper>
        <span className="mx-2 text-xl opacity-30 mb-1 hidden sm:block">/</span>
        <Select
          label="Repository"
          className="w-full"
          value={formState.repository}
          onChange={(val) => setFormState({ ...formState, repository: val ?? '' })}
          searchable
          clearable
          icon={<IconGitBranch size={16} />}
          data={settingState.repositories}
        />
      </div>

      <div className="flex-wrap sm:flex-nowrap flex items-end">
        <Select
          label="Base"
          className="w-full"
          value={formState.base}
          onChange={(val) => setFormState({ ...formState, base: val ?? '' })}
          searchable
          clearable
          icon={<IconGitBranch size={16} />}
          data={settingState.branches}
        />
        <ActionIcon
          variant="transparent"
          className="mb-1"
          onClick={swapBranch}>
          <IconArrowLeftCircle size={16} />
        </ActionIcon>
        <Select
          label="Compare"
          className="w-full"
          value={formState.compare}
          onChange={(val) => setFormState({ ...formState, compare: val ?? '' })}
          searchable
          clearable
          icon={<IconGitBranch size={16} />}
          data={settingState.branches}
        />
      </div>
    </Paper>
  )
}

export default GitHubPanel
