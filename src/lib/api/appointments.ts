import { Appointment } from '@/types'

// Mock data for development
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    providerId: '1',
    providerName: 'Dr. Johnson',
    date: '2024-01-20',
    time: '10:00',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    notes: 'Follow-up for blood pressure',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Sarah Smith',
    providerId: '2',
    providerName: 'Dr. Williams',
    date: '2024-01-22',
    time: '14:30',
    duration: 45,
    type: 'checkup',
    status: 'confirmed',
    notes: 'Annual physical examination',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  }
]

export async function getAppointments(): Promise<Appointment[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockAppointments
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockAppointments.find(appointment => appointment.id === id) || null
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockAppointments.push(newAppointment)
  return newAppointment
}

export async function updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const index = mockAppointments.findIndex(appointment => appointment.id === id)
  if (index === -1) return null
  
  mockAppointments[index] = {
    ...mockAppointments[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  return mockAppointments[index]
}

export async function deleteAppointment(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const index = mockAppointments.findIndex(appointment => appointment.id === id)
  if (index === -1) return false
  
  mockAppointments.splice(index, 1)
  return true
}
