import { Button, Popover, Text, TextInput, ActionIcon } from '@mantine/core'
import MdiArchiveRemoveOutline from '~icons/mdi/archiveRemoveOutline'
import MdiCheckAll from '~icons/mdi/checkAll'
import { useStore } from '../store'
import { useState, useMemo } from 'react'

const RemoveWorkspace = () => {
  const workspaces = useStore((state: any) => state.workspaces || [])
  const currentWorkspace = useStore((state: any) => state.currentWorkspace || {})
  const [inputValue, setInputValue] = useState<string>('')
  const canDelete = useMemo(() => inputValue === currentWorkspace.name, [inputValue, currentWorkspace.name])
  const removeWorkspace = useStore((state: any) => state.removeWorkspace)
  const handleRemoveWorkspace = () => {
    if (!canDelete) return
    removeWorkspace(currentWorkspace)
  }
  return (
    workspaces?.length > 1
      ? <div>
          <Popover
            width={300}
            position="top-end"
            withArrow
            onOpen={() => setInputValue('')}
            arrowOffset={20}
            shadow="md">
            <Popover.Target>
              <ActionIcon
                className="transition-opacity opacity-50 hover:opacity-100"
                variant="transparent"
                size="sm"
                color="red">
                <MdiArchiveRemoveOutline className="text-2xl" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <b>Rename workspace</b>
              <Text size="xs">Enter the workspace name with caution. Deletion is permanent.</Text>
              <div className="flex items-center gap-2 mt-2">
                <TextInput
                  value={inputValue}
                  placeholder={currentWorkspace.name}
                  onChange={(e) => setInputValue(e.currentTarget.value)}
                  size="xs" />
                <Button
                  size="xs"
                  variant="light"
                  disabled={!canDelete}
                  className="flex-shrink-0"
                  leftSection={<MdiCheckAll />}
                  onClick={handleRemoveWorkspace}
                  color="red">
                  Remove
                </Button>
              </div>
            </Popover.Dropdown>
          </Popover>
        </div>
      : null
  )
}

export default RemoveWorkspace
