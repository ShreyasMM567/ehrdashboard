import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_BASE_URL = process.env.API_BASE_URL
const API_URL_PREFIX = process.env.API_URL_PREFIX
const API_ACCESS_TOKEN = process.env.API_ACCESS_TOKEN
const API_KEY = process.env.API_KEY

// GET /api/patients/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient/${params.id}`,
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
    console.error('Error fetching patient:', error)
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 })
  }
}

// PUT /api/patients/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const response = await axios.put(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient/${params.id}`,
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
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 })
  }
}

// DELETE /api/patients/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await axios.delete(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient/${params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        }
      }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 })
  }
}
