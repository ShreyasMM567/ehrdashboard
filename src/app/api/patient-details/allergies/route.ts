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
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/AllergyIntolerance?patient=${patientId}`
    console.log(url)
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error) {
    console.error('Error fetching patient allergies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient allergies' },
      { status: 500 }
    )
  }
})

export const POST = createAuthenticatedHandler(async (request: NextRequest, _token) => {
  try {
    const body = await request.json()
    const { patientId, code, description, clinicalStatus } = body
    
    if (!patientId || !code || !description) {
      return NextResponse.json({ error: 'Patient ID, code, and description are required' }, { status: 400 })
    }
    
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    const apiBaseUrl = process.env.API_BASE_URL
    const apiUrlPrefix = process.env.API_URL_PREFIX
    
    if (!apiBaseUrl || !apiUrlPrefix || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const fhirAllergy = {
      resourceType: "AllergyIntolerance",
      clinicalStatus: {
        coding: [
          {
            system: "https://www.hl7.org/fhir/valueset-allergyintolerance-clinical.html",
            code: clinicalStatus || "active",
            display: clinicalStatus === "active" ? "Active" : 
                    clinicalStatus === "inactive" ? "Inactive" : "Resolved"
          }
        ],
        text: clinicalStatus === "active" ? "Active" : 
              clinicalStatus === "inactive" ? "Inactive" : "Resolved"
      },
      code: {
        text: code
      },
      patient: {
        reference: `Patient/${patientId}`
      },
      reaction: [
        {
          description: description
        }
      ]
    }
    
    const url = `${apiBaseUrl}/${apiUrlPrefix}/ema/fhir/v2/AllergyIntolerance`
    
    const response = await axios.post(url, fhirAllergy, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error) {
    console.error('Error creating allergy:', error)
    return NextResponse.json(
      { error: 'Failed to create allergy' },
      { status: 500 }
    )
  }
})
