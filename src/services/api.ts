const BACKEND_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function extractErrorMessage(status: number, body: unknown): string {
  if (body && typeof body === 'object') {
    const data = body as Record<string, unknown>
    if (typeof data.error === 'string') return data.error
    if (data.error && typeof data.error === 'object') {
      // Format walidacji Zod: { error: { formErrors, fieldErrors } }
      const flat = data.error as { formErrors?: unknown[]; fieldErrors?: Record<string, unknown[]> }
      const messages = [
        ...(flat.formErrors ?? []).map(String),
        ...Object.values(flat.fieldErrors ?? {}).flat().map(String),
      ]
      if (messages.length > 0) return messages.join(', ')
    }
    if (typeof data.detail === 'string') return data.detail
  }
  return `API Error ${status}`
}

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem('access_token')
  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}${endpoint}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    })
  } catch {
    throw new ApiError(0, 'Cannot connect to server')
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, extractErrorMessage(res.status, data))
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, data: unknown) => request<T>('POST', endpoint, data),
  put: <T>(endpoint: string, data: unknown) => request<T>('PUT', endpoint, data),
  delete: <T = void>(endpoint: string) => request<T>('DELETE', endpoint),
}
