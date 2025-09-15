import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createAuthenticatedHandler } from '@/lib/auth-middleware'
import { getApiCredentialsFromRequest } from '@/lib/utils'

const API_BASE_URL = process.env.API_BASE_URL
const API_URL_PREFIX = process.env.API_URL_PREFIX

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return createAuthenticatedHandler(async (req: NextRequest, token) => {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }
    
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    
    if (!API_BASE_URL || !API_URL_PREFIX || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const url = `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Appointment/${id}`
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error: any) {
    console.error('Error fetching appointment:', error)
    
    if (error.response?.status === 404) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    )
  }
  })(request)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return createAuthenticatedHandler(async (req: NextRequest, token) => {
  try {
    const { id } = await params
    const body = await request.json()
    console.log('PUT request body:', JSON.stringify(body, null, 2))
    console.log('Updating appointment ID:', id)
    
    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }
    
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    
    if (!API_BASE_URL || !API_URL_PREFIX || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const response = await axios.put(
      `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Appointment/${id}`,
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
    
  } catch (error: any) {
    console.error('Error updating appointment:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    
    return NextResponse.json({ 
      error: 'Failed to update appointment',
      details: error.response?.data
    }, { status: error.response?.status || 500 })
  }
  })(request)
}
