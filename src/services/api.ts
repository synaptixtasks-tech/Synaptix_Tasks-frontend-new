const BACKEND_URL = import.meta.env.VITE_API_URL

function getHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  return headers
}

function handleResponse(respond: Response) {
  if (!respond.ok) {
    const statusMessage = `${respond.status} ${respond.statusText}`
    console.error('API Error:', statusMessage, respond)
    throw new Error(`API Error ${statusMessage}`)
  }
  return respond.json().catch(() => {
    throw new Error('Failed to parse API response')
  })
}

export const api = {
  async get(endpoint: string) {
    try {
      const respond = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      })
      return handleResponse(respond)
    } catch (e) {
      console.error('GET request failed:', e)
      throw e
    }
  },
  async post(endpoint: string, data: unknown) {
    try {
      const respond = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: 'include',
      })
      return handleResponse(respond)
    } catch (e) {
      console.error('POST request failed:', e)
      throw e
    }
  },
  async postForm(endpoint: string, data: Record<string, string>) {
    try {
      const form = new URLSearchParams(data)
      const respond = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
        credentials: 'include',
      })
      return handleResponse(respond)
    } catch (e) {
      console.error('POST FORM request failed:', e)
      throw e
    }
  },
  async put(endpoint: string, data: unknown) {
    try {
      const respond = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
        credentials: 'include',
      })
      return handleResponse(respond)
    } catch (e) {
      console.error('PUT request failed:', e)
      throw e
    }
  },
  async delete(endpoint: string) {
    try {
      const respond = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      })
      return handleResponse(respond)
    } catch (e) {
      console.error('DELETE request failed:', e)
      throw e
    }
  },
}
