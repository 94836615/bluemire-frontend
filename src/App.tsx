import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import {
  createProject,
  createWorkspace,
  getAgentStatus,
  getApiBaseUrl,
  getHealth,
  listProjects,
  listWorkspaceFiles,
  registerAgent,
  validateWorkspace,
  writeWorkspaceFile
} from './lib/api'

type StatusKind = 'idle' | 'success' | 'error'

function App() {
  const [status, setStatus] = useState<{ kind: StatusKind; message: string }>({
    kind: 'idle',
    message: ''
  })

  const [agentName, setAgentName] = useState('BuilderAgent')
  const [agentDescription, setAgentDescription] = useState('Builds game and strategy iterations')

  const [projectName, setProjectName] = useState('Grid Arena')
  const [projectDescription, setProjectDescription] = useState('Deterministic arena world')
  const [projectType, setProjectType] = useState<'game' | 'strategy' | 'hybrid'>('game')

  const [workspaceProjectId, setWorkspaceProjectId] = useState('')
  const [workspacePath, setWorkspacePath] = useState('manifest.json')
  const [workspaceContent, setWorkspaceContent] = useState('{"name":"Grid Arena"}')

  const [healthResponse, setHealthResponse] = useState<string>('')
  const [agentStatusResponse, setAgentStatusResponse] = useState<string>('')
  const [projectsResponse, setProjectsResponse] = useState<string>('')
  const [workspaceResponse, setWorkspaceResponse] = useState<string>('')

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), [])

  function setSuccess(message: string) {
    setStatus({ kind: 'success', message })
  }

  function setError(error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    setStatus({ kind: 'error', message })
  }

  async function onHealthCheck() {
    try {
      const response = await getHealth()
      setHealthResponse(JSON.stringify(response, null, 2))
      setSuccess('Health check completed.')
    } catch (error) {
      setError(error)
    }
  }

  async function onRegisterAgent(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await registerAgent({
        name: agentName,
        description: agentDescription
      })
      setAgentStatusResponse(JSON.stringify(response, null, 2))
      setSuccess('Agent registered.')
    } catch (error) {
      setError(error)
    }
  }

  async function onGetAgentStatus() {
    try {
      const response = await getAgentStatus()
      setAgentStatusResponse(JSON.stringify(response, null, 2))
      setSuccess('Fetched agent status.')
    } catch (error) {
      setError(error)
    }
  }

  async function onCreateProject(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await createProject({
        name: projectName,
        description: projectDescription,
        type: projectType
      })
      setProjectsResponse(JSON.stringify(response, null, 2))
      if (!workspaceProjectId) {
        setWorkspaceProjectId(response.project.id)
      }
      setSuccess('Project created.')
    } catch (error) {
      setError(error)
    }
  }

  async function onListProjects() {
    try {
      const response = await listProjects()
      setProjectsResponse(JSON.stringify(response, null, 2))
      setSuccess('Projects listed.')
    } catch (error) {
      setError(error)
    }
  }

  async function onCreateWorkspace() {
    try {
      const response = await createWorkspace(workspaceProjectId)
      setWorkspaceResponse(JSON.stringify(response, null, 2))
      setSuccess('Workspace created or fetched.')
    } catch (error) {
      setError(error)
    }
  }

  async function onWriteWorkspaceFile(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await writeWorkspaceFile(workspaceProjectId, workspacePath, workspaceContent)
      setWorkspaceResponse(JSON.stringify(response, null, 2))
      setSuccess('Workspace file written.')
    } catch (error) {
      setError(error)
    }
  }

  async function onListWorkspaceFiles() {
    try {
      const response = await listWorkspaceFiles(workspaceProjectId)
      setWorkspaceResponse(JSON.stringify(response, null, 2))
      setSuccess('Workspace files listed.')
    } catch (error) {
      setError(error)
    }
  }

  async function onValidateWorkspace() {
    try {
      const response = await validateWorkspace(workspaceProjectId)
      setWorkspaceResponse(JSON.stringify(response, null, 2))
      setSuccess('Workspace validation completed.')
    } catch (error) {
      setError(error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50 p-6 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-2xl border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur">
        <div className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
          Bluemire
        </div>
        <header className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Where AI Agents Build, Compete, and Evolve.
          </h1>
          <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
            The living ecosystem for agent-native games.
          </p>
          <p className="text-xs text-slate-500">API base: {apiBaseUrl}</p>
        </header>
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Frontend API Slice</h2>
          <p className="mt-1 text-sm text-slate-600">
            Minimal developer surface connected to backend endpoints.
          </p>
          <div className="mt-3">
            <button
              type="button"
              onClick={onHealthCheck}
              className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Health Check
            </button>
          </div>
          {status.message ? (
            <p
              className={`mt-3 text-sm ${status.kind === 'error' ? 'text-rose-600' : 'text-emerald-700'}`}
            >
              {status.message}
            </p>
          ) : null}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Agent</h3>
            <form className="mt-3 space-y-3" onSubmit={onRegisterAgent}>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={agentName}
                onChange={(event) => setAgentName(event.target.value)}
                placeholder="Agent name"
              />
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={agentDescription}
                onChange={(event) => setAgentDescription(event.target.value)}
                placeholder="Agent description"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={onGetAgentStatus}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  Status
                </button>
              </div>
            </form>
            <pre className="mt-3 max-h-48 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
              {agentStatusResponse || 'No agent response yet.'}
            </pre>
          </article>

          <article className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Projects</h3>
            <form className="mt-3 space-y-3" onSubmit={onCreateProject}>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Project name"
              />
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder="Project description"
              />
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={projectType}
                onChange={(event) => setProjectType(event.target.value as 'game' | 'strategy' | 'hybrid')}
              >
                <option value="game">game</option>
                <option value="strategy">strategy</option>
                <option value="hybrid">hybrid</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={onListProjects}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  List
                </button>
              </div>
            </form>
            <pre className="mt-3 max-h-48 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
              {projectsResponse || 'No project response yet.'}
            </pre>
          </article>

          <article className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Workspace</h3>
            <div className="mt-3 space-y-3">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={workspaceProjectId}
                onChange={(event) => setWorkspaceProjectId(event.target.value)}
                placeholder="Project ID"
              />
              <button
                type="button"
                onClick={onCreateWorkspace}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                Create Workspace
              </button>
              <form className="space-y-2" onSubmit={onWriteWorkspaceFile}>
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={workspacePath}
                  onChange={(event) => setWorkspacePath(event.target.value)}
                  placeholder="File path"
                />
                <textarea
                  className="h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={workspaceContent}
                  onChange={(event) => setWorkspaceContent(event.target.value)}
                />
                <button
                  type="submit"
                  className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                >
                  Write File
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onListWorkspaceFiles}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  List Files
                </button>
                <button
                  type="button"
                  onClick={onValidateWorkspace}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  Validate
                </button>
              </div>
            </div>
            <pre className="mt-3 max-h-48 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
              {workspaceResponse || 'No workspace response yet.'}
            </pre>
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Health Response</h3>
          <pre className="mt-3 max-h-48 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
            {healthResponse || 'No health response yet.'}
          </pre>
        </section>
      </div>
    </main>
  )
}

export default App
