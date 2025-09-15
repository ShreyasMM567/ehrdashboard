export const getPatients = jest.fn()
export const getPatient = jest.fn()
export const createPatient = jest.fn()
export const updatePatient = jest.fn()
export const deletePatient = jest.fn()
export const searchPatientById = jest.fn()

export interface PaginationParams {
  page?: number
  count?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  count: number
  hasNext: boolean
  hasPrev: boolean
}
