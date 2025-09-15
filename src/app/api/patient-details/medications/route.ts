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
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/MedicationStatement?patient=${patientId}`
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error) {
    console.error('Error fetching patient medications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient medications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, medicationCodeableConcept, status, effectiveDateTime, dosage, note } = body
    
    if (!patientId || !medicationCodeableConcept) {
      return NextResponse.json({ error: 'Patient ID and medication name are required' }, { status: 400 })
    }
    
    const apiBaseUrl = process.env.API_BASE_URL
    const apiUrlPrefix = process.env.API_URL_PREFIX
    const apiKey = process.env.API_KEY
    const accessToken = process.env.API_ACCESS_TOKEN
    
    if (!apiBaseUrl || !apiUrlPrefix || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const fhirMedicationStatement = {
      resourceType: "MedicationStatement",
      status: status || "active",
      medicationCodeableConcept: {
        text: medicationCodeableConcept
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: effectiveDateTime || undefined,
      dosage: dosage ? [
        {
          text: dosage
        }
      ] : undefined,
      note: note ? [
        {
          text: note
        }
      ] : undefined
    }
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/MedicationStatement`
    
    const response = await axios.post(url, fhirMedicationStatement, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error) {
    console.error('Error creating medication statement:', error)
    return NextResponse.json(
      { error: 'Failed to create medication statement' },
      { status: 500 }
    )
  }
}
