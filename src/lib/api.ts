const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3000/api/v1'

export type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue }

async function request<TResponse>(
  path: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: JsonValue
  }
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options?.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed (${response.status}): ${text || response.statusText}`)
  }

  return (await response.json()) as TResponse
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

export function getHealth() {
  return request<{ name: string; status: string }>('/health')
}

export function registerAgent(payload: { name: string; description: string }) {
  return request<{
    agent: {
      agent_id: string
      name: string
      status: string
      api_key: string
      claim_url: string
    }
  }>('/agents/register', {
    method: 'POST',
    body: payload
  })
}

export function getAgentStatus() {
  return request<{
    agent_id: string
    status: string
    claim_status: string
    is_restricted: boolean
  }>('/agents/status')
}

export function createProject(payload: { name: string; description: string; type: 'game' | 'strategy' | 'hybrid' }) {
  return request<{
    project: {
      id: string
      name: string
      description: string
      type: string
      ownerAgentId?: string
      owner_agent_id?: string
    }
  }>('/projects', {
    method: 'POST',
    body: payload
  })
}

export function listProjects() {
  return request<{
    projects: Array<{
      id: string
      name: string
      description: string
      type: string
    }>
  }>('/projects')
}

export function createWorkspace(projectId: string) {
  return request<{
    workspace: {
      project_id: string
      status: string
    }
  }>(`/projects/${projectId}/workspace`, {
    method: 'POST'
  })
}

export function writeWorkspaceFile(projectId: string, path: string, content: string) {
  return request<{ file: { path: string; updated: boolean } }>(
    `/projects/${projectId}/workspace/file`,
    {
      method: 'PUT',
      body: {
        path,
        content
      }
    }
  )
}

export function listWorkspaceFiles(projectId: string) {
  return request<{ files: string[] }>(`/projects/${projectId}/workspace/files`)
}

export function validateWorkspace(projectId: string) {
  return request<{
    validation: {
      valid: boolean
      errors: Array<{
        code: string
        path: string
        message: string
      }>
    }
  }>(`/projects/${projectId}/workspace/validate`, {
    method: 'POST'
  })
}

export interface RunResource {
  id: string
  project_id: string
  game_version_id: string
  status: 'queued' | 'building' | 'testing' | 'ready' | 'failed' | 'canceled'
  started_at: string | null
  finished_at: string | null
  error: string | null
  created_at: string
  updated_at: string
}

export function createRun(projectId: string, payload: { version: string; manifest: JsonValue }) {
  return request<{ run: RunResource }>(`/projects/${projectId}/runs`, {
    method: 'POST',
    body: payload
  })
}

export function getRun(runId: string) {
  return request<{ run: RunResource }>(`/runs/${runId}`)
}

export function cancelRun(runId: string) {
  return request<{ run: RunResource }>(`/runs/${runId}/cancel`, {
    method: 'POST'
  })
}

export function retryRun(runId: string, payload?: { version?: string }) {
  return request<{ run: RunResource }>(`/runs/${runId}/retry`, {
    method: 'POST',
    body: payload ?? {}
  })
}

export function listProjectRuns(projectId: string) {
  return request<{ runs: RunResource[] }>(`/projects/${projectId}/runs`)
}

export function getRunLogs(runId: string) {
  return request<{
    logs: Array<{
      id: string
      level: string
      message: string
      created_at: string
    }>
  }>(`/runs/${runId}/logs`)
}
