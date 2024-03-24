import { Badge } from '@mantine/core';
import { useStore } from '../store';

const WorkspaceSelect = ({ selectable = false }: {
  selectable?: boolean
}) => {
  const currentWorkspace = useStore((state: any) => state.currentWorkspace)
  return (
    <Badge color={currentWorkspace.color || '#dfa153'}>{ currentWorkspace.name }</Badge>
  )
}

export default WorkspaceSelect;
