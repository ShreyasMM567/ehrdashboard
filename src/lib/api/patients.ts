import { Patient } from '@/types'

// Mock data for development
const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-03-15',
    email: 'john.doe@email.com',
    phone: '5551234567',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '5551234568'
    },
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC123456789',
      groupNumber: 'GRP001'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Smith',
    dateOfBirth: '1990-07-22',
    email: 'sarah.smith@email.com',
    phone: '5559876543',
    address: {
      street: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    emergencyContact: {
      name: 'Mike Smith',
      relationship: 'Brother',
      phone: '5559876544'
    },
    insurance: {
      provider: 'Aetna',
      policyNumber: 'AET987654321',
      groupNumber: 'GRP002'
    },
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  }
]

export async function getPatients(): Promise<Patient[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockPatients
}

export async function getPatient(id: string): Promise<Patient | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockPatients.find(patient => patient.id === id) || null
}

export async function createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newPatient: Patient = {
    ...patient,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockPatients.push(newPatient)
  return newPatient
}

export async function updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const index = mockPatients.findIndex(patient => patient.id === id)
  if (index === -1) return null
  
  mockPatients[index] = {
    ...mockPatients[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  return mockPatients[index]
}

export async function deletePatient(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const index = mockPatients.findIndex(patient => patient.id === id)
  if (index === -1) return false
  
  mockPatients.splice(index, 1)
  return true
}
