import { Paper, Input, CopyButton, ActionIcon, LoadingOverlay, Checkbox } from '@mantine/core'
import { IconCopy, IconCheck } from '@tabler/icons'
import { IResultState } from '../declare/interface'
import { writeText } from '@tauri-apps/api/clipboard'
import { markedPreview } from '../utils/marked'
import { ReactComponent as Loader } from '../assets/loading-dna.svg'

const ResultPanel = ({ resultState, isParentDisplay, setIsParentDisplay }: {
  resultState: IResultState,
  isParentDisplay: boolean,
  setIsParentDisplay: (isParentDisplay: boolean) => void
}) => {
  return (
    <>
      <LoadingOverlay
        loader={<Loader />}
        visible={resultState.isLoading}
        overlayBlur={2} />
      <Paper shadow="sm" p="md">
        <Input
          value={resultState.title}
          readOnly
          rightSection={
            <CopyButton value={""} timeout={2000}>
              {({ copied, copy }) => (
                <ActionIcon
                  color={copied ? 'orange' : 'gray'}
                  radius="xl"
                  variant="transparent"
                  onClick={() => writeText(resultState.title)}>
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
          <CopyButton value={""} timeout={2000}>
            {({ copied, copy }) => (
              <ActionIcon
                color={copied ? 'orange' : 'gray'}
                radius="xl"
                variant="transparent"
                onClick={() => writeText(resultState.content)}>
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
