import axios from 'axios'

// Types for patient detail data
export interface Allergy {
  id: string
  code: string
  display: string
  clinicalStatus: string
  verificationStatus: string
  category: string
  criticality: string
  onsetDateTime?: string
  note?: string
}

export interface Condition {
  id: string
  code: string
  display: string
  clinicalStatus: string
  verificationStatus: string
  category: string
  severity: string
  onsetDateTime?: string
  note?: string
}

export interface DiagnosticReport {
  id: string
  status: string
  category: string
  code: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  subject: {
    reference: string
  }
  effectiveDateTime?: string
  issued?: string
  performer?: Array<{
    display: string
  }>
  conclusion?: string
  presentedForm?: Array<{
    contentType: string
    data: string
  }>
}

export interface MedicationStatement {
  id: string
  status: string
  medicationCodeableConcept: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  subject: {
    reference: string
  }
  effectiveDateTime?: string
  dosage?: Array<{
    text: string
    timing?: {
      repeat?: {
        frequency: number
        period: number
        periodUnit: string
      }
    }
  }>
  note?: string
}

// API functions for individual patient details
export async function getPatientAllergies(patientId: string): Promise<Allergy[]> {
  try {
    const response = await axios.get(`/api/patient-details/allergies?patientId=${patientId}`)
    
    if (response.data && response.data.entry && Array.isArray(response.data.entry)) {
      return response.data.entry.map((entry: any) => {
        const resource = entry.resource
        return {
          id: resource.id,
          code: resource.code?.coding?.[0]?.code || '',
          display: resource.code?.coding?.[0]?.display || '',
          clinicalStatus: resource.clinicalStatus?.coding?.[0]?.code || '',
          verificationStatus: resource.verificationStatus?.coding?.[0]?.code || '',
          category: resource.category?.[0] || '',
          criticality: resource.criticality || '',
          onsetDateTime: resource.onsetDateTime,
          note: resource.note?.[0]?.text || ''
        }
      })
    }
    
    return []
  } catch (error) {
    console.error('Error fetching patient allergies:', error)
    // Return empty array for any error (404, network issues, etc.)
    return []
  }
}

export async function getPatientConditions(patientId: string): Promise<Condition[]> {
  try {
    const response = await axios.get(`/api/patient-details/conditions?patientId=${patientId}`)
    
    if (response.data && response.data.entry && Array.isArray(response.data.entry)) {
      return response.data.entry.map((entry: any) => {
        const resource = entry.resource
        return {
          id: resource.id,
          code: resource.code?.coding?.[0]?.code || '',
          display: resource.code?.coding?.[0]?.display || '',
          clinicalStatus: resource.clinicalStatus?.coding?.[0]?.code || '',
          verificationStatus: resource.verificationStatus?.coding?.[0]?.code || '',
          category: resource.category?.[0]?.coding?.[0]?.display || '',
          severity: resource.severity?.coding?.[0]?.display || '',
          onsetDateTime: resource.onsetDateTime,
          note: resource.note?.[0]?.text || ''
        }
      })
    }
    
    return []
  } catch (error) {
    console.error('Error fetching patient conditions:', error)
    // Return empty array for any error (404, network issues, etc.)
    return []
  }
}

export async function getPatientDiagnosticReports(patientId: string): Promise<DiagnosticReport[]> {
  try {
    const response = await axios.get(`/api/patient-details/diagnostic-reports?patientId=${patientId}`)
    
    if (response.data && response.data.entry && Array.isArray(response.data.entry)) {
      return response.data.entry.map((entry: any) => {
        const resource = entry.resource
        return {
          id: resource.id,
          status: resource.status || '',
          category: resource.category?.[0]?.coding?.[0]?.display || '',
          code: {
            coding: resource.code?.coding || []
          },
          subject: resource.subject || { reference: '' },
          effectiveDateTime: resource.effectiveDateTime,
          issued: resource.issued,
          performer: resource.performer || [],
          conclusion: resource.conclusion,
          presentedForm: resource.presentedForm || []
        }
      })
    }
    
    return []
  } catch (error) {
    console.error('Error fetching patient diagnostic reports:', error)
    // Return empty array for any error (404, network issues, etc.)
    return []
  }
}

