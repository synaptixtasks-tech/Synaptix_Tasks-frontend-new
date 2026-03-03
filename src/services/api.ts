const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function getHeaders() {
  const token = localStorage.getItem('access_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
  return headers
}

function handleResponse(respond: Response) {
  if (!respond.ok) {
    throw new Error(`API Error ${respond.status}`)
  }
  return respond.json()
}

export const api = {
  async get(endpoint: string) {
    const respond = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return handleResponse(respond)
  },
  async post(endpoint: string, data: unknown) {
    const respond = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(respond)
  },
  async put(endpoint: string, data: unknown) {
    const respond = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(respond)
  },
  async delete(endpoint: string) {
    const respond = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse(respond)
  },
}
