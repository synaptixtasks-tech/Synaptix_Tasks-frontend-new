export interface User {
  id: number
  username: string
}

export interface UserCreate {
  username: string
  password: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  date_created: string
  user_id: number
}

export interface TaskCreate {
  title: string
  description?: string | null
  completed?: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
}
