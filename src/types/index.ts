export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  dateCreated: string
  updatedAt: string
  isDeleted: boolean
  userId: string
}

export interface TaskCreate {
  id?: string
  title: string
  description?: string | null
  completed?: boolean
}

export interface TaskUpdate {
  id?: string
  title?: string
  description?: string | null
  completed?: boolean
}

export interface UserCreate {
  username: string
  password: string
}

export interface User {
  id: string
  username: string
  dateCreated: string
  updatedAt: string
}

export interface TokenResponse {
  accessToken: string
  tokenType: string
}
