import { Paper, Input, CopyButton, ActionIcon, Checkbox, Tooltip } from '@mantine/core'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import { IResultState, IFormState } from '../declare/interface'
import { markedPreview } from '../utils/marked'
import MdiFileTree from '~icons/mdi/fileTree'
import MaterialSymbolsOpenInNewRounded from '~icons/material-symbols/open-in-new-rounded'
import CONSTANTS from '../utils/constants'
import { open as OpenLink } from '@tauri-apps/api/shell'
import { useStore } from '../store'

const ResultPanel = ({ formState, resultState, isParentDisplay, setIsParentDisplay }: {
  formState: IFormState,
  resultState: IResultState,
  isParentDisplay: boolean,
  setIsParentDisplay: (isParentDisplay: boolean) => void
}) => {
  const currentWorkspace = useStore((state: any) => state.currentWorkspace)
  return (
    <>
      <Paper shadow="sm" p="md">
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            value={resultState.title}
            readOnly
            rightSectionPointerEvents="all"
            rightSection={
              <CopyButton value={resultState.title} timeout={1000}>
                {({ copied, copy }) => (
                  resultState.title &&
                  <ActionIcon
                    color={copied ? 'orange' : 'gray'}
                    radius="xl"
                    variant="transparent"
                    onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                )}
              </CopyButton>
            }/>
          {
            resultState.title &&
            <Tooltip label="Open in GitHub" color="#FF9946" openDelay={500}>
              <ActionIcon
                variant="light"
                size="lg"
                color="#dfa153"
                onClick={() => OpenLink(`https://github.com/${currentWorkspace.owner}/${formState.repository}/compare/${formState.base}...${formState.compare}`)}>
                <MaterialSymbolsOpenInNewRounded />
              </ActionIcon>
            </Tooltip>
          }
        </div>
        <Checkbox
          label="Show parent issue for sub-task"
          className="mt-2"
          icon={MdiFileTree}
          color={CONSTANTS.COLORS.PRIMARY_DARK}
          checked={isParentDisplay}
          onChange={(e) => setIsParentDisplay(e.currentTarget.checked)} />
        <div className="mt-2 border border-gray-300 rounded text-sm flex p-1 bg-white">
          {
            resultState.content
              ? <div
                  className="mr-auto markdown-preview min-h-[1.875rem]"
                  dangerouslySetInnerHTML={{ __html: markedPreview(resultState.content ?? '') }} />
              : <span className="text-gray-400 p-2 italic">All good! No unmerged pull requests found.</span>
          }
          <CopyButton value={resultState.content} timeout={1000}>
            {({ copied, copy }) => (
              resultState.content &&
              <ActionIcon
                color={copied ? CONSTANTS.COLORS.PRIMARY_DARK : 'gray'}
                radius="xl"
                variant="transparent"
                onClick={copy}>
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            )}
          </CopyButton>
        </div>
      </Paper>
    </>
  )
}

export default ResultPanel
