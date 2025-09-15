import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createAuthenticatedHandler } from '@/lib/auth-middleware'
import { getApiCredentialsFromRequest } from '@/lib/utils'

export const GET = createAuthenticatedHandler(async (request: NextRequest, _token) => {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    
    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }
    
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    const apiBaseUrl = process.env.API_BASE_URL
    const apiUrlPrefix = process.env.API_URL_PREFIX
    
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
})

export const POST = createAuthenticatedHandler(async (request: NextRequest, _token) => {
  try {
    const body = await request.json()
    const { patientId, medicationCodeableConcept, status, effectiveDateTime, dosage, note } = body
    
    if (!patientId || !medicationCodeableConcept) {
      return NextResponse.json({ error: 'Patient ID and medication name are required' }, { status: 400 })
    }
    
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    const apiBaseUrl = process.env.API_BASE_URL
    const apiUrlPrefix = process.env.API_URL_PREFIX
    
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
})
