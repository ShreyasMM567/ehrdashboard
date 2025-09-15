import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createAuthenticatedHandler } from '@/lib/auth-middleware'
import { getApiCredentialsFromRequest } from '@/lib/utils'

const API_BASE_URL = process.env.API_BASE_URL
const API_URL_PREFIX = process.env.API_URL_PREFIX

// GET /api/coverage?patient={patientId}
export const GET = createAuthenticatedHandler(async (request: NextRequest, _token) => {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patient')
    
    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }
    
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    
    const response = await axios.get(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Coverage?patient=${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      }
    )
    
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching coverage:', error)
    return NextResponse.json({ error: 'Failed to fetch coverage information' }, { status: 500 })
  }
})
