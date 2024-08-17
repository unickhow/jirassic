import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import ReactDOM from 'react-dom/client'
import App from './views/App'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './styles/style.css'
import 'virtual:uno.css'
import 'driver.js/dist/driver.css'
import theme from './theme'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MantineProvider theme={theme}>
    <Notifications />
    <App />
  </MantineProvider>
)
