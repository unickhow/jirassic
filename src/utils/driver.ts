import { driver } from 'driver.js'
import { useStore } from '../store'
import cover from '../../src-tauri/icons/128x128.png'

function drive () {
  const hasTour = (useStore.getState() as any).hasTour
  const setHasTour = (useStore.getState() as any).setHasTour
  const driverObj = driver({
    showProgress: hasTour,
    showButtons: ['next', 'previous', 'close'],
    allowClose: hasTour,
    disableActiveInteraction: true,
    steps: [
      {
        popover: {
          description: `
            <div class="text-center">
              <img width="80" src="${cover}" />
              <h1>
                <span class="text-base">Welcome to</span>
                <br />
                <b class="text-md">Jirassic world!</b>
              </h1>
              <p>Let's start with setting up your workspace.</p>
            </div>
          `,
        }
      },
      {
        element: '#btn_setting_modal',
        popover: {
          title: 'Workspace setting',
          description: `
            <p>
              <b>Workspace</b> is a collection of your GitHub and Jira settings.
              <br />
              <br />
              <b>Click here</b> to set up your workspace.
            </p>
          `,
          onNextClick: () => {
            document.getElementById('btn_setting_modal')!.click()
            setTimeout(() => {
              driverObj.moveNext()
            }, 100)
          }
        },
      },
      {
        element: '#github_block',
        popover: {
          title: 'GitHub settings',
          description: `
            <p>
              <b>GitHub</b> is a platform for software development.
              <br />
              <br />
              <span>Fill in the form to fetch your pull requests.</span>
            </p>
          `,
          onPrevClick: () => {
            (document.querySelector('.mantine-Modal-overlay')! as HTMLElement).click()
            setTimeout(() => {
              driverObj.movePrevious()
            }, 100)
          },
          onNextClick: () => {
            document.querySelector('.mantine-Modal-content')!.scrollTop = 1000
            setTimeout(() => {
              driverObj.moveNext()
            }, 100)
          }
        },
      },
      {
        element: '#jira_block',
        popover: {
          title: 'Jira settings',
          description: `
            <p>
              <b>Jira</b> is a platform for issue tracking and project management.
              <br />
              <br />
              <span>Fill in the form to fetch your tickets.</span>
            </p>
          `,
          onPrevClick: () => {
            (document.querySelector('.mantine-Modal-content')! as HTMLElement).scrollTop = 0
            setTimeout(() => {
              driverObj.movePrevious()
            }, 100)
          },
          onNextClick: () => {
            (document.querySelector('.btn-save-as')! as HTMLElement).click()
            setTimeout(() => {
              driverObj.moveNext()
            }, 100)
          }
        },
      },
      {
        // Mantine just hijacked the ID of the button ... how suck is that?
        element: '.btn-save-as',
        popover: {
          title: 'Save workspace',
          description: `
            <p>
              <b>Save as</b> is a feature to save your settings into a new workspace.
              <br />
              <br />
              <span>Pick a name and palette to save your workspace.</span>
            </p>
          `,
          onPrevClick: () => {
            // ? for clickOutside event
            const mouseDownEvent = new MouseEvent('mousedown', {
              view: window,
              bubbles: true,
              cancelable: true
            })
            ;(document.querySelector('.mantine-Modal-overlay')! as HTMLElement).dispatchEvent(mouseDownEvent)

            setTimeout(() => {
              driverObj.movePrevious()
            }, 100)
          },
          onNextClick: () => {
            (document.querySelector('.mantine-Modal-body')! as HTMLElement).click()

            // ? for clickOutside event
            const mouseDownEvent = new MouseEvent('mousedown', {
              view: window,
              bubbles: true,
              cancelable: true
            })
            ;(document.querySelector('.mantine-Modal-overlay')! as HTMLElement).dispatchEvent(mouseDownEvent)

            ;(document.querySelector('.mantine-Modal-overlay')! as HTMLElement).click()
            setTimeout(() => {
              driverObj.moveNext()
            }, 100)
          }
        },
      },
      {
        element: '#btn_statistics_modal',
        popover: {
          title: 'Statistics',
          description: `
            <p>
              <b>Statistics</b> is the place where you can see your unmerged pull requests of your repositories.
            </p>
          `,
          onPrevClick: () => {
            document.getElementById('btn_setting_modal')!.click()
            setTimeout(() => {
              document.querySelector('.mantine-Modal-content')!.scrollTop = 1000
              ;(document.querySelector('.btn-save-as')! as HTMLElement).click()
              driverObj.movePrevious()
            }, 100)
          },
          onNextClick: () => {
            document.getElementById('btn_statistics_modal')!.click()
            setTimeout(() => {
              driverObj.moveNext()
            }, 100)
          }
        },
      },
      {
        element: '#btn_refresh_statistics',
        popover: {
          title: 'Fetch statistics',
          description: `
            <p>
              <b>Statistic</b> will remain the latest unmerged pull requests of your repositories.
              <br />
              <br />
              <span>Click here to refresh the statistics.</span>
            </p>
          `,
          onPrevClick: () => {
            (document.querySelector('.mantine-Modal-overlay')! as HTMLElement).click()
            setTimeout(() => {
              driverObj.movePrevious()
            }, 100)
          },
          onNextClick: () => {
            (document.querySelector('.mantine-Modal-overlay')! as HTMLElement).click()
            setTimeout(() => {
              driverObj.moveNext()
            }, 100)
          }
        },
      },
      {
        // again, Mantine hijacked the ID of the popover target
        element: '.workspace-badge',
        popover: {
          title: 'Switch workspace',
          description: `
            <p>
              <b>Workspace</b> is a collection of your GitHub and Jira settings.
              <br />
              <br />
              <span>Save your workspaces and click here to switch between them.</span>
            </p>
          `,
          onPrevClick: () => {
            document.getElementById('btn_statistics_modal')!.click()
            setTimeout(() => {
              driverObj.movePrevious()
            }, 100)
          }
        },
      },
      {
        popover: {
          description: `
            <div class="text-center">
              <h1>
                <b class="text-md">That's all! 🎉</b>
              </h1>
              <p>Enjoy your journey with Jirassic.</p>
              <p>
                Feel free to
                <a
                  href="https://github.com/unickhow/jirassic"
                  target="_blank">
                  contact me
                </a>
                if you need any help.
              </p>
            </div>
          `,
        }
      }
    ],
    onDestroyed: () => {
      setHasTour(true)
    }
  })
  driverObj.drive()
}

export default drive
