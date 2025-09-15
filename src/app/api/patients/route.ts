import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createAuthenticatedHandler } from '@/lib/auth-middleware'

const API_BASE_URL = process.env.API_BASE_URL
const API_URL_PREFIX = process.env.API_URL_PREFIX
const API_ACCESS_TOKEN = process.env.API_ACCESS_TOKEN
const API_KEY = process.env.API_KEY
// GET /api/patients
export const GET = createAuthenticatedHandler(async (request: NextRequest, token) => {
  try {
    const { searchParams } = new URL(request.url)
    const count = searchParams.get('_count') || '10'
    const page = searchParams.get('page') || '1'
    
    // Build query parameters for FHIR API
    const queryParams = new URLSearchParams({
      _count: count,
      page: page
    })
    
    const response = await axios.get(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient?${queryParams.toString()}`,
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
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
  }
})

// POST /api/patients
export const POST = createAuthenticatedHandler(async (request: NextRequest, token) => {
  try {
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const response = await axios.post(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient/`,
      body,
      {
        headers: {
          'Authorization': `Bearer ${API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        }
      }
    )
    
    // Extract patient ID from location header
    const locationHeader = response.headers.location
    const patientId = locationHeader ? locationHeader.split('/').pop() : response.data.id
    
    return NextResponse.json({
      ...response.data,
      id: patientId,
      location: locationHeader
    })
  } catch (error: any) {
    console.error('Error creating patient:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    return NextResponse.json({ 
      error: 'Failed to create patient',
      details: error.response?.data 
    }, { status: error.response?.status || 500 })
  }
})
