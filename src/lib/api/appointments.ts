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