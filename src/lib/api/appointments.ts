import axios from 'axios'
import { Appointment } from '@/types'

// Function to get all appointments
export async function getAppointments(): Promise<Appointment[]> {
  try {
    const response = await axios.get('/api/appointments')
    const bundle = response.data
    
    if (!bundle.entry || bundle.entry.length === 0) {
      return []
    }
    
    // Transform FHIR Appointment resources to our Appointment interface
    const appointments: Appointment[] = bundle.entry.map((entry: any) => {
      const resource = entry.resource
      
      // Extract patient information
      let patientId = ''
      let patientName = ''
      if (resource.participant) {
        const patientParticipant = resource.participant.find((p: any) => 
          p.actor?.reference?.includes('/Patient/')
        )
        if (patientParticipant?.actor?.reference) {
          // Extract ID from full URL like "https://stage.ema-api.com/.../Patient/256708"
          const patientMatch = patientParticipant.actor.reference.match(/\/Patient\/(\d+)/)
          patientId = patientMatch ? patientMatch[1] : ''
          patientName = `Patient ${patientId}` // Use ID as name since display is the full URL
        }
      }
      
      // Extract practitioner information
      let practitionerId = ''
      let practitionerName = ''
      if (resource.participant) {
        const practitionerParticipant = resource.participant.find((p: any) => 
          p.actor?.reference?.includes('/Practitioner/')
        )
        if (practitionerParticipant?.actor?.reference) {
          // Extract ID from full URL
          const practitionerMatch = practitionerParticipant.actor.reference.match(/\/Practitioner\/(\d+)/)
          practitionerId = practitionerMatch ? practitionerMatch[1] : ''
          practitionerName = `Practitioner ${practitionerId}` // Use ID as name since display is the full URL
        }
      }
      
      // Extract service type from appointmentType
      let serviceType = ''
      if (resource.appointmentType && resource.appointmentType.coding && resource.appointmentType.coding.length > 0) {
        serviceType = resource.appointmentType.coding[0].display || 
                     resource.appointmentType.text || 'Unknown Service'
      }
      
      // Extract location
      let location = ''
      if (resource.participant) {
        const locationParticipant = resource.participant.find((p: any) => 
          p.actor?.reference?.includes('/Location/')
        )
        if (locationParticipant?.actor?.reference) {
          // Extract ID from full URL
          const locationMatch = locationParticipant.actor.reference.match(/\/Location\/(\d+)/)
          location = locationMatch ? `Location ${locationMatch[1]}` : 'Unknown Location'
        }
      }
      
      return {
        id: resource.id || '',
        status: resource.status || 'unknown',
        start: resource.start || '',
        end: resource.end || '',
        patientId,
        patientName,
        practitionerId,
        practitionerName,
        description: resource.description || '',
        serviceType,
        location,
        minutesDuration: resource.minutesDuration
      }
    })
    
    return appointments
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
}

// Function to get a single appointment by ID
export async function getAppointment(id: string): Promise<Appointment | null> {
  try {
    const response = await axios.get(`/api/appointments/${id}`)
    const resource = response.data
    
    // Transform single FHIR Appointment resource
    let patientId = ''
    let patientName = ''
    if (resource.participant) {
      const patientParticipant = resource.participant.find((p: any) => 
        p.actor?.reference?.includes('/Patient/')
      )
      if (patientParticipant?.actor?.reference) {
        const patientMatch = patientParticipant.actor.reference.match(/\/Patient\/(\d+)/)
        patientId = patientMatch ? patientMatch[1] : ''
        patientName = `Patient ${patientId}`
      }
    }
    
    let practitionerId = ''
    let practitionerName = ''
    if (resource.participant) {
      const practitionerParticipant = resource.participant.find((p: any) => 
        p.actor?.reference?.includes('/Practitioner/')
      )
      if (practitionerParticipant?.actor?.reference) {
        const practitionerMatch = practitionerParticipant.actor.reference.match(/\/Practitioner\/(\d+)/)
        practitionerId = practitionerMatch ? practitionerMatch[1] : ''
        practitionerName = `Practitioner ${practitionerId}`
      }
    }
    
    let serviceType = ''
    if (resource.appointmentType && resource.appointmentType.coding && resource.appointmentType.coding.length > 0) {
      serviceType = resource.appointmentType.coding[0].display || 
                   resource.appointmentType.text || 'Unknown Service'
    }
    
    let location = ''
    if (resource.participant) {
      const locationParticipant = resource.participant.find((p: any) => 
        p.actor?.reference?.includes('/Location/')
      )
      if (locationParticipant?.actor?.reference) {
        const locationMatch = locationParticipant.actor.reference.match(/\/Location\/(\d+)/)
        location = locationMatch ? `Location ${locationMatch[1]}` : 'Unknown Location'
      }
    }
    
    return {
      id: resource.id || '',
      status: resource.status || 'unknown',
      start: resource.start || '',
      end: resource.end || '',
      patientId,
      patientName,
      practitionerId,
      practitionerName,
      description: resource.description || '',
      serviceType,
      location,
      minutesDuration: resource.minutesDuration
    }
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return null
  }
}

// Function to create a new appointment
export async function createAppointment(appointmentData: {
  patientId: string
  practitionerId: string
  startDateTime: string
  endDateTime: string
  minutesDuration?: number
}) {
  try {
    const response = await axios.post('/api/appointments', appointmentData)
    return response.data
  } catch (error: any) {
    console.error('Error creating appointment:', error)
    
    // Handle specific booking unavailable error
    if (error.response?.status === 409 && error.response?.data?.error === 'BOOKING_UNAVAILABLE') {
      throw new Error('BOOKING_UNAVAILABLE')
    }
    
    // Handle validation errors
    if (error.response?.status === 404) {
      throw new Error('Patient or practitioner not found')
    }
    
    throw error
  }
}

// Function to update an existing appointment
export async function updateAppointment(id: string, updates: {
  status?: string
  start?: string
  end?: string
  minutesDuration?: number
}) {
  try {
    // First, get the current appointment data to merge with updates
    const currentAppointment = await getAppointment(id)
    if (!currentAppointment) {
      throw new Error('Appointment not found')
    }
    
    // Get the full FHIR appointment data
    const response = await axios.get(`/api/appointments/${id}`)
    const fhirAppointment = response.data
    
    // Update only the fields that are provided in the request
    const updatedFhirAppointment = {
      ...fhirAppointment,
      status: updates.status || fhirAppointment.status,
      start: updates.start || fhirAppointment.start,
      end: updates.end || fhirAppointment.end,
      minutesDuration: updates.minutesDuration || fhirAppointment.minutesDuration
    }
    
    console.log('Sending FHIR appointment update:', JSON.stringify(updatedFhirAppointment, null, 2))
    
    const putResponse = await axios.put(`/api/appointments/${id}`, updatedFhirAppointment)
    return putResponse.data
  } catch (error: any) {
    console.error('Error updating appointment:', error)
    
    if (error.response?.status === 404) {
      throw new Error('Appointment not found')
    }
    
    throw error
  }
}