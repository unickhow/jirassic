import { Title, Button, Space } from '@mantine/core';
import { IconEggCracked, IconEgg } from '@tabler/icons';
import GitHubPanel from '../components/gitHubPanel';
import ResultPanel from '../components/resultPanel';
import SettingModal from '../components/settingModal';
import { useState, useEffect } from 'react';
import { ISettingState, IFormState } from '../interface'
import lf from '../lf';

function App() {
  // setting modal data
  const [opened, setOpened] = useState<boolean>(false);
  const [settingState, setSettingState] = useState<ISettingState>({
    githubToken: '',
    repositories: [],
    branches: [],
    jiraDomain: '',
    jiraAccount: '',
    jiraToken: ''
  })

  useEffect(() => {
    async function initForm () {
      lf.iterate((value, key) => {
        setSettingState((form: ISettingState) => ({ ...form, [key]: value }))
      }).catch((err) => {
        console.error(err)
      });
    }
    initForm()
  }, [opened])
  //

  // github panel data
  const [formState, setFormState] = useState<IFormState>({
    owner: '',
    repository: '',
    base: '',
    compare: ''
  })

  const handleGenerate = () => {
    console.log('🚀 ~ file: App.tsx:44 ~ handleGenerate ~ formState', formState)
  }
  //

  return (
    <main className="container max-w-[760px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Title
          order={1}
          className="jirassic-gradient">Jirassic</Title>
        <SettingModal
          opened={opened}
          setOpened={setOpened}
          settingState={settingState}
          setSettingState={setSettingState} />
      </div>

      <GitHubPanel
        settingState={settingState}
        formState={formState}
        setFormState={setFormState} />

      <div className="flex justify-center my-8">
        <Button
          variant="subtle"
          color="gray"
          leftIcon={<IconEgg size={16} />}>Reset</Button>
        <Space w="sm" />
        <Button
          variant="gradient" gradient={{ from: '#ffda33', to: '#ab3e02', deg: 35 }}
          leftIcon={<IconEggCracked size={16} />}
          onClick={handleGenerate}>Generate</Button>
      </div>

      <ResultPanel />
    </main>
  );
}

export default App;
