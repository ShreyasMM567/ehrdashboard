'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Plus, Calendar, Clock, User, MapPin, Loader2, Edit, MoreHorizontal } from 'lucide-react'
import { getAppointments, getAppointment, createAppointment, updateAppointment } from '@/lib/api/appointments'
import { Appointment } from '@/types'
import SearchBox from '@/components/ui/SearchBox'
import { AppointmentDetailModal } from '@/components/modals/AppointmentDetailModal'
import { Modal } from '@/components/ui/Modal'
import AppointmentBookingForm from '@/components/forms/AppointmentBookingForm'
import AppointmentEditForm from '@/components/forms/AppointmentEditForm'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Appointment[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] = useState<Appointment | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAppointmentForEdit, setSelectedAppointmentForEdit] = useState<Appointment | null>(null)
  const [isUpdatingAppointment, setIsUpdatingAppointment] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAppointments()
      setAppointments(data)
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError('Failed to load appointments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const appointment = await getAppointment(query.trim())
      if (appointment) {
        setSearchResults([appointment])
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error searching appointment:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleViewAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointmentForDetails(appointment)
    setIsDetailModalOpen(true)
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedAppointmentForDetails(null)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointmentForEdit(appointment)
    setEditError(null)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedAppointmentForEdit(null)
    setEditError(null)
  }

  const handleBookAppointment = () => {
    setBookingError(null)
    setIsBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setIsBookingModalOpen(false)
    setBookingError(null)
  }

  const handleCreateAppointment = async (data: {
    patientId: string
    practitionerId: string
    startDateTime: string
    endDateTime: string
    minutesDuration?: number
  }) => {
    setIsCreatingAppointment(true)
    setBookingError(null)
    
    try {
      await createAppointment(data)
      // Refresh the appointments list
      await fetchAppointments()
      setIsBookingModalOpen(false)
    } catch (error: unknown) {
      console.error('Error creating appointment:', error)
      const errorObj = error as any
      setBookingError(errorObj.message || 'Failed to create appointment')
    } finally {
      setIsCreatingAppointment(false)
    }
  }

  const handleUpdateAppointment = async (data: {
    status: string
    start: string
    end: string
    minutesDuration: number
  }) => {
    if (!selectedAppointmentForEdit) return
    
    setIsUpdatingAppointment(true)
    setEditError(null)
    
    try {
      await updateAppointment(selectedAppointmentForEdit.id, data)
      // Refresh the appointments list
      await fetchAppointments()
      setIsEditModalOpen(false)
    } catch (error: unknown) {
      console.error('Error updating appointment:', error)
      const errorObj = error as any
      setEditError(errorObj.message || 'Failed to update appointment')
    } finally {
      setIsUpdatingAppointment(false)
    }
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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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

  // Calculate stats
  const totalAppointments = appointments.length
  const today = new Date().toDateString()
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start).toDateString()
    return aptDate === today
  }).length
  
  const confirmedAppointments = appointments.filter(apt => 
    apt.status.toLowerCase() === 'confirmed'
  ).length
  
  const pendingAppointments = appointments.filter(apt => 
    ['scheduled', 'booked'].includes(apt.status.toLowerCase())
  ).length

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-black">Loading appointments...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchAppointments}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Appointments</h1>
          <p className="text-black mt-1">Manage patient appointments and scheduling</p>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBox
            placeholder="Search by appointment ID..."
            onSearch={handleSearch}
          />
          <Button onClick={handleBookAppointment}>
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Total Appointments</p>
                <p className="text-2xl font-bold text-black">{totalAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Scheduled Today</p>
                <p className="text-2xl font-bold text-black">{todayAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Confirmed</p>
                <p className="text-2xl font-bold text-black">{confirmedAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Pending</p>
                <p className="text-2xl font-bold text-black">{pendingAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black">All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const displayAppointments = searchQuery ? searchResults : appointments
            const hasResults = displayAppointments.length > 0
            
            if (searchQuery && !hasResults && !isSearching) {
              return (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-black">No appointment found with ID &quot;{searchQuery}&quot;</p>
                  <p className="text-black text-sm mt-1">Try searching with a different appointment ID</p>
                </div>
              )
            }
            
            if (!searchQuery && appointments.length === 0) {
              return (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-black">No appointments scheduled</p>
                  <p className="text-black text-sm mt-1">Book your first appointment to get started</p>
                </div>
              )
            }
            
            return (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appointment ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Practitioner</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayAppointments.map((appointment) => {
                  const { date, time } = formatDateTime(appointment.start)
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium text-black">
                        {appointment.id}
                      </TableCell>
                      <TableCell className="text-black">
                        <div>
                          <div>{date}</div>
                          <div className="text-sm text-gray-600">{time}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-black">
                        {formatDuration(appointment.minutesDuration)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-black">
                        {appointment.patientName || 'Unknown Patient'}
                      </TableCell>
                      <TableCell className="text-black">
                        {appointment.practitionerName || 'Unknown Practitioner'}
                      </TableCell>
                      <TableCell className="text-black">
                        {appointment.serviceType || 'N/A'}
                      </TableCell>
                      <TableCell className="text-black">
                        {appointment.location || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditAppointment(appointment)}
                            title="Edit Appointment"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewAppointmentDetails(appointment)}
                            title="View Details"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            )
          })()}
        </CardContent>
      </Card>

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        appointment={selectedAppointmentForDetails}
      />

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        title="Book New Appointment"
        size="lg"
      >
        <AppointmentBookingForm
          onSubmit={handleCreateAppointment}
          onCancel={closeBookingModal}
          isLoading={isCreatingAppointment}
          error={bookingError}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Appointment"
        size="lg"
      >
        <AppointmentEditForm
          appointment={selectedAppointmentForEdit}
          onSubmit={handleUpdateAppointment}
          onCancel={closeEditModal}
          isLoading={isUpdatingAppointment}
          error={editError}
        />
      </Modal>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}