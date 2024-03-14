import { Paper, Input, CopyButton, ActionIcon, Checkbox } from '@mantine/core'
import { IconCopy, IconCheck } from '@tabler/icons'
import { IResultState } from '../declare/interface'
import { writeText } from '@tauri-apps/api/clipboard'
import { markedPreview } from '../utils/marked'

const ResultPanel = ({ resultState, isParentDisplay, setIsParentDisplay }: {
  resultState: IResultState,
  isParentDisplay: boolean,
  setIsParentDisplay: (isParentDisplay: boolean) => void
}) => {
  return (
    <>
      <Paper shadow="sm" p="md">
        <Input
          value={resultState.title}
          readOnly
          rightSectionPointerEvents="all"
          rightSection={
            <CopyButton value={resultState.title} timeout={1000}>
              {({ copied, copy }) => (
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
        <Checkbox
          label="Show parent issue for sub-task"
          className="mt-2"
          checked={isParentDisplay}
          onChange={(e) => setIsParentDisplay(e.currentTarget.checked)} />
        <div className="mt-2 border border-gray-300 rounded text-sm flex p-1">
          <div
            className="mr-auto markdown-preview"
            dangerouslySetInnerHTML={{ __html: markedPreview(resultState.content) }} />
          <CopyButton value={resultState.content} timeout={1000}>
            {({ copied, copy }) => (
              <ActionIcon
                color={copied ? 'orange' : 'gray'}
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
  );
};

export default ResultPanel;
