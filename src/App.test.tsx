import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as api from './lib/api'

import App from './App'

vi.mock('./lib/api', async () => {
  return {
    createRun: vi.fn().mockResolvedValue({
      run: {
        id: 'run_1',
        project_id: 'prj_1',
        game_version_id: 'gv_1',
        status: 'queued',
        started_at: null,
        finished_at: null,
        error: null,
        created_at: '2026-04-14T00:00:00.000Z',
        updated_at: '2026-04-14T00:00:00.000Z'
      }
    }),
    createProject: vi.fn().mockResolvedValue({ project: { id: 'prj_1' } }),
    createWorkspace: vi.fn().mockResolvedValue({ workspace: { project_id: 'prj_1', status: 'ready' } }),
    getAgentStatus: vi.fn().mockResolvedValue({ status: 'unverified' }),
    getApiBaseUrl: vi.fn().mockReturnValue('http://localhost:3000/api/v1'),
    getHealth: vi.fn().mockResolvedValue({ name: 'bluemire-api', status: 'ok' }),
    getRun: vi.fn().mockResolvedValue({
      run: {
        id: 'run_1',
        project_id: 'prj_1',
        game_version_id: 'gv_1',
        status: 'ready',
        started_at: '2026-04-14T00:00:01.000Z',
        finished_at: '2026-04-14T00:00:03.000Z',
        error: null,
        created_at: '2026-04-14T00:00:00.000Z',
        updated_at: '2026-04-14T00:00:03.000Z'
      }
    }),
    getRunLogs: vi.fn().mockResolvedValue({ logs: [] }),
    listProjectRuns: vi.fn().mockResolvedValue({ runs: [] }),
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
  it('renders Bluemire hero content and hides console by default', () => {
    render(<App />)

    expect(screen.getByText('bluemire')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'A Social Network for AI Agents'
      })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Open Developer Console' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Health Check' })).not.toBeInTheDocument()
  })

  it('shows success message after health check interaction', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Open Developer Console' }))
    await user.click(screen.getByRole('button', { name: 'Health Check' }))

    expect(api.getHealth).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Health check completed.')).toBeInTheDocument()
    expect(screen.getByText(/bluemire-api/)).toBeInTheDocument()
  })

  it('launches run with parsed manifest payload', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Open Developer Console' }))

    const projectIdInput = screen.getByLabelText('Run Project ID')
    const manifestInput = screen.getByLabelText('Run Manifest JSON')

    await user.clear(projectIdInput)
    await user.type(projectIdInput, 'prj_1')
    await user.clear(manifestInput)
    fireEvent.change(manifestInput, {
      target: {
        value: '{"name":"Grid Arena","world":{"map":"grid"},"rules":{"mode":"elimination"}}'
      }
    })

    await user.click(screen.getByRole('button', { name: 'Launch Run' }))

    expect(api.createRun).toHaveBeenCalledWith('prj_1', {
      version: '0.1.0',
      manifest: {
        name: 'Grid Arena',
        world: { map: 'grid' },
        rules: { mode: 'elimination' }
      }
    })
  })
})
