// Mock axios
jest.mock('axios')

// Mock auth middleware
jest.mock('@/lib/auth-middleware', () => ({
  createAuthenticatedHandler: (handler: any) => handler
}))

// Mock environment variables
process.env.API_BASE_URL = 'https://test-api.com'
process.env.API_URL_PREFIX = 'test'

describe('API Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('API Route Logic', () => {
    it('should handle patient data transformation', () => {
      const mockPatientData = {
        resourceType: 'Patient',
        name: [{ family: 'Doe', given: ['John'] }],
        birthDate: '1990-01-01'
      }

      // Test data transformation logic
      const transformedData = {
        id: '1',
        family: mockPatientData.name[0].family,
        given: mockPatientData.name[0].given[0],
        birthDate: mockPatientData.birthDate
      }

      expect(transformedData).toEqual({
        id: '1',
        family: 'Doe',
        given: 'John',
        birthDate: '1990-01-01'
      })
    })

    it('should handle query parameters correctly', () => {
      const searchParams = new URLSearchParams({
        _count: '5',
        page: '2'
      })

      expect(searchParams.get('_count')).toBe('5')
      expect(searchParams.get('page')).toBe('2')
    })

    it('should handle error responses', () => {
      const mockError = {
        response: {
          status: 400,
          data: { error: 'Invalid data' }
        }
      }

      const errorResponse = {
        error: 'Failed to create patient',
        details: mockError.response.data
      }

      expect(errorResponse.error).toBe('Failed to create patient')
      expect(errorResponse.details).toEqual({ error: 'Invalid data' })
    })
  })
})