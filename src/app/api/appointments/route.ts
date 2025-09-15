import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    const apiBaseUrl = process.env.API_BASE_URL
    const apiUrlPrefix = process.env.API_URL_PREFIX
    const apiKey = process.env.API_KEY
    const accessToken = process.env.API_ACCESS_TOKEN
    
    if (!apiBaseUrl || !apiUrlPrefix || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/Appointment`
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error: any) {
    console.error('Error fetching appointments:', error)
    
    // Handle 404 errors gracefully
    if (error.response?.status === 404) {
      return NextResponse.json({
        resourceType: "Bundle",
        type: "searchset",
        total: 0,
        entry: []
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}
