import useSWR from 'swr'
import { getAppointments, getAppointment, createAppointment, updateAppointment } from '@/lib/api/appointments'
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
    const appointmentData = {
      patientId: appointment.patientId || '',
      practitionerId: appointment.practitionerId || '',
      startDateTime: appointment.start,
      endDateTime: appointment.end,
      minutesDuration: appointment.minutesDuration
    }
    const newAppointment = await createAppointment(appointmentData)
    mutate()
    return newAppointment
  }
  
  const update = async (id: string, updates: Partial<Appointment>) => {
    const updatedAppointment = await updateAppointment(id, updates)
    mutate()
    mutate(`appointment-${id}`)
    return updatedAppointment
  }
  
  return { create, update }
}
