import { Paper, Input, ActionIcon, Select } from '@mantine/core';
import { IconBrandGithub, IconX, IconGitBranch, IconArrowLeftCircle } from '@tabler/icons';
import { ISettingState, IFormState } from '../interface'

const GitHubPanel = ({settingState, formState, setFormState}: {
  settingState: ISettingState,
  formState: IFormState,
  setFormState: (formState: IFormState) => void
}) => {

  return (
    <Paper shadow="sm" p="md">
      <div className="flex-wrap sm:flex-nowrap flex items-end mb-2">
        <Input.Wrapper label="Owner" className="w-full sm:w-[300px]">
          <Input
            autoFocus
            value={formState.owner}
            onChange={(evt) => setFormState((form: IFormState) => ({ ...form, owner: evt.target.value }))}
            icon={<IconBrandGithub size={16} />}
            placeholder="Owner"
            rightSection={
              formState.owner
                ? (<ActionIcon radius="xl" onClick={() => setFormState((form: IFormState) => ({ ...form, owner: '' }))}>
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
          onChange={(val) => setFormState((form: IFormState) => ({ ...form, repository: val ?? '' }))}
          searchable
          clearable
          icon={<IconGitBranch size={16} />}
          data={settingState.repositories}
        />
      </div>

      <div className="flex-wrap sm:flex-nowrap flex items-end">
        <Select
          label="base"
          className="w-full"
          value={formState.base}
          onChange={(val) => setFormState((form: IFormState) => ({ ...form, base: val ?? '' }))}
          searchable
          clearable
          icon={<IconGitBranch size={16} />}
          data={settingState.branches}
        />
        <ActionIcon variant="transparent" className="mb-1">
          <IconArrowLeftCircle size={16} />
        </ActionIcon>
        <Select
          label="compare"
          className="w-full"
          value={formState.compare}
          onChange={(val) => setFormState((form: IFormState) => ({ ...form, compare: val ?? '' }))}
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
