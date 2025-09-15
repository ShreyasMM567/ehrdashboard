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
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/Condition?patient=${patientId}`
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error) {
    console.error('Error fetching patient conditions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient conditions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, code, clinicalStatus, category, severity, onsetDate, note } = body
    
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
    
    const fhirCondition = {
      resourceType: "Condition",
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: clinicalStatus || "active",
            display: clinicalStatus === "active" ? "Active" : 
                    clinicalStatus === "inactive" ? "Inactive" : "Resolved"
          }
        ]
      },
      code: {
        text: code
      },
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/condition-category",
              code: category.toLowerCase().replace(/\s+/g, '-'),
              display: category
            }
          ]
        }
      ],
      subject: {
        reference: `Patient/${patientId}`
      },
      onsetDateTime: onsetDate || undefined,
      severity: severity ? {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: severity.toLowerCase(),
            display: severity
          }
        ]
      } : undefined,
      note: note ? [
        {
          text: note
        }
      ] : undefined
    }
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/Condition`
    
    const response = await axios.post(url, fhirCondition, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error) {
    console.error('Error creating condition:', error)
    return NextResponse.json(
      { error: 'Failed to create condition' },
      { status: 500 }
    )
  }
}
