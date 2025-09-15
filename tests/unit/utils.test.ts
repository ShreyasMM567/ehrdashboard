import { cn, formatDate, formatDateTime, formatPhoneNumber, getApiCredentials } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('should merge conflicting Tailwind classes', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4')
    })
  })

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Dec 25, 2023/)
    })

    it('should format date string correctly', () => {
      const formatted = formatDate('2023-12-25')
      expect(formatted).toMatch(/Dec 25, 2023/)
    })
  })

  describe('formatDateTime', () => {
    it('should format Date object with time correctly', () => {
      const date = new Date('2023-12-25T14:30:00Z')
      const formatted = formatDateTime(date)
      expect(formatted).toMatch(/Dec 25, 2023/)
      expect(formatted).toMatch(/8:00 PM/) // UTC time converted to local time
    })

    it('should format date string with time correctly', () => {
      const formatted = formatDateTime('2023-12-25T14:30:00Z')
      expect(formatted).toMatch(/Dec 25, 2023/)
      expect(formatted).toMatch(/8:00 PM/) // UTC time converted to local time
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format 10-digit phone number correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
    })

    it('should format phone number with extra characters', () => {
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890')
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890')
    })

    it('should return original string if not 10 digits', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('12345678901')).toBe('12345678901')
    })
  })

  describe('getApiCredentials', () => {
    const originalEnv = process.env

    beforeEach(() => {
      // Mock document.cookie
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: '',
      })
      // Clear environment variables
      process.env = { ...originalEnv }
      delete process.env.API_KEY
      delete process.env.API_ACCESS_TOKEN
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should return credentials from cookies when available', () => {
      document.cookie = 'api_key=test_key; access_token=test_token'
      
      const credentials = getApiCredentials()
      expect(credentials.apiKey).toBe('test_key')
      expect(credentials.accessToken).toBe('test_token')
    })

    it('should return undefined when cookies are not available', () => {
      const credentials = getApiCredentials()
      expect(credentials.apiKey).toBeUndefined()
      expect(credentials.accessToken).toBeUndefined()
    })
  })
})
