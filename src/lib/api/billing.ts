import axios from 'axios'
import { getPatient } from './patients'

export interface AccountInfo {
  id: string
  patientId: string
  patientName: string
  outstandingBalance: number
  unusedFunds: number
  status: string
  description?: string
}

export interface CoverageInfo {
  id: string
  patientId: string
  subscriberId: string
  payor: string
  class: string
  type: string
  status: string
  network?: string
  costToBeneficiary?: {
    type: string
    value: number
    currency: string
  }
  period?: {
    start: string
    end: string
  }
}

export async function getAccountInfo(patientId: string): Promise<AccountInfo | null> {
  try {
    const response = await axios.get(`/api/account?patient=${patientId}`)
    
    console.log('Account API Response:', JSON.stringify(response.data, null, 2))
    
    // Handle FHIR Bundle response format
    if (response.data && response.data.entry && Array.isArray(response.data.entry) && response.data.entry.length > 0) {
      const resource = response.data.entry[0].resource
      
      console.log('Account Resource:', JSON.stringify(resource, null, 2))
      
      // Extract outstanding balance from array
      const outstandingBalance = resource.outstandingBalance?.[0]?.value || 0
      
      // Extract unused funds from array
      const unusedFunds = resource.unusedFunds?.[0]?.value || 0
      
      // Get patient ID from subject reference
      const patientIdFromResource = resource.subject?.[0]?.reference?.split('/').pop() || patientId
      
      // Fetch patient details to get the actual patient name
      let patientName = `Patient ${patientIdFromResource}`
      try {
        const patient = await getPatient(patientIdFromResource)
        if (patient && (patient.given || patient.family)) {
          patientName = `${patient.given || ''} ${patient.family || ''}`.trim()
        }
        console.log('Patient details fetched:', patient)
      } catch (patientError) {
        console.warn('Could not fetch patient details:', patientError)
        // Continue with default patient name
      }
      
      const accountInfo = {
        id: resource.id,
        patientId: patientIdFromResource,
        patientName: patientName,
        outstandingBalance: outstandingBalance,
        unusedFunds: unusedFunds,
        status: resource.status || 'active',
        description: resource.businessUnitName?.[0] || undefined
      }
      
      console.log('Parsed Account Info:', accountInfo)
      
      return accountInfo
    }
    
    return null
  } catch (error) {
    console.error('Error fetching account info:', error)
    return null
  }
}

export async function getCoverageInfo(patientId: string): Promise<CoverageInfo[]> {
  try {
    const response = await axios.get(`/api/coverage?patient=${patientId}`)
    
    console.log('Coverage API Response:', JSON.stringify(response.data, null, 2))
    
    // Handle FHIR Bundle response format
    if (response.data && response.data.entry && Array.isArray(response.data.entry)) {
      return response.data.entry.map((entry: any) => {
        const resource = entry.resource
        
        console.log('Coverage Resource:', JSON.stringify(resource, null, 2))
        
        // Extract plan and group values from class array
        const planClass = resource.class?.find((cls: any) => cls.type?.coding?.[0]?.code === 'plan')
        const groupClass = resource.class?.find((cls: any) => cls.type?.coding?.[0]?.code === 'group')
        
        const planValue = planClass?.value || ''
        const groupValue = groupClass?.value || ''
        
        // Get relationship information
        const relationship = resource.relationship?.coding?.[0]?.display || resource.relationship?.text || 'Unknown'
        
        // Get policy holder name
        const policyHolder = resource.policyHolder?.display || 'Unknown'
        
        const coverageInfo = {
          id: resource.id,
          patientId: resource.beneficiary?.reference?.split('/').pop() || patientId,
          subscriberId: planValue, // Using plan value as subscriber ID
          payor: policyHolder, // Using policy holder as payor
          class: groupValue, // Using group value as class
          type: relationship, // Using relationship as type
          status: resource.status || 'unknown',
          network: undefined, // Not available in this response
          costToBeneficiary: undefined, // Not available in this response
          period: undefined // Not available in this response
        }
        
        console.log('Parsed Coverage Info:', coverageInfo)
        
        return coverageInfo
      })
    }
    
    return []
  } catch (error) {
    console.error('Error fetching coverage info:', error)
    return []
  }
}