import axios from 'axios'
import { Patient } from '@/types'

export async function getPatients(): Promise<Patient[]> {
  try {
    const response = await axios.get('/api/patients')
    console.log('API Response:', response.data)
    console.log('Response type:', typeof response.data)
    console.log('Is array:', Array.isArray(response.data))
    
    // Handle FHIR Bundle response format
    if (response.data && response.data.entry && Array.isArray(response.data.entry)) {
      console.log('Processing FHIR Bundle with', response.data.entry.length, 'entries')
      return response.data.entry.map((entry: any) => {
        const resource = entry.resource
        console.log('Processing patient resource:', resource.id)
        return {
          id: resource.id,
          family: resource.name?.[0]?.family || '',
          given: resource.name?.[0]?.given?.[0] || '',
          birthDate: resource.birthDate || '',
          email: resource.telecom?.find((t: any) => t.system === 'email')?.value || '',
          phone: resource.telecom?.find((t: any) => t.system === 'phone')?.value || '',
          address: resource.address?.[0] ? {
            city: resource.address[0].city || '',
            state: resource.address[0].state || '',
            postalCode: resource.address[0].postalCode || '',
            country: resource.address[0].country || '',
            line: resource.address[0].line || []
          } : undefined
        }
      })
    }
    
    // Handle case where response.data is already an array
    if (Array.isArray(response.data)) {
      console.log('Response is already an array with', response.data.length, 'items')
      return response.data.map((patient: any) => ({
        id: patient.id,
        family: patient.family || '',
        given: patient.given || '',
        birthDate: patient.birthDate || '',
        email: patient.email || '',
        phone: patient.phone || ''
      }))
    }
    
    console.log('Unexpected response format:', response.data)
    return []
  } catch (error) {
    console.error('Error fetching patients:', error)
    return []
  }
}

export async function getPatient(id: string): Promise<Patient | null> {
  try {
    const response = await axios.get(`/api/patients/${id}`)
    const resource = response.data
    
    return {
      id: resource.id,
      family: resource.name?.[0]?.family || '',
      given: resource.name?.[0]?.given?.[0] || '',
      birthDate: resource.birthDate || '',
      email: resource.telecom?.find((t: any) => t.system === 'email')?.value || '',
      phone: resource.telecom?.find((t: any) => t.system === 'phone')?.value || '',
      address: resource.address?.[0] ? {
        city: resource.address[0].city || '',
        state: resource.address[0].state || '',
        postalCode: resource.address[0].postalCode || '',
        country: resource.address[0].country || '',
        line: resource.address[0].line || []
      } : undefined
    }
  } catch (error) {
    console.error('Error fetching patient:', error)
    return null
  }
}

export async function createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
  try {
    // Convert to FHIR format - match the exact working format
    const fhirPatient = {
      resourceType: "Patient",
      name: [
        {
          family: patient.family,
          given: [patient.given]
        }
      ],
      telecom: [
        {
          system: "phone",
          value: patient.phone, // Use original format with dashes
          use: "mobile"
        },
        {
          system: "email",
          value: patient.email
        }
      ],
      birthDate: patient.birthDate
    }
    
    console.log('Sending FHIR patient:', JSON.stringify(fhirPatient, null, 2))
    
    const response = await axios.post('/api/patients', fhirPatient)
    const resource = response.data
    
    return {
      id: resource.id,
      family: resource.name?.[0]?.family || '',
      given: resource.name?.[0]?.given?.[0] || '',
      birthDate: resource.birthDate || '',
      email: resource.telecom?.find((t: any) => t.system === 'email')?.value || '',
      phone: resource.telecom?.find((t: any) => t.system === 'phone')?.value || ''
    }
  } catch (error) {
    console.error('Error creating patient:', error)
    throw error
  }
}

export async function updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
  try {
    // First, get the current patient data to merge with updates
    const currentPatient = await getPatient(id)
    if (!currentPatient) {
      throw new Error('Patient not found')
    }
    
    // Merge current data with updates
    const mergedData = {
      family: updates.family ?? currentPatient.family,
      given: updates.given ?? currentPatient.given,
      birthDate: updates.birthDate ?? currentPatient.birthDate,
      email: updates.email ?? currentPatient.email,
      phone: updates.phone ?? currentPatient.phone
    }
    
    const fhirPatient = {
      resourceType: "Patient",
      id: id, // Required for PUT operations
      name: [
        {
          family: mergedData.family,
          given: [mergedData.given]
        }
      ],
      telecom: [
        {
          system: "phone",
          value: mergedData.phone,
          use: "mobile"
        },
        {
          system: "email",
          value: mergedData.email
        }
      ],
      birthDate: mergedData.birthDate
    }
    
    console.log('Sending FHIR patient update:', JSON.stringify(fhirPatient, null, 2))
    
    const response = await axios.put(`/api/patients/${id}`, fhirPatient)
    const resource = response.data
    
    console.log('PUT response data:', JSON.stringify(resource, null, 2))
    console.log('Resource name:', resource.name)
    console.log('Resource telecom:', resource.telecom)
    
    // Parse the response based on the exact structure you provided
    const updatedPatient = {
      id: resource.id || id, // Use response ID or fallback to input ID
      family: resource.name?.[0]?.family || '',
      given: resource.name?.[0]?.given?.[0] || '',
      birthDate: resource.birthDate || '',
      email: resource.telecom?.find((t: any) => t.system === 'email')?.value || '',
      phone: resource.telecom?.find((t: any) => t.system === 'phone')?.value || ''
    }
    
    console.log('Parsed updated patient:', updatedPatient)
    console.log('Patient name components:', {
      given: updatedPatient.given,
      family: updatedPatient.family,
      fullName: `${updatedPatient.given} ${updatedPatient.family}`
    })
    
    return updatedPatient
  } catch (error) {
    console.error('Error updating patient:', error)
    throw error
  }
}

export async function searchPatientById(id: string): Promise<Patient | null> {
  try {
    if (!id.trim()) {
      return null
    }
    
    console.log('Searching for patient with ID:', id)
    const response = await axios.get(`/api/patients/${id}`)
    const resource = response.data
    
    console.log('Search response:', resource)
    
    return {
      id: resource.id,
      family: resource.name?.[0]?.family || '',
      given: resource.name?.[0]?.given?.[0] || '',
      birthDate: resource.birthDate || '',
      email: resource.telecom?.find((t: any) => t.system === 'email')?.value || '',
      phone: resource.telecom?.find((t: any) => t.system === 'phone')?.value || ''
    }
  } catch (error) {
    console.error('Error searching for patient:', error)
    return null
  }
}

export async function deletePatient(id: string): Promise<boolean> {
  try {
    await axios.delete(`/api/patients/${id}`)
    return true
  } catch (error) {
    console.error('Error deleting patient:', error)
    return false
  }
}
