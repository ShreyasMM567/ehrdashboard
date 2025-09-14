import useSWR from 'swr'
import { getAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment } from '@/lib/api/appointments'
import { Appointment } from '@/types'

export function useAppointments() {
  const { data, error, isLoading, mutate } = useSWR<Appointment[]>('appointments', getAppointments)
  
  return {
    appointments: data || [],
    isLoading,
    error,
    mutate
  }
}

export function useAppointment(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Appointment | null>(
    id ? `appointment-${id}` : null,
    () => getAppointment(id)
  )
  
  return {
    appointment: data,
    isLoading,
    error,
    mutate
  }
}

export function useAppointmentMutations() {
  const { mutate } = useSWR('appointments')
  
  const create = async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAppointment = await createAppointment(appointment)
    mutate()
    return newAppointment
  }
  
  const update = async (id: string, updates: Partial<Appointment>) => {
    const updatedAppointment = await updateAppointment(id, updates)
    mutate()
    mutate(`appointment-${id}`)
    return updatedAppointment
  }
  
  const remove = async (id: string) => {
    const success = await deleteAppointment(id)
    if (success) {
      mutate()
      mutate(`appointment-${id}`, null, false)
    }
    return success
  }
  
  return { create, update, remove }
}
