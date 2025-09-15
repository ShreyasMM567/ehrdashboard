import useSWR from 'swr'
import { getPatients, getPatient, createPatient, updatePatient, deletePatient, searchPatientById } from '@/lib/api/patients'
import { Patient } from '@/types'

export function usePatients() {
  const { data, error, isLoading, mutate } = useSWR<Patient[]>('patients', getPatients)
  
  return {
    patients: data || [],
    isLoading,
    error,
    mutate
  }
}

export function usePatient(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Patient | null>(
    id ? `patient-${id}` : null,
    () => getPatient(id)
  )
  
  return {
    patient: data,
    isLoading,
    error,
    mutate
  }
}

export function usePatientMutations() {
  const { mutate } = useSWR('patients')
  
  const create = async (patient: Omit<Patient, 'id'>) => {
    const newPatient = await createPatient(patient)
    mutate()
    return newPatient
  }
  
  const update = async (id: string, updates: Partial<Patient>) => {
    const updatedPatient = await updatePatient(id, updates)
    mutate()
    mutate(`patient-${id}`)
    return updatedPatient
  }
  
  const remove = async (id: string) => {
    const success = await deletePatient(id)
    if (success) {
      mutate()
      mutate(`patient-${id}`, null, false)
    }
    return success
  }
  
  return { create, update, remove }
}

export function usePatientSearch(searchId: string) {
  const { data, error, isLoading, mutate } = useSWR<Patient | null>(
    searchId ? `patient-search-${searchId}` : null,
    () => searchPatientById(searchId)
  )
  
  return {
    searchResult: data,
    isSearching: isLoading,
    searchError: error,
    mutate
  }
}
