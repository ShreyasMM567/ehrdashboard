import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_BASE_URL = process.env.API_BASE_URL
const API_URL_PREFIX = process.env.API_URL_PREFIX
const API_ACCESS_TOKEN = process.env.API_ACCESS_TOKEN
const API_KEY = process.env.API_KEY
// GET /api/patients
export async function GET() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient`,
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
}

// POST /api/patients
export async function POST(request: NextRequest) {
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
    
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error creating patient:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    return NextResponse.json({ 
      error: 'Failed to create patient',
      details: error.response?.data 
    }, { status: error.response?.status || 500 })
  }
}
