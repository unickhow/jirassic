import { Title, ActionIcon } from '@mantine/core';
import { IconSettings } from '@tabler/icons';
import GitHubPanel from '../components/gitHubPanel';

function App() {
  return (
    <main className="container max-w-[760px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Title
          order={1}
          className="jirassic-gradient">Jirassic</Title>
        <ActionIcon color="#0052CC" className="ml-2"><IconSettings size={20} /></ActionIcon>
      </div>

      <GitHubPanel />
    </main>
  );
}

export default App;
