import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createAuthenticatedHandler } from '@/lib/auth-middleware'
import { getApiCredentialsFromRequest } from '@/lib/utils'

const API_BASE_URL = process.env.API_BASE_URL
const API_URL_PREFIX = process.env.API_URL_PREFIX

// GET /api/patients/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return createAuthenticatedHandler(async (_req: NextRequest, _token) => {
  try {
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    const { id } = await params
    const response = await axios.get(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient/${id}`,
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
    console.error('Error fetching patient:', error)
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 })
  }
  })(request)
}

// PUT /api/patients/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return createAuthenticatedHandler(async (_req: NextRequest, _token) => {
  try {
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    const { id } = await params
    const body = await request.json()
    console.log('PUT request body:', JSON.stringify(body, null, 2))
    console.log('Updating patient ID:', id)
    
    const response = await axios.put(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient/${id}`,
      body,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      }
    )
    
    console.log('PUT response:', response.data)
    return NextResponse.json(response.data)
  } catch (error: unknown) {
    console.error('Error updating patient:', error)
    const errorObj = error as any
    console.error('Error response:', errorObj.response?.data)
    console.error('Error status:', errorObj.response?.status)
    return NextResponse.json({ 
      error: 'Failed to update patient',
      details: errorObj.response?.data
    }, { status: errorObj.response?.status || 500 })
  }
  })(request)
}

// DELETE /api/patients/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return createAuthenticatedHandler(async (_req: NextRequest, _token) => {
  try {
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    const { id } = await params
    await axios.delete(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 })
  }
  })(request)
}
