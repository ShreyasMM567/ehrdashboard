'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { getPatientDetails, createAllergy, createCondition, createDiagnosticReport, createMedicationStatement, Allergy, Condition, DiagnosticReport, MedicationStatement } from '@/lib/api/patientDetails'
import { Patient } from '@/types'
import { X, AlertTriangle, Activity, FileText, Pill, Loader2, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import AllergyForm from '@/components/forms/AllergyForm'
import ConditionForm from '@/components/forms/ConditionForm'
import DiagnosticReportForm from '@/components/forms/DiagnosticReportForm'
import MedicationForm from '@/components/forms/MedicationForm'

interface PatientDetailModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
}

interface PatientDetails {
  allergies: Allergy[]
  conditions: Condition[]
  diagnosticReports: DiagnosticReport[]
  medications: MedicationStatement[]
}

export default function PatientDetailModal({ isOpen, onClose, patient }: PatientDetailModalProps) {
  const [details, setDetails] = useState<PatientDetails>({
    allergies: [],
    conditions: [],
    diagnosticReports: [],
    medications: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'allergies' | 'conditions' | 'diagnosticReports' | 'medications'>('allergies')
  const [showAllergyForm, setShowAllergyForm] = useState(false)
  const [showConditionForm, setShowConditionForm] = useState(false)
  const [showDiagnosticForm, setShowDiagnosticForm] = useState(false)
  const [showMedicationForm, setShowMedicationForm] = useState(false)
  const [isCreatingAllergy, setIsCreatingAllergy] = useState(false)
  const [isCreatingCondition, setIsCreatingCondition] = useState(false)
  const [isCreatingDiagnostic, setIsCreatingDiagnostic] = useState(false)
  const [isCreatingMedication, setIsCreatingMedication] = useState(false)

  useEffect(() => {
    if (isOpen && patient) {
      fetchPatientDetails()
    }
  }, [isOpen, patient])

  const fetchPatientDetails = async () => {
    if (!patient) return
    
    setIsLoading(true)
    try {
      const patientDetails = await getPatientDetails(patient.id)
      setDetails(patientDetails)
    } catch (error) {
      console.error('Error fetching patient details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAllergy = async (data: { code: string; description: string; clinicalStatus: string }) => {
    if (!patient) return
    
    setIsCreatingAllergy(true)
    try {
      await createAllergy(patient.id, data)
      await fetchPatientDetails()
      setShowAllergyForm(false)
    } catch (error) {
      console.error('Error creating allergy:', error)
    } finally {
      setIsCreatingAllergy(false)
    }
  }

  const handleCreateCondition = async (data: { code: string; clinicalStatus: string; category: string; severity?: string; onsetDate?: string; note?: string }) => {
    if (!patient) return
    
    setIsCreatingCondition(true)
    try {
      await createCondition(patient.id, data)
      await fetchPatientDetails()
      setShowConditionForm(false)
    } catch (error) {
      console.error('Error creating condition:', error)
    } finally {
      setIsCreatingCondition(false)
    }
  }

  const handleCreateDiagnosticReport = async (data: { code: string; status: string; category: string; effectiveDate?: string; performer?: string; conclusion?: string }) => {
    if (!patient) return
    
    setIsCreatingDiagnostic(true)
    try {
      await createDiagnosticReport(patient.id, data)
      await fetchPatientDetails()
      setShowDiagnosticForm(false)
    } catch (error) {
      console.error('Error creating diagnostic report:', error)
    } finally {
      setIsCreatingDiagnostic(false)
    }
  }

  const handleCreateMedication = async (data: { medicationCodeableConcept: string; status: string; effectiveDateTime?: string; dosage?: string; note?: string }) => {
    if (!patient) return
    
    setIsCreatingMedication(true)
    try {
      await createMedicationStatement(patient.id, data)
      await fetchPatientDetails()
      setShowMedicationForm(false)
    } catch (error) {
      console.error('Error creating medication:', error)
    } finally {
      setIsCreatingMedication(false)
    }
  }

  const tabs = [
    { id: 'allergies' as const, label: 'Allergies', icon: AlertTriangle, count: details.allergies.length },
    { id: 'conditions' as const, label: 'Conditions', icon: Activity, count: details.conditions.length },
    { id: 'diagnosticReports' as const, label: 'Diagnostic Reports', icon: FileText, count: details.diagnosticReports.length },
    { id: 'medications' as const, label: 'Medications', icon: Pill, count: details.medications.length }
  ]

  const renderAllergies = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-black">Allergies</h3>
        <Button
          onClick={() => setShowAllergyForm(true)}
          size="sm"
          disabled={showAllergyForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Allergy
        </Button>
      </div>

      {showAllergyForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Allergy</CardTitle>
          </CardHeader>
          <CardContent>
            <AllergyForm
              patientId={patient?.id || ''}
              onSubmit={handleCreateAllergy}
              onCancel={() => setShowAllergyForm(false)}
              isLoading={isCreatingAllergy}
            />
          </CardContent>
        </Card>
      )}

      {details.allergies.length === 0 ? (
        <p className="text-black text-center py-8">No allergies recorded</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Allergen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Criticality</TableHead>
              <TableHead>Onset Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.allergies.map((allergy) => (
              <TableRow key={allergy.id}>
                <TableCell className="font-medium">{allergy.display}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    allergy.clinicalStatus === 'active' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {allergy.clinicalStatus}
                  </span>
                </TableCell>
                <TableCell>{allergy.category}</TableCell>
                <TableCell>{allergy.criticality}</TableCell>
                <TableCell>{allergy.onsetDateTime ? formatDate(allergy.onsetDateTime) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const renderConditions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-black">Conditions</h3>
        <Button
          onClick={() => setShowConditionForm(true)}
          size="sm"
          disabled={showConditionForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
      </div>

      {showConditionForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Condition</CardTitle>
          </CardHeader>
          <CardContent>
            <ConditionForm
              patientId={patient?.id || ''}
              onSubmit={handleCreateCondition}
              onCancel={() => setShowConditionForm(false)}
              isLoading={isCreatingCondition}
            />
          </CardContent>
        </Card>
      )}

      {details.conditions.length === 0 ? (
        <p className="text-black text-center py-8">No conditions recorded</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Onset Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.conditions.map((condition) => (
              <TableRow key={condition.id}>
                <TableCell className="font-medium">{condition.display}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    condition.clinicalStatus === 'active' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {condition.clinicalStatus}
                  </span>
                </TableCell>
                <TableCell>{condition.category}</TableCell>
                <TableCell>{condition.severity}</TableCell>
                <TableCell>{condition.onsetDateTime ? formatDate(condition.onsetDateTime) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const renderDiagnosticReports = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-black">Diagnostic Reports</h3>
        <Button
          onClick={() => setShowDiagnosticForm(true)}
          size="sm"
          disabled={showDiagnosticForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Report
        </Button>
      </div>

      {showDiagnosticForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Diagnostic Report</CardTitle>
          </CardHeader>
          <CardContent>
            <DiagnosticReportForm
              patientId={patient?.id || ''}
              onSubmit={handleCreateDiagnosticReport}
              onCancel={() => setShowDiagnosticForm(false)}
              isLoading={isCreatingDiagnostic}
            />
          </CardContent>
        </Card>
      )}

      {details.diagnosticReports.length === 0 ? (
        <p className="text-black text-center py-8">No diagnostic reports recorded</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Performer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.diagnosticReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  {report.code.coding[0]?.display || 'Unknown'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'final' ? 'bg-green-100 text-green-800' : 
                    report.status === 'preliminary' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell>{report.effectiveDateTime ? formatDate(report.effectiveDateTime) : 'N/A'}</TableCell>
                <TableCell>
                  {report.performer && report.performer.length > 0 
                    ? report.performer[0].display 
                    : 'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const renderMedications = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-black">Medications</h3>
        <Button
          onClick={() => setShowMedicationForm(true)}
          size="sm"
          disabled={showMedicationForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </div>

      {showMedicationForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Medication</CardTitle>
          </CardHeader>
          <CardContent>
            <MedicationForm
              patientId={patient?.id || ''}
              onSubmit={handleCreateMedication}
              onCancel={() => setShowMedicationForm(false)}
              isLoading={isCreatingMedication}
            />
          </CardContent>
        </Card>
      )}

      {details.medications.length === 0 ? (
        <p className="text-black text-center py-8">No medications recorded</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Dosage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.medications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell className="font-medium">
                  {medication.medicationCodeableConcept.coding[0]?.display || 'Unknown'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    medication.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {medication.status}
                  </span>
                </TableCell>
                <TableCell>{medication.effectiveDateTime ? formatDate(medication.effectiveDateTime) : 'N/A'}</TableCell>
                <TableCell>
                  {medication.dosage && medication.dosage.length > 0 
                    ? medication.dosage[0].text 
                    : 'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'allergies':
        return renderAllergies()
      case 'conditions':
        return renderConditions()
      case 'diagnosticReports':
        return renderDiagnosticReports()
      case 'medications':
        return renderMedications()
      default:
        return null
    }
  }

  if (!patient) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Patient Details - ${patient.given} ${patient.family}`} size="xl">
      <div className="space-y-6">
        {/* Patient Info Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p><strong>Patient ID:</strong> {patient.id}</p>
                <p><strong>Name:</strong> {patient.given} {patient.family}</p>
                <p><strong>Birth Date:</strong> {formatDate(patient.birthDate)}</p>
              </div>
              <div>
                <p><strong>Email:</strong> {patient.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Address:</strong></p>
                {patient.address ? (
                  <div className="text-sm">
                    {patient.address.line && patient.address.line.length > 0 && (
                      <p>{patient.address.line.join(', ')}</p>
                    )}
                    <p>
                      {patient.address.city && `${patient.address.city}, `}
                      {patient.address.state && `${patient.address.state} `}
                      {patient.address.postalCode && patient.address.postalCode}
                    </p>
                    {patient.address.country && <p>{patient.address.country}</p>}
                  </div>
                ) : (
                  <p className="text-sm">No address on file</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-black">Loading patient details...</span>
              </div>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
