import { createTheme, Paper, Button, Popover } from '@mantine/core';

export default createTheme({
  primaryColor: 'jirassic',
  colors: {
    'jirassic': [
      '#FFE5D2', // Lightest
      '#FFD4B8',
      '#FFC39E',
      '#FFC369',
      '#FFA06A',
      '#FF9946', // Mid
      '#FF7E36',
      '#FF6C1C',
      '#FF5B02', // Darker than base
      '#AB3E02'  // Darkest
      ],
  },
  components: {
    Paper: Paper.extend({
      defaultProps: {
        radius: 'lg',
      },
      styles: {
        root: {
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      }
    }),
    Button: Button.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    Popover: Popover.extend({
      defaultProps: {
        radius: 'lg',
      },
    }),
  },
})
