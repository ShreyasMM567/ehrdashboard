import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createAuthenticatedHandler } from '@/lib/auth-middleware'
import { getApiCredentialsFromRequest } from '@/lib/utils'

const API_BASE_URL = process.env.API_BASE_URL
const API_URL_PREFIX = process.env.API_URL_PREFIX

export const GET = createAuthenticatedHandler(async (request: NextRequest, _token) => {
  try {
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    
    if (!API_BASE_URL || !API_URL_PREFIX || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    const url = `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Appointment`
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    return NextResponse.json(response.data)
    
  } catch (error: unknown) {
    console.error('Error fetching appointments:', error)
    
    // Handle 404 errors gracefully
    if (error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'status' in error.response && 
        error.response.status === 404) {
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
})

export const POST = createAuthenticatedHandler(async (request: NextRequest, _token) => {
  try {
    const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
    const body = await request.json()
    const { patientId, practitionerId, startDateTime, endDateTime, minutesDuration } = body
    
    if (!patientId || !practitionerId || !startDateTime || !endDateTime) {
      return NextResponse.json({ error: 'Patient ID, practitioner ID, start date, and end date are required' }, { status: 400 })
    }
    
    if (!API_BASE_URL || !API_URL_PREFIX || !apiKey || !accessToken) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }
    
    // First, validate that patient and practitioner exist by calling the external API directly
    try {
      const [patientResponse, practitionerResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Practitioner/${practitionerId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          }
        })
      ])
      
      const patient = patientResponse.data
      const practitioner = practitionerResponse.data
      
      const patientName = `${patient.name?.[0]?.given?.[0] || ''} ${patient.name?.[0]?.family || ''}`.trim()
      const practitionerName = practitioner.name?.[0]?.text || `${practitioner.name?.[0]?.given?.[0] || ''} ${practitioner.name?.[0]?.family || ''}`.trim()
      
      // Create the FHIR appointment
      const fhirAppointment = {
        resourceType: "Appointment",
        status: "booked",
        appointmentType: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0276",
              code: "1509",
              display: "New Patient"
            }
          ],
          text: "New Patient"
        },
        start: startDateTime,
        end: endDateTime,
        minutesDuration: minutesDuration || 30,
        participant: [
          {
            actor: {
              reference: `Patient/${patientId}`,
              display: patientName
            },
            status: "accepted"
          },
          {
            actor: {
              reference: "Location/604",
              display: "Wall Street"
            },
            status: "accepted"
          },
          {
            actor: {
              reference: `Practitioner/${practitionerId}`,
              display: practitionerName
            },
            status: "accepted"
          }
        ]
      }
      
      const url = `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Appointment`
      
      const response = await axios.post(url, fhirAppointment, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      })
      
      return NextResponse.json(response.data)
      
    } catch (validationError: unknown) {
      console.error('Error validating patient or practitioner:', validationError)
      
      // Handle specific validation errors
      if (validationError && typeof validationError === 'object' && 'response' in validationError && 
          validationError.response && typeof validationError.response === 'object' && 'status' in validationError.response && 
          validationError.response.status === 404) {
        const errorMessage = (validationError as any).config?.url?.includes('/Patient/') 
          ? 'Patient not found' 
          : 'Practitioner not found'
        return NextResponse.json({ error: errorMessage }, { status: 404 })
      }
      
      return NextResponse.json(
        { error: 'Failed to validate patient or practitioner' },
        { status: 500 }
      )
    }
    
  } catch (error: unknown) {
    console.error('Error creating appointment:', error)
    
    // Handle specific booking unavailable error
    if (error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' &&
        ('error' in error.response.data && error.response.data.error === 'BOOKING_UNAVAILABLE' ||
         'message' in error.response.data && typeof error.response.data.message === 'string' && 
         error.response.data.message.includes('BOOKING_UNAVAILABLE'))) {
      return NextResponse.json(
        { error: 'BOOKING_UNAVAILABLE' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
})
