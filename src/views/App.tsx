import { Title, ActionIcon, Button, Space } from '@mantine/core';
import { IconSettings, IconEggCracked, IconEgg } from '@tabler/icons';
import GitHubPanel from '../components/gitHubPanel';
import ResultPanel from '../components/resultPanel';
import SettingModal from '../components/settingModal';

function App() {
  return (
    <main className="container max-w-[760px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Title
          order={1}
          className="jirassic-gradient">Jirassic</Title>
        <SettingModal />
      </div>

      <GitHubPanel />

      <div className="flex justify-center my-8">
        <Button
          variant="gradient" gradient={{ from: '#ffda33', to: '#ab3e02', deg: 35 }}
          leftIcon={<IconEggCracked size={16} />}>Generate</Button>
        <Space w="sm" />
        <Button
          variant="subtle"
          color="gray"
          leftIcon={<IconEgg size={16} />}>Reset</Button>
      </div>

      <ResultPanel />
    </main>
  );
}

export default App;
