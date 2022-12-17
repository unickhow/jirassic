import { Paper, Input, CopyButton, ActionIcon, Textarea, Space } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons';
import { IResultState } from '../declare/interface'

const ResultPanel = ({ resultState }: {
  resultState: IResultState
}) => {
  return (
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
                onClick={copy}>
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            )}
          </CopyButton>
        }>
        {resultState.title}
      </Input>
      <Space h="sm" />
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
                onClick={copy}>
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            )}
          </CopyButton>
        } />
    </Paper>
  );
};

export default ResultPanel;
