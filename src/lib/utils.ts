import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Cookie utility functions
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

// Utility function to get API credentials from cookies first, then fallback to environment variables
export function getApiCredentials() {
  const apiKey = getCookie('api_key') || process.env.API_KEY
  const accessToken = getCookie('access_token') || process.env.API_ACCESS_TOKEN
  
  return {
    apiKey,
    accessToken
  }
}

// Server-side utility function to get API credentials from request cookies first, then fallback to environment variables
export function getApiCredentialsFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie')
  let apiKey = process.env.API_KEY
  let accessToken = process.env.API_ACCESS_TOKEN
  
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=')
      acc[name] = value
      return acc
    }, {} as Record<string, string>)
    
    if (cookies.api_key) {
      apiKey = cookies.api_key
    }
    if (cookies.access_token) {
      accessToken = cookies.access_token
    }
  }
  
  return {
    apiKey,
    accessToken
  }
}