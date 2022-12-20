import { Paper, Input, CopyButton, ActionIcon, Textarea, LoadingOverlay, Checkbox } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons';
import { IResultState } from '../declare/interface';
import { writeText } from '@tauri-apps/api/clipboard';

const ResultPanel = ({ resultState, isParentDisplay, setIsParentDisplay }: {
  resultState: IResultState,
  isParentDisplay: boolean,
  setIsParentDisplay: (isParentDisplay: boolean) => void
}) => {
  return (
    <>
      <LoadingOverlay visible={resultState.isLoading} overlayBlur={2} />

      <Paper shadow="sm" p="md">
        <Input
          component="span"
          rightSection={
            <CopyButton value="https://mantine.dev" timeout={2000}>
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
          }>
          {resultState.title}
        </Input>
        <Checkbox
          label="Show parent issue for sub-task"
          className="mt-2"
          checked={isParentDisplay}
          onChange={(e) => setIsParentDisplay(e.currentTarget.checked)} />
        <Textarea
          autosize
          minRows={5}
          value={resultState.content}
          rightSection={
            <CopyButton value="https://mantine.dev" timeout={2000}>
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
          } />
      </Paper>
    </>
  );
};

export default ResultPanel;
