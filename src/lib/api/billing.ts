import { BillingRecord, Insurance } from '@/types'

// Mock data for development
const mockBillingRecords: BillingRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    serviceDate: '2024-01-15',
    service: 'Office Visit - Consultation',
    amount: 200,
    insuranceCoverage: 160,
    patientResponsibility: 40,
    status: 'paid',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Sarah Smith',
    serviceDate: '2024-01-16',
    service: 'Annual Physical Examination',
    amount: 300,
    insuranceCoverage: 240,
    patientResponsibility: 60,
    status: 'pending',
    dueDate: '2024-02-16',
    createdAt: '2024-01-16T14:30:00Z'
  }
]

const mockInsurance: Insurance[] = [
  {
    id: '1',
    patientId: '1',
    provider: 'Blue Cross Blue Shield',
    policyNumber: 'BC123456789',
    groupNumber: 'GRP001',
    subscriberName: 'John Doe',
    relationship: 'Self',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    copay: 20,
    deductible: 1000,
    isActive: true
  }
]

export async function getBillingRecords(patientId?: string): Promise<BillingRecord[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return patientId 
    ? mockBillingRecords.filter(record => record.patientId === patientId)
    : mockBillingRecords
}

export async function createBillingRecord(record: Omit<BillingRecord, 'id' | 'createdAt'>): Promise<BillingRecord> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newRecord: BillingRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  
  mockBillingRecords.push(newRecord)
  return newRecord
}

export async function updateBillingRecord(id: string, updates: Partial<BillingRecord>): Promise<BillingRecord | null> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const index = mockBillingRecords.findIndex(record => record.id === id)
  if (index === -1) return null
  
  mockBillingRecords[index] = {
    ...mockBillingRecords[index],
    ...updates
  }
  
  return mockBillingRecords[index]
}

export async function getInsurance(patientId?: string): Promise<Insurance[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return patientId 
    ? mockInsurance.filter(insurance => insurance.patientId === patientId)
    : mockInsurance
}

export async function createInsurance(insurance: Omit<Insurance, 'id'>): Promise<Insurance> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newInsurance: Insurance = {
    ...insurance,
    id: Date.now().toString()
  }
  
  mockInsurance.push(newInsurance)
  return newInsurance
}
