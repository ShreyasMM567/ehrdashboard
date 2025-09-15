import { renderHook } from '@testing-library/react'
import { usePatients, usePatient, usePatientMutations } from '@/hooks/usePatients'

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn()
}))

// Mock API functions
jest.mock('@/lib/api/patients', () => ({
  getPatients: jest.fn(),
  getPatient: jest.fn(),
  createPatient: jest.fn(),
  updatePatient: jest.fn(),
  deletePatient: jest.fn(),
  searchPatientById: jest.fn()
}))

import useSWR from 'swr'
const mockSWR = useSWR

describe('usePatients Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return patients data when successful', () => {
    const mockData = {
      data: [
        { id: '1', family: 'Doe', given: 'John', birthDate: '1990-01-01', email: 'john@example.com', phone: '123-456-7890' }
      ],
      total: 1,
      page: 1,
      count: 10,
      hasNext: false,
      hasPrev: false
    }

    mockSWR.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      mutate: jest.fn()
    })

    const { result } = renderHook(() => usePatients())

    expect(result.current.patients).toEqual(mockData.data)
    expect(result.current.pagination).toEqual({
      total: 1,
      page: 1,
      count: 10,
      hasNext: false,
      hasPrev: false
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle loading state', () => {
    mockSWR.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      mutate: jest.fn()
    })

    const { result } = renderHook(() => usePatients())

    expect(result.current.patients).toEqual([])
    expect(result.current.pagination).toBe(null)
    expect(result.current.isLoading).toBe(true)
  })

  it('should handle error state', () => {
    const mockError = new Error('Failed to fetch patients')
    
    mockSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: jest.fn()
    })

    const { result } = renderHook(() => usePatients())

    expect(result.current.patients).toEqual([])
    expect(result.current.error).toBe(mockError)
    expect(result.current.isLoading).toBe(false)
  })
})

describe('usePatient Hook', () => {
  it('should return single patient data', () => {
    const mockPatient = {
      id: '1',
      family: 'Doe',
      given: 'John',
      birthDate: '1990-01-01',
      email: 'john@example.com',
      phone: '123-456-7890'
    }

    mockSWR.mockReturnValue({
      data: mockPatient,
      error: null,
      isLoading: false,
      mutate: jest.fn()
    })

    const { result } = renderHook(() => usePatient('1'))

    expect(result.current.patient).toEqual(mockPatient)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should not fetch when id is empty', () => {
    mockSWR.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      mutate: jest.fn()
    })

    renderHook(() => usePatient(''))

    expect(mockSWR).toHaveBeenCalledWith(null, expect.any(Function))
  })
})

describe('usePatientMutations Hook', () => {
  it('should provide mutation functions', () => {
    const mockMutate = jest.fn()
    mockSWR.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      mutate: mockMutate
    })

    const { result } = renderHook(() => usePatientMutations())

    expect(result.current.create).toBeInstanceOf(Function)
    expect(result.current.update).toBeInstanceOf(Function)
    expect(result.current.remove).toBeInstanceOf(Function)
  })

  it('should call createPatient and mutate cache', async () => {
    const mockMutate = jest.fn()
    const mockNewPatient = { id: '2', family: 'Smith', given: 'Jane' }
    
    mockSWR.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      mutate: mockMutate
    })

    // Mock the createPatient function
    const mockCreatePatient = jest.fn().mockResolvedValue(mockNewPatient)
    const patientsModule = await import('@/lib/api/patients')
    patientsModule.createPatient = mockCreatePatient

    const { result } = renderHook(() => usePatientMutations())

    const newPatient = await result.current.create({
      family: 'Smith',
      given: 'Jane',
      birthDate: '1990-01-01',
      email: 'jane@example.com',
      phone: '123-456-7890'
    })

    expect(mockCreatePatient).toHaveBeenCalledWith({
      family: 'Smith',
      given: 'Jane',
      birthDate: '1990-01-01',
      email: 'jane@example.com',
      phone: '123-456-7890'
    })
    expect(mockMutate).toHaveBeenCalled()
    expect(newPatient).toEqual(mockNewPatient)
  })
})
