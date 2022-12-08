import { Paper, Input, ActionIcon, Select } from '@mantine/core';
import { IconBrandGithub, IconX, IconGitBranch, IconArrowLeftCircle } from '@tabler/icons';
import { useState } from 'react'

const GitHubPanel = () => {
  const [owner, setOwner] = useState('')
  function handleOwnerClear() {
    setOwner('')
  }

  const [repository, setRepository] = useState('')
  function handleRepositoryClear() {
    setRepository('')
  }

  const [base, setBase] = useState('')
  const [compare, setCompare] = useState('')

  return (
    <Paper shadow="sm" p="md">
      <div className="flex-wrap sm:flex-nowrap flex items-end mb-2">
        <Input.Wrapper label="Owner" className="w-full sm:w-[300px]">
          <Input
            autoFocus
            value={owner}
            onChange={(e) => setOwner(e.currentTarget.value)}
            icon={<IconBrandGithub size={16} />}
            placeholder="Owner"
            rightSection={
              owner
                ? (<ActionIcon radius="xl" onClick={handleOwnerClear}>
                    <IconX size={12} />
                  </ActionIcon>)
                : null
            }
          />
        </Input.Wrapper>
        <span className="mx-2 text-xl opacity-30 hidden sm:block">/</span>
        <Input.Wrapper label="Repository" className="w-full">
          <Input
            value={repository}
            onChange={(e) => setRepository(e.target.value)}
            placeholder="Repository"
            rightSection={
              repository
                ? (<ActionIcon radius="xl" onClick={handleRepositoryClear}>
                    <IconX size={12} />
                  </ActionIcon>)
                : null
            }
          />
        </Input.Wrapper>
      </div>

      <div className="flex-wrap sm:flex-nowrap flex items-end">
        <Select
          label="base"
          className="w-full"
          value={base}
          onChange={(val) => setBase(val ?? '')}
          searchable
          clearable
          icon={<IconGitBranch size={16} />}
          data={[
            { value: 'stage', label: 'stage' },
            { value: 'release', label: 'release' },
            { value: 'main', label: 'main' }
          ]}
        />
        <ActionIcon variant="transparent" className="mb-1">
          <IconArrowLeftCircle size={16} />
        </ActionIcon>
        <Select
          label="compare"
          className="w-full"
          value={compare}
          onChange={(val) => setCompare(val ?? '')}
          searchable
          clearable
          icon={<IconGitBranch size={16} />}
          data={[
            { value: 'stage', label: 'stage' },
            { value: 'release', label: 'release' },
            { value: 'main', label: 'main' }
          ]}
        />
      </div>
    </Paper>
  )
}

export default GitHubPanel
