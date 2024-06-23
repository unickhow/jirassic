import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IWorkspace, IStoreStatistics } from '../declare/interface'

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

      currentWorkspace: defaultWorkspace as IWorkspace,
      removeWorkspace: (workspace: IWorkspace) => {
        const workspaces = (get() as any).workspaces
        if (workspaces.length === 1) return
        const newWorkspaces = workspaces.filter((ws: IWorkspace) => ws.name !== workspace.name)
        set((state: any) => state.currentWorkspace = newWorkspaces[0])
        set((state: any) => state.workspaces = newWorkspaces)
      },
      setCurrentWorkspace: (workspace: IWorkspace) => {
        set((state: any) => state.currentWorkspace = workspace)
      },

      statistics: {} as IStoreStatistics,
      getCurrentWorkspaceStatistics: () => {
        const workspaceName = (get() as any).currentWorkspace.name
        return (get() as any).statistics[workspaceName]
      },
      setStatistics: (statistics: IStoreStatistics) => {
        const workspaceName = (get() as any).currentWorkspace.name
        return set((state: any) => ({
          statistics: {
            ...state.statistics,
            [workspaceName]: statistics
          }
        }))
      },
      removeStatistics: (workspace: IWorkspace) => {
        const workspaceName = workspace.name
        const statistics = (get() as any).statistics
        delete statistics[workspaceName]
        set((state: any) => state.statistics = statistics)
      }
    }),
    {
      version: 1,
      name: 'jirassic-workspaces'
    }
  )
)
