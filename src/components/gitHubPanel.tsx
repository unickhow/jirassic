import { Paper, Input, ActionIcon, Select } from '@mantine/core'
import { IconBrandGithub, IconGitBranch, IconNotebook } from '@tabler/icons-react'
import { IFormState } from '../declare/interface'
import MdiCallMerge from '~icons/mdi/callMerge'
import { useStore } from '../store'
import CONSTANTS from '../utils/constants'

const GitHubPanel = ({formState, setFormState}: {
  formState: IFormState,
  setFormState: (formState: IFormState) => void
}) => {
  const repositories = useStore((state: any) => state.currentWorkspace?.repositories || []) as string[]
  const branches = useStore((state: any) => state.currentWorkspace?.branches || []) as string[]
  const currentOwner = useStore((state: any) => state.currentWorkspace?.owner || '') as string

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
        <Input.Wrapper label="Owner" className="w-full sm:w-[300px] border-none">
          <Input
            autoFocus
            value={currentOwner}
            readOnly
            leftSection={<IconBrandGithub size={16} />}
          />
        </Input.Wrapper>
        <span className="mx-2 text-xl opacity-30 mb-1 hidden sm:block">/</span>
        <Select
          label="Repository"
          className="w-full"
          value={formState.repository || null}
          onChange={(val) => setFormState({ ...formState, repository: val ?? '' })}
          searchable
          clearable
          leftSection={<IconNotebook size={16} />}
          data={repositories}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-end">
        <Select
          label="Base"
          className="w-full"
          value={formState.base || null}
          onChange={(val) => setFormState({ ...formState, base: val ?? '' })}
          searchable
          clearable
          leftSection={<IconGitBranch size={16} />}
          data={branches.filter((item) => item !== formState.compare)}
        />
        <ActionIcon
          variant="subtle"
          className="mb-1 mx-1"
          color={CONSTANTS.COLORS.PRIMARY_DARK}
          onClick={swapBranch}>
          <MdiCallMerge className="transform sm:-rotate-90" />
        </ActionIcon>
        <Select
          label="Compare"
          className="w-full"
          value={formState.compare || null}
          onChange={(val) => setFormState({ ...formState, compare: val ?? '' })}
          searchable
          clearable
          leftSection={<IconGitBranch size={16} />}
          data={branches.filter((item) => item !== formState.base)}
        />
      </div>
    </Paper>
  )
}

export default GitHubPanel
