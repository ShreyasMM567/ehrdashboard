import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createAuthenticatedHandler } from '@/lib/auth-middleware'

const API_BASE_URL = process.env.API_BASE_URL
const API_URL_PREFIX = process.env.API_URL_PREFIX
const API_ACCESS_TOKEN = process.env.API_ACCESS_TOKEN
const API_KEY = process.env.API_KEY

// GET /api/coverage?patient={patientId}
export const GET = createAuthenticatedHandler(async (request: NextRequest, token) => {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patient')
    
    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }
    
    const response = await axios.get(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Coverage?patient=${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        }
      }
    )
    
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching coverage:', error)
    return NextResponse.json({ error: 'Failed to fetch coverage information' }, { status: 500 })
  }
})
