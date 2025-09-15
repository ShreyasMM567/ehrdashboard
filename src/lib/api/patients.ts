import axios from 'axios'
import { Patient } from '@/types'

export interface PaginationParams {
  count?: number
  page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  count: number
  hasNext: boolean
  hasPrev: boolean
}

export async function getPatients(params?: PaginationParams): Promise<PaginatedResponse<Patient>> {
  try {
    const count = params?.count || 10
    const page = params?.page || 1
    
    const queryParams = new URLSearchParams({
      _count: count.toString(),
      page: page.toString()
    })
    
    const url = `/api/patients?${queryParams.toString()}`
    const response = await axios.get(url)
    
    let patients: Patient[] = []
    let total = 0
    
    // Handle FHIR Bundle response format
    if (response.data && response.data.entry && Array.isArray(response.data.entry)) {
      console.log('Processing FHIR Bundle with', response.data.entry.length, 'entries')
      patients = response.data.entry.map((entry: any) => {
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
      
      // Extract total from FHIR Bundle
      total = response.data.total || patients.length
    } else if (Array.isArray(response.data)) {
      console.log('Response is already an array with', response.data.length, 'items')
      patients = response.data.map((patient: any) => ({
        id: patient.id,
        family: patient.family || '',
        given: patient.given || '',
        birthDate: patient.birthDate || '',
        email: patient.email || '',
        phone: patient.phone || ''
      }))
      total = patients.length
    } else {
      console.log('Unexpected response format:', response.data)
      patients = []
      total = 0
    }
    
    // If we don't have a reliable total, estimate based on current page and results
    const estimatedTotal = total > 0 ? total : (patients.length === count ? page * count + 1 : page * count)
    
    // Simple pagination logic: if we got a full page, assume there might be more
    const hasNext = patients.length === count
    const hasPrev = page > 1
    
    
    return {
      data: patients,
      total: estimatedTotal,
      page,
      count,
      hasNext,
      hasPrev
    }
  } catch (error) {
    console.error('Error fetching patients:', error)
    return {
      data: [],
      total: 0,
      page: 1,
      count: 10,
      hasNext: false,
      hasPrev: false
    }
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
