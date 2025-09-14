'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { VitalsForm } from '@/components/forms/VitalsForm'
import { AllergyForm } from '@/components/forms/AllergyForm'
import { MedicationForm } from '@/components/forms/MedicationForm'
import { usePatients } from '@/hooks/usePatients'
import { Plus, Heart, AlertTriangle, Pill } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ClinicalPage() {
  const { patients } = usePatients()
  const [activeTab, setActiveTab] = useState<'vitals' | 'allergies' | 'medications'>('vitals')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string>('')

  // Mock data for clinical records
  const mockVitals = [
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
      date: '2024-01-15',
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 72,
      temperature: 98.6,
      weight: 175,
      height: 70,
      bmi: 25.1,
      oxygenSaturation: 98,
      notes: 'All vitals within normal range'
    }
  ]

  const mockAllergies = [
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
      allergen: 'Penicillin',
      severity: 'severe',
      reaction: 'Hives and difficulty breathing',
      notes: 'Patient carries EpiPen',
      createdAt: '2024-01-15T10:00:00Z'
    }
  ]

  const mockMedications = [
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2024-01-01',
      prescribedBy: 'Dr. Johnson',
      notes: 'For blood pressure management',
      isActive: true
    }
  ]

  const handleAddRecord = () => {
    setIsModalOpen(true)
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'vitals':
        return mockVitals
      case 'allergies':
        return mockAllergies
      case 'medications':
        return mockMedications
      default:
        return []
    }
  }

  const getFormComponent = () => {
    switch (activeTab) {
      case 'vitals':
        return <VitalsForm onSubmit={() => {}} onCancel={() => setIsModalOpen(false)} />
      case 'allergies':
        return <AllergyForm onSubmit={() => {}} onCancel={() => setIsModalOpen(false)} />
      case 'medications':
        return <MedicationForm onSubmit={() => {}} onCancel={() => setIsModalOpen(false)} />
      default:
        return null
    }
  }

  const getModalTitle = () => {
    switch (activeTab) {
      case 'vitals':
        return 'Add Vitals Record'
      case 'allergies':
        return 'Add Allergy'
      case 'medications':
        return 'Add Medication'
      default:
        return 'Add Record'
    }
  }

  const tabs = [
    { id: 'vitals', label: 'Vitals', icon: Heart },
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
    { id: 'medications', label: 'Medications', icon: Pill }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clinical Records</h1>
            <p className="text-gray-600 mt-2">Manage patient clinical data and medical records</p>
          </div>
          <Button onClick={handleAddRecord}>
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab === 'vitals' ? 'Vitals' : activeTab === 'allergies' ? 'Allergy' : 'Medication'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{activeTab} Records</CardTitle>
          </CardHeader>
          <CardContent>
            {getCurrentData().length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No {activeTab} records found</p>
                <Button onClick={handleAddRecord}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First {activeTab === 'vitals' ? 'Vitals' : activeTab === 'allergies' ? 'Allergy' : 'Medication'}
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    {activeTab === 'vitals' && (
                      <>
                        <TableHead>Blood Pressure</TableHead>
                        <TableHead>Heart Rate</TableHead>
                        <TableHead>Temperature</TableHead>
                        <TableHead>Weight</TableHead>
                      </>
                    )}
                    {activeTab === 'allergies' && (
                      <>
                        <TableHead>Allergen</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Reaction</TableHead>
                      </>
                    )}
                    {activeTab === 'medications' && (
                      <>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Status</TableHead>
                      </>
                    )}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentData().map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.patientName}</TableCell>
                      <TableCell>{formatDate(record.date || record.startDate || record.createdAt)}</TableCell>
                      
                      {activeTab === 'vitals' && (
                        <>
                          <TableCell>{record.bloodPressure.systolic}/{record.bloodPressure.diastolic}</TableCell>
                          <TableCell>{record.heartRate} bpm</TableCell>
                          <TableCell>{record.temperature}°F</TableCell>
                          <TableCell>{record.weight} lbs</TableCell>
                        </>
                      )}
                      
                      {activeTab === 'allergies' && (
                        <>
                          <TableCell>{record.allergen}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.severity === 'severe' ? 'bg-red-100 text-red-800' :
                              record.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {record.severity}
                            </span>
                          </TableCell>
                          <TableCell>{record.reaction}</TableCell>
                        </>
                      )}
                      
                      {activeTab === 'medications' && (
                        <>
                          <TableCell>{record.name}</TableCell>
                          <TableCell>{record.dosage}</TableCell>
                          <TableCell>{record.frequency}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {record.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                        </>
                      )}
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Delete
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

        {/* Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={getModalTitle()}
          size="lg"
        >
          {getFormComponent()}
        </Modal>
      </div>
    </DashboardLayout>
  )
}
