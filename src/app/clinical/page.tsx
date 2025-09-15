'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { VitalsForm } from '@/components/forms/VitalsForm'
import AllergyForm from '@/components/forms/AllergyForm'
import MedicationForm from '@/components/forms/MedicationForm'
import { Plus, Heart, AlertTriangle, Pill } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ClinicalPage() {
  const [activeTab, setActiveTab] = useState<'vitals' | 'allergies' | 'medications'>('vitals')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatient] = useState<string>('')

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
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Jane Smith',
      date: '2024-01-14',
      bloodPressure: { systolic: 110, diastolic: 70 },
      heartRate: 68,
      temperature: 98.4,
      weight: 140,
      height: 65,
      bmi: 23.3,
      oxygenSaturation: 99,
      notes: 'Patient reports feeling well'
    },
    {
      id: '3',
      patientId: '3',
      patientName: 'Michael Johnson',
      date: '2024-01-13',
      bloodPressure: { systolic: 135, diastolic: 85 },
      heartRate: 78,
      temperature: 98.8,
      weight: 190,
      height: 72,
      bmi: 25.8,
      oxygenSaturation: 97,
      notes: 'Slightly elevated blood pressure, monitor closely'
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
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Jane Smith',
      allergen: 'Shellfish',
      severity: 'moderate',
      reaction: 'Nausea and skin rash',
      notes: 'Avoid all shellfish products',
      createdAt: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      patientId: '3',
      patientName: 'Michael Johnson',
      allergen: 'Latex',
      severity: 'mild',
      reaction: 'Skin irritation',
      notes: 'Use non-latex gloves during procedures',
      createdAt: '2024-01-08T09:15:00Z'
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
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Jane Smith',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2023-12-15',
      prescribedBy: 'Dr. Williams',
      notes: 'For type 2 diabetes management',
      isActive: true
    },
    {
      id: '3',
      patientId: '3',
      patientName: 'Michael Johnson',
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      startDate: '2023-11-20',
      prescribedBy: 'Dr. Brown',
      notes: 'For cholesterol management',
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
        return <AllergyForm 
          patientId={selectedPatient} 
          onSubmit={async () => {}} 
          onCancel={() => setIsModalOpen(false)} 
        />
      case 'medications':
        return <MedicationForm patientId={selectedPatient} onSubmit={async () => {}} onCancel={() => setIsModalOpen(false)} />
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
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Clinical Records</h1>
            <p className="text-black mt-2">Manage patient clinical data and medical records</p>
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
                  onClick={() => setActiveTab(tab.id as "vitals" | "allergies" | "medications")}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
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
                <p className="text-black mb-4">No {activeTab} records found</p>
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
                  {getCurrentData().map((record: unknown) => {
                    const recordObj = record as any
                    return (
                    <TableRow key={recordObj.id}>
                      <TableCell className="font-medium">{recordObj.patientName}</TableCell>
                      <TableCell>{formatDate(recordObj.date || recordObj.startDate || recordObj.createdAt)}</TableCell>
                      
                      {activeTab === 'vitals' && (
                        <>
                          <TableCell>{recordObj.bloodPressure.systolic}/{recordObj.bloodPressure.diastolic}</TableCell>
                          <TableCell>{recordObj.heartRate} bpm</TableCell>
                          <TableCell>{recordObj.temperature}°F</TableCell>
                          <TableCell>{recordObj.weight} lbs</TableCell>
                        </>
                      )}
                      
                      {activeTab === 'allergies' && (
                        <>
                          <TableCell>{recordObj.allergen}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              recordObj.severity === 'severe' ? 'bg-red-100 text-red-800' :
                              recordObj.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {recordObj.severity}
                            </span>
                          </TableCell>
                          <TableCell>{recordObj.reaction}</TableCell>
                        </>
                      )}
                      
                      {activeTab === 'medications' && (
                        <>
                          <TableCell>{recordObj.name}</TableCell>
                          <TableCell>{recordObj.dosage}</TableCell>
                          <TableCell>{recordObj.frequency}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              recordObj.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-black'
                            }`}>
                              {recordObj.isActive ? 'Active' : 'Inactive'}
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
                    )
                  })}
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
    </ProtectedRoute>
  )
}
