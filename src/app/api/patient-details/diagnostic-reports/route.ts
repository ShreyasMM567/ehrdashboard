import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    
    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }
    
    const apiBaseUrl = process.env.API_BASE_URL
    const apiUrlPrefix = process.env.API_URL_PREFIX
    const apiKey = process.env.API_KEY
    const accessToken = process.env.API_ACCESS_TOKEN
    
    if (!apiBaseUrl || !apiUrlPrefix || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/DiagnosticReport?patient=${patientId}`
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error) {
    console.error('Error fetching patient diagnostic reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient diagnostic reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, code, status, category, effectiveDate, performer, conclusion } = body
    
    if (!patientId || !code || !category) {
      return NextResponse.json({ error: 'Patient ID, code, and category are required' }, { status: 400 })
    }
    
    const apiBaseUrl = process.env.API_BASE_URL
    const apiUrlPrefix = process.env.API_URL_PREFIX
    const apiKey = process.env.API_KEY
    const accessToken = process.env.API_ACCESS_TOKEN
    
    if (!apiBaseUrl || !apiUrlPrefix || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const fhirDiagnosticReport = {
      resourceType: "DiagnosticReport",
      status: status || "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0074",
              code: category.toLowerCase().replace(/\s+/g, '-'),
              display: category
            }
          ]
        }
      ],
      code: {
        text: code
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: effectiveDate || undefined,
      performer: performer ? [
        {
          display: performer
        }
      ] : undefined,
      conclusion: conclusion || undefined
    }
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/DiagnosticReport`
    
    const response = await axios.post(url, fhirDiagnosticReport, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error) {
    console.error('Error creating diagnostic report:', error)
    return NextResponse.json(
      { error: 'Failed to create diagnostic report' },
      { status: 500 }
    )
  }
}
