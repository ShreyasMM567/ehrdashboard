export interface Patient {
  id: string
  family: string
  given: string
  birthDate: string
  email: string
  phone: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  date: string
  time: string
  duration: number
  type: 'consultation' | 'follow-up' | 'procedure' | 'checkup'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ClinicalNote {
  id: string
  patientId: string
  providerId: string
  providerName: string
  date: string
  type: 'vitals' | 'allergy' | 'medication' | 'diagnosis' | 'treatment'
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Vitals {
  id: string
  patientId: string
  date: string
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  heartRate: number
  temperature: number
  weight: number
  height: number
  bmi: number
  oxygenSaturation: number
  notes?: string
}

export interface Allergy {
  id: string
  patientId: string
  allergen: string
  severity: 'mild' | 'moderate' | 'severe'
  reaction: string
  notes?: string
  createdAt: string
}

export interface Medication {
  id: string
  patientId: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  prescribedBy: string
  notes?: string
  isActive: boolean
}

export interface BillingRecord {
  id: string
  patientId: string
  patientName: string
  serviceDate: string
  service: string
  amount: number
  insuranceCoverage: number
  patientResponsibility: number
  status: 'pending' | 'paid' | 'overdue' | 'disputed'
  dueDate: string
  createdAt: string
}

export interface Insurance {
  id: string
  patientId: string
  provider: string
  policyNumber: string
  groupNumber: string
  subscriberName: string
  relationship: string
  effectiveDate: string
  expirationDate: string
  copay: number
  deductible: number
  isActive: boolean
}

export interface Provider {
  id: string
  firstName: string
  lastName: string
  specialty: string
  email: string
  phone: string
  isActive: boolean
}
