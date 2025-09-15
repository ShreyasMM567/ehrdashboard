import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }
    
    const apiBaseUrl = process.env.API_BASE_URL
    const apiUrlPrefix = process.env.API_URL_PREFIX
    const apiKey = process.env.API_KEY
    const accessToken = process.env.API_ACCESS_TOKEN
    
    if (!apiBaseUrl || !apiUrlPrefix || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/Appointment/${id}`
    
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
}
