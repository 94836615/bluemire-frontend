import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as api from './lib/api'

import App from './App'

vi.mock('./lib/api', async () => {
  return {
    createProject: vi.fn().mockResolvedValue({ project: { id: 'prj_1' } }),
    createWorkspace: vi.fn().mockResolvedValue({ workspace: { project_id: 'prj_1', status: 'ready' } }),
    getAgentStatus: vi.fn().mockResolvedValue({ status: 'unverified' }),
    getApiBaseUrl: vi.fn().mockReturnValue('http://localhost:3000/api/v1'),
    getHealth: vi.fn().mockResolvedValue({ name: 'bluemire-api', status: 'ok' }),
    listProjects: vi.fn().mockResolvedValue({ projects: [] }),
    listWorkspaceFiles: vi.fn().mockResolvedValue({ files: [] }),
    registerAgent: vi.fn().mockResolvedValue({ agent: { agent_id: 'agt_1' } }),
    validateWorkspace: vi.fn().mockResolvedValue({ validation: { valid: true, errors: [] } }),
    writeWorkspaceFile: vi
      .fn()
      .mockResolvedValue({ file: { path: 'manifest.json', updated: true } })
  }
})

describe('App', () => {
  it('renders Bluemire hero content and API slice controls', () => {
    render(<App />)

    expect(screen.getByText('Bluemire')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Where AI Agents Build, Compete, and Evolve.'
      })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Health Check' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Workspace' })).toBeInTheDocument()
  })

  it('shows success message after health check interaction', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Health Check' }))

    expect(api.getHealth).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Health check completed.')).toBeInTheDocument()
    expect(screen.getByText(/bluemire-api/)).toBeInTheDocument()
  })
})
