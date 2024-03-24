import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IWorkspace } from '../declare/interface'

function randomId() {
  // TODO: use id for comparison instead of name
  return Math.random().toString(36).substring(7)
}

const defaultWorkspace: IWorkspace = {
  id: randomId(),
  name: 'default',
  owner: '',
  githubToken: '',
  repositories: [],
  branches: [],
  jiraDomain: '',
  jiraAccount: '',
  jiraToken: '',
  color: '#ff7800'
}

export const useStore = create(
  persist(
    (set, get) => ({
      currentWorkspace: defaultWorkspace as IWorkspace,
      workspaces: [defaultWorkspace as IWorkspace],
      setWorkspace: (workspace: IWorkspace) => {
        const workspaces = (get() as any).workspaces
        const index = workspaces.findIndex((ws: IWorkspace) => ws.name === workspace.name)
        if (index !== -1) {
          workspaces[index] = workspace
        } else {
          set({ workspaces: [...(get() as any).workspaces, workspace] })
        }
        set({ currentWorkspace: workspace })
      },
      removeWorkspace: (workspace: IWorkspace) => {
        const workspaces = (get() as any).workspaces
        if (workspaces.length === 1) return

        const index = workspaces.findIndex((ws: IWorkspace) => ws.name === workspace.name)
        if (index !== -1) {
          workspaces.splice(index, 1)
        }
      },
      setCurrentWorkspace: (workspace: IWorkspace) => {
        set((state: any) => state.currentWorkspace = workspace )
      },
    }),
    {
      version: 1,
      name: 'jirassic-workspaces'
    }
  )
)
