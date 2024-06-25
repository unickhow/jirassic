import { Popover } from '@mantine/core'
import { useStore } from '../store'
import { useState } from 'react'
import { useClickOutside } from '@mantine/hooks'

const WorkspaceBadge = ({ selectable = false }: {
  selectable?: boolean
}) => {
  const currentWorkspace = useStore((state: any) => state.currentWorkspace || {})
  const workspaces = useStore((state: any) => state.workspaces || [])

  const [isOpened, setIsOpened] = useState<boolean>(false)
  const ref = useClickOutside(() => setIsOpened(false))

  const setCurrentWorkspace =  useStore((state: any) => state.setCurrentWorkspace)
  return (
    <Popover
      width={200}
      disabled={!selectable || workspaces.length === 1}
      position="bottom-end"
      opened={isOpened}
      shadow="md"
      classNames={{
        dropdown: 'p-2'
      }}
      withArrow
      arrowOffset={20}>
      <Popover.Target>
        <div
          className="workspace-badge cursor-pointer"
          style={{ backgroundColor: currentWorkspace.color || '#dfa153' }}
          onClick={() => setIsOpened(!isOpened)}>
          { currentWorkspace.name }
        </div>
      </Popover.Target>
      <Popover.Dropdown ref={ref}>
        <ul className="p-0 m-0 list-none">
          {workspaces
            .filter((workspace: any) => workspace.name !== currentWorkspace.name)
            .map((workspace: any) => (
            <li
              className="flex items-center gap-2 rounded-sm overflow-hidden hover:bg-gray-100 py-1 px-2 cursor-pointer"
              key={workspace.name}
              onClick={() => {
                setCurrentWorkspace(workspace)
                setIsOpened(false)
              }}>
              <div
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: workspace.color }} />
              <span className="text-sm">{workspace.name}</span>
            </li>
          ))}
        </ul>
      </Popover.Dropdown>
    </Popover>
  )
}

export default WorkspaceBadge
