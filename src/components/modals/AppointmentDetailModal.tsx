'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Appointment, Patient } from '@/types'
import { Calendar, User, FileText, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getPatient } from '@/lib/api/patients'
import { getPractitioner } from '@/lib/api/practitioners'

interface AppointmentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: Appointment | null
}

export function AppointmentDetailModal({ isOpen, onClose, appointment }: AppointmentDetailModalProps) {
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null)
  const [practitionerDetails, setPractitionerDetails] = useState<any>(null)
  const [isLoadingPatient, setIsLoadingPatient] = useState(false)
  const [isLoadingPractitioner, setIsLoadingPractitioner] = useState(false)

  useEffect(() => {
    if (isOpen && appointment) {
      fetchPatientAndPractitionerDetails()
    }
  }, [isOpen, appointment])

  const fetchPatientAndPractitionerDetails = async () => {
    if (!appointment) return

    // Fetch patient details
    if (appointment.patientId) {
      setIsLoadingPatient(true)
      try {
        const patient = await getPatient(appointment.patientId)
        setPatientDetails(patient)
      } catch (error) {
        console.error('Error fetching patient details:', error)
        setPatientDetails(null)
      } finally {
        setIsLoadingPatient(false)
      }
    }

    // Fetch practitioner details
    if (appointment.practitionerId) {
      setIsLoadingPractitioner(true)
      try {
        const practitioner = await getPractitioner(appointment.practitionerId)
        setPractitionerDetails(practitioner)
      } catch (error) {
        console.error('Error fetching practitioner details:', error)
        setPractitionerDetails(null)
      } finally {
        setIsLoadingPractitioner(false)
      }
    }
  }

  if (!appointment) return null

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime)
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    } catch {
      return { date: 'Invalid Date', time: 'Invalid Time' }
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'booked':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800'
      case 'arrived':
        return 'bg-purple-100 text-purple-800'
      case 'in-progress':
        return 'bg-orange-100 text-orange-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const { date, time } = formatDateTime(appointment.start)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Appointment Details" size="lg">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Appointment Info Header */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-4 w-4 mr-2" />
              Appointment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p><strong>Appointment ID:</strong> {appointment.id}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </p>
                <p><strong>Service Type:</strong> {appointment.serviceType || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Duration:</strong> {formatDuration(appointment.minutesDuration)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <User className="h-4 w-4 mr-2" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-black mb-1">Patient</h4>
                {isLoadingPatient ? (
                  <div className="flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    <span className="text-gray-600">Loading patient details...</span>
                  </div>
                ) : patientDetails ? (
                  <div>
                    <p className="text-black font-medium">{patientDetails.given} {patientDetails.family}</p>
                    <p className="text-xs text-gray-600">ID: {patientDetails.id}</p>
                    <p className="text-xs text-gray-600">Email: {patientDetails.email || 'N/A'}</p>
                    <p className="text-xs text-gray-600">Phone: {patientDetails.phone || 'N/A'}</p>
                    <p className="text-xs text-gray-600">DOB: {formatDate(patientDetails.birthDate)}</p>
                  </div>
                ) : (
                  <p className="text-black">{appointment.patientName || 'Unknown Patient'}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-black mb-1">Practitioner</h4>
                {isLoadingPractitioner ? (
                  <div className="flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    <span className="text-gray-600">Loading practitioner details...</span>
                  </div>
                ) : practitionerDetails ? (
                  <div>
                    <p className="text-black font-medium">{practitionerDetails.name}</p>
                    <p className="text-xs text-gray-600">ID: {practitionerDetails.id}</p>
                    {practitionerDetails.email && (
                      <p className="text-xs text-gray-600">Email: {practitionerDetails.email}</p>
                    )}
                    {practitionerDetails.phone && (
                      <p className="text-xs text-gray-600">Phone: {practitionerDetails.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-black">{appointment.practitionerName || 'Unknown Practitioner'}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-black mb-1">Location</h4>
                <p className="text-black">{appointment.location || 'No location specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        {appointment.description && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-4 w-4 mr-2" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-black text-sm">{appointment.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm">
            Edit Appointment
          </Button>
        </div>
      </div>
    </Modal>
  )
}
