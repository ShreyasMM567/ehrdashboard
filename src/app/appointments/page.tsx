'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { AppointmentForm } from '@/components/forms/AppointmentForm'
import { useAppointments, useAppointmentMutations } from '@/hooks/useAppointments'
import { Appointment } from '@/types'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'

export default function AppointmentsPage() {
  const { appointments, isLoading, error } = useAppointments()
  const { create, update, remove } = useAppointmentMutations()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleBookAppointment = () => {
    setSelectedAppointment(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDeleteAppointment = async (appointment: Appointment) => {
    if (window.confirm(`Are you sure you want to cancel this appointment with ${appointment.patientName}?`)) {
      await remove(appointment.id)
    }
  }

  const handleSubmit = async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (isEditing && selectedAppointment) {
      await update(selectedAppointment.id, data)
    } else {
      await create(data)
    }
    setIsModalOpen(false)
    setSelectedAppointment(null)
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-black'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'no-show':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-black'
    }
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading appointments</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Appointments</h1>
            <p className="text-black mt-2">Manage patient appointments and scheduling</p>
          </div>
          <Button onClick={handleBookAppointment}>
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-black">Loading appointments...</div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-black mb-4">No appointments scheduled</p>
                <Button onClick={handleBookAppointment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Book First Appointment
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.patientName}
                      </TableCell>
                      <TableCell>{appointment.providerName}</TableCell>
                      <TableCell>
                        <div>
                          <div>{formatDate(appointment.date)}</div>
                          <div className="text-sm text-black">
                            {appointment.time} ({appointment.duration} min)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{appointment.type}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAppointment(appointment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAppointment(appointment)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Appointment Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedAppointment(null)
            setIsEditing(false)
          }}
          title={isEditing ? 'Edit Appointment' : 'Book New Appointment'}
          size="lg"
        >
          <AppointmentForm
            appointment={selectedAppointment}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false)
              setSelectedAppointment(null)
              setIsEditing(false)
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}
