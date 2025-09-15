import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createAuthenticatedHandler } from '@/lib/auth-middleware'
import { getApiCredentialsFromRequest } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return createAuthenticatedHandler(async (req: NextRequest, token) => {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Practitioner ID is required' }, { status: 400 })
    }
    
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    const apiBaseUrl = process.env.API_BASE_URL
    const apiUrlPrefix = process.env.API_URL_PREFIX
    
    if (!apiBaseUrl || !apiUrlPrefix || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/Practitioner/${id}`
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error: any) {
    console.error('Error fetching practitioner:', error)
    
    if (error.response?.status === 404) {
      return NextResponse.json({ error: 'Practitioner not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch practitioner' },
      { status: 500 }
    )
  }
  })(request)
}