export async function getPatientMedications(patientId: string): Promise<MedicationStatement[]> {
  try {
    const response = await axios.get(`/api/patient-details/medications?patientId=${patientId}`)
    
    if (response.data && response.data.entry && Array.isArray(response.data.entry)) {
      return response.data.entry.map((entry: any) => {
        const resource = entry.resource
        return {
          id: resource.id,
          status: resource.status || '',
          medicationCodeableConcept: {
            coding: resource.medicationCodeableConcept?.coding || []
          },
          subject: resource.subject || { reference: '' },
          effectiveDateTime: resource.effectiveDateTime,
          dosage: resource.dosage || [],
          note: resource.note?.[0]?.text || ''
        }
      })
    }
    
    return []
  } catch (error) {
    console.error('Error fetching patient medications:', error)
    // Return empty array for any error (404, network issues, etc.)
    return []
  }
}

// Function to create a new allergy
export async function createAllergy(patientId: string, allergyData: {
  code: string
  description: string
  clinicalStatus: string
}) {
  try {
    const response = await axios.post('/api/patient-details/allergies', {
      patientId,
      code: allergyData.code,
      description: allergyData.description,
      clinicalStatus: allergyData.clinicalStatus
    })
    
    return response.data
  } catch (error) {
    console.error('Error creating allergy:', error)
    throw error
  }
}

// Function to create a new condition
export async function createCondition(patientId: string, conditionData: {
  code: string
  clinicalStatus: string
  category: string
  severity?: string
  onsetDate?: string
  note?: string
}) {
  try {
    const response = await axios.post('/api/patient-details/conditions', {
      patientId,
      code: conditionData.code,
      clinicalStatus: conditionData.clinicalStatus,
      category: conditionData.category,
      severity: conditionData.severity,
      onsetDate: conditionData.onsetDate,
      note: conditionData.note
    })
    
    return response.data
  } catch (error) {
    console.error('Error creating condition:', error)
    throw error
  }
}

// Function to create a new diagnostic report
export async function createDiagnosticReport(patientId: string, reportData: {
  code: string
  status: string
  category: string
  effectiveDate?: string
  performer?: string
  conclusion?: string
}) {
  try {
    const response = await axios.post('/api/patient-details/diagnostic-reports', {
      patientId,
      code: reportData.code,
      status: reportData.status,
      category: reportData.category,
      effectiveDate: reportData.effectiveDate,
      performer: reportData.performer,
      conclusion: reportData.conclusion
    })
    
    return response.data
  } catch (error) {
    console.error('Error creating diagnostic report:', error)
    throw error
  }
}

// Function to create a new medication statement
export async function createMedicationStatement(patientId: string, medicationData: {
  medicationCodeableConcept: string
  status: string
  effectiveDateTime?: string
  dosage?: string
  note?: string
}) {
  try {
    const response = await axios.post('/api/patient-details/medications', {
      patientId,
      medicationCodeableConcept: medicationData.medicationCodeableConcept,
      status: medicationData.status,
      effectiveDateTime: medicationData.effectiveDateTime,
      dosage: medicationData.dosage,
      note: medicationData.note
    })
    
    return response.data
  } catch (error) {
    console.error('Error creating medication statement:', error)
    throw error
  }
}

// Combined function to get all patient details
export async function getPatientDetails(patientId: string) {
  try {
    const [allergies, conditions, diagnosticReports, medications] = await Promise.all([
      getPatientAllergies(patientId),
      getPatientConditions(patientId),
      getPatientDiagnosticReports(patientId),
      getPatientMedications(patientId)
    ])
    
    return {
      allergies,
      conditions,
      diagnosticReports,
      medications
    }
  } catch (error) {
    console.error('Error fetching patient details:', error)
    return {
      allergies: [],
      conditions: [],
      diagnosticReports: [],
      medications: []
    }
  }
}
