import { fetch } from '@tauri-apps/api/http'
import { showNotification } from '@mantine/notifications'

export default async function request(url: string, options: any) {
  const optionsPayload = {
    ...options,
    timeout: 15
  }
  return fetch(url, optionsPayload)
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Unauthorized')
      }
      return response
    })
    .catch((error) => {
      if (error.message === 'Unauthorized') {
        showNotification({
          title: 'Unauthorized',
          message: 'Try to re-enter your github/jira token',
          color: 'red'
        })
      } else {
        showNotification({
          title: 'Error',
          message: 'Something went wrong, please try again',
          color: 'red'
        })
      }
      return Promise.reject(error)
    })
}
