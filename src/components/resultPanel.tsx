import { Paper, Input, CopyButton, ActionIcon, Textarea, Space } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons';

const ResultPanel = () => {
  const mockContent = `- [OWLPAY-13845] Add new feature
- [OWLPAY-13846] Add new feature
- [OWLPAY-13847] Add new feature`

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
        [OWLPAY-13845] Add new feature
      </Input>
      <Space h="sm" />
      <Textarea
        autosize
        minRows={5}
        value={mockContent}
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
