import axios from 'axios'
import { Patient } from '@/types'

export async function getPatients(): Promise<Patient[]> {
  try {
    const response = await axios.get('/api/patients')
    console.log('API Response:', response.data)
    
    // Handle FHIR Bundle response format
    if (response.data.entry && Array.isArray(response.data.entry)) {
      return response.data.entry.map((entry: any) => {
        const resource = entry.resource
        console.log('Existing patient phone format:', resource.telecom?.find((t: any) => t.system === 'phone')?.value)
        return {
          id: resource.id,
          family: resource.name?.[0]?.family || '',
          given: resource.name?.[0]?.given?.[0] || '',
          birthDate: resource.birthDate || '',
          email: resource.telecom?.find((t: any) => t.system === 'email')?.value || '',
          phone: resource.telecom?.find((t: any) => t.system === 'phone')?.value || ''
        }
      })
    }
    
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
      phone: resource.telecom?.find((t: any) => t.system === 'phone')?.value || ''
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
    const response = await axios.put(`/api/patients/${id}`, updates)
    return response.data
  } catch (error) {
    console.error('Error updating patient:', error)
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
