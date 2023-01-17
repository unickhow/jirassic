import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import ReactDOM from "react-dom/client";
import App from "./views/App";
import "./styles/style.css";
import 'virtual:uno.css'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MantineProvider>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </MantineProvider>
);
