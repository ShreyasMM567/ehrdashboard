import { ClinicalNote, Vitals, Allergy, Medication } from '@/types'

// Mock data for development
const mockClinicalNotes: ClinicalNote[] = [
  {
    id: '1',
    patientId: '1',
    providerId: '1',
    providerName: 'Dr. Johnson',
    date: '2024-01-15',
    type: 'vitals',
    title: 'Blood Pressure Check',
    content: 'Patient reports feeling well. Blood pressure within normal range.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
]

const mockVitals: Vitals[] = [
  {
    id: '1',
    patientId: '1',
    date: '2024-01-15',
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 72,
    temperature: 98.6,
    weight: 175,
    height: 70,
    bmi: 25.1,
    oxygenSaturation: 98,
    notes: 'All vitals within normal range'
  }
]

const mockAllergies: Allergy[] = [
  {
    id: '1',
    patientId: '1',
    allergen: 'Penicillin',
    severity: 'severe',
    reaction: 'Hives and difficulty breathing',
    notes: 'Patient carries EpiPen',
    createdAt: '2024-01-15T10:00:00Z'
  }
]

const mockMedications: Medication[] = [
  {
    id: '1',
    patientId: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2024-01-01',
    prescribedBy: 'Dr. Johnson',
    notes: 'For blood pressure management',
    isActive: true
  }
]

export async function getClinicalNotes(patientId?: string): Promise<ClinicalNote[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return patientId 
    ? mockClinicalNotes.filter(note => note.patientId === patientId)
    : mockClinicalNotes
}

export async function createClinicalNote(note: Omit<ClinicalNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClinicalNote> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newNote: ClinicalNote = {
    ...note,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockClinicalNotes.push(newNote)
  return newNote
}

export async function getVitals(patientId?: string): Promise<Vitals[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return patientId 
    ? mockVitals.filter(vital => vital.patientId === patientId)
    : mockVitals
}

export async function createVitals(vitals: Omit<Vitals, 'id'>): Promise<Vitals> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newVitals: Vitals = {
    ...vitals,
    id: Date.now().toString()
  }
  
  mockVitals.push(newVitals)
  return newVitals
}

export async function getAllergies(patientId?: string): Promise<Allergy[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return patientId 
    ? mockAllergies.filter(allergy => allergy.patientId === patientId)
    : mockAllergies
}

export async function createAllergy(allergy: Omit<Allergy, 'id' | 'createdAt'>): Promise<Allergy> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newAllergy: Allergy = {
    ...allergy,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  
  mockAllergies.push(newAllergy)
  return newAllergy
}

export async function getMedications(patientId?: string): Promise<Medication[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return patientId 
    ? mockMedications.filter(medication => medication.patientId === patientId)
    : mockMedications
}

export async function createMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newMedication: Medication = {
    ...medication,
    id: Date.now().toString()
  }
  
  mockMedications.push(newMedication)
  return newMedication
}
