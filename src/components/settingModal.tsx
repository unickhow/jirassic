import { useState } from 'react';
import { Modal, ActionIcon } from '@mantine/core';
import { IconSettings } from '@tabler/icons';

const SettingModal = () => {
  const [opened, setOpened] = useState(false);

  return  (
    <>
      <ActionIcon onClick={() => setOpened(true)}><IconSettings size={20} /></ActionIcon>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Setting"
        overlayColor="#fafafa"
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        Hello
      </Modal>
    </>
  )
}

export default SettingModal
