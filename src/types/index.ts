export interface TaskCreate {
  title: string
  description?: string | null
  completed?: boolean
}

export interface Task extends TaskCreate {
  id: number
  user_id: number
  date_created: string
  completed: boolean
}

export interface UserCreate {
  username: string
  password: string
}

export interface User {
  id: number
  username: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}
