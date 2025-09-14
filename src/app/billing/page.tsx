'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { BillingForm } from '@/components/forms/BillingForm'
import { InsuranceForm } from '@/components/forms/InsuranceForm'
import { CreditCard, FileText, Shield, DollarSign } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'billing' | 'insurance' | 'reports'>('billing')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data for billing records
  const mockBillingRecords = [
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
      serviceDate: '2024-01-15',
      service: 'Office Visit - Consultation',
      amount: 200,
      insuranceCoverage: 160,
      patientResponsibility: 40,
      status: 'paid',
      dueDate: '2024-02-15',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Sarah Smith',
      serviceDate: '2024-01-16',
      service: 'Annual Physical Examination',
      amount: 300,
      insuranceCoverage: 240,
      patientResponsibility: 60,
      status: 'pending',
      dueDate: '2024-02-16',
      createdAt: '2024-01-16T14:30:00Z'
    }
  ]

  const mockInsurance = [
    {
      id: '1',
      patientId: '1',
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC123456789',
      groupNumber: 'GRP001',
      subscriberName: 'John Doe',
      relationship: 'Self',
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31',
      copay: 20,
      deductible: 1000,
      isActive: true
    }
  ]

  const handleAddRecord = () => {
    setIsModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'disputed':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-black'
    }
  }

  const tabs = [
    { id: 'billing', label: 'Billing Records', icon: CreditCard },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'reports', label: 'Reports', icon: FileText }
  ]

  const getCurrentData = () => {
    switch (activeTab) {
      case 'billing':
        return mockBillingRecords
      case 'insurance':
        return mockInsurance
      default:
        return []
    }
  }

  const getFormComponent = () => {
    switch (activeTab) {
      case 'billing':
        return <BillingForm onSubmit={() => {}} onCancel={() => setIsModalOpen(false)} />
      case 'insurance':
        return <InsuranceForm onSubmit={() => {}} onCancel={() => setIsModalOpen(false)} />
      default:
        return null
    }
  }

  const getModalTitle = () => {
    switch (activeTab) {
      case 'billing':
        return 'Add Billing Record'
      case 'insurance':
        return 'Add Insurance Information'
      default:
        return 'Add Record'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Billing & Insurance</h1>
            <p className="text-black mt-2">Manage billing records, insurance, and financial reports</p>
          </div>
          {activeTab !== 'reports' && (
            <Button onClick={handleAddRecord}>
              <DollarSign className="h-4 w-4 mr-2" />
              Add {activeTab === 'billing' ? 'Billing Record' : 'Insurance'}
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Total Revenue</p>
                  <p className="text-2xl font-bold text-black">$45,230</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Pending Payments</p>
                  <p className="text-2xl font-bold text-black">$12,450</p>
                </div>
                <CreditCard className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Insurance Claims</p>
                  <p className="text-2xl font-bold text-black">89</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Overdue Accounts</p>
                  <p className="text-2xl font-bold text-black">$3,200</p>
                </div>
                <FileText className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
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
        {activeTab === 'reports' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>January 2024</span>
                    <span className="font-semibold">$45,230</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>December 2023</span>
                    <span className="font-semibold">$42,180</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>November 2023</span>
                    <span className="font-semibold">$38,950</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insurance Coverage Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Blue Cross Blue Shield</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Aetna</span>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Other</span>
                    <span className="font-semibold">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{activeTab} Records</CardTitle>
            </CardHeader>
            <CardContent>
              {getCurrentData().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-black mb-4">No {activeTab} records found</p>
                  <Button onClick={handleAddRecord}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Add First {activeTab === 'billing' ? 'Billing Record' : 'Insurance'}
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      {activeTab === 'billing' && (
                        <>
                          <TableHead>Service</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Insurance</TableHead>
                          <TableHead>Patient Due</TableHead>
                          <TableHead>Status</TableHead>
                        </>
                      )}
                      {activeTab === 'insurance' && (
                        <>
                          <TableHead>Provider</TableHead>
                          <TableHead>Policy Number</TableHead>
                          <TableHead>Copay</TableHead>
                          <TableHead>Deductible</TableHead>
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
                        <TableCell>{formatDate(record.serviceDate || record.effectiveDate)}</TableCell>
                        
                        {activeTab === 'billing' && (
                          <>
                            <TableCell>{record.service}</TableCell>
                            <TableCell>${record.amount}</TableCell>
                            <TableCell>${record.insuranceCoverage}</TableCell>
                            <TableCell>${record.patientResponsibility}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                            </TableCell>
                          </>
                        )}
                        
                        {activeTab === 'insurance' && (
                          <>
                            <TableCell>{record.provider}</TableCell>
                            <TableCell>{record.policyNumber}</TableCell>
                            <TableCell>${record.copay}</TableCell>
                            <TableCell>${record.deductible}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                record.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-black'
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
        )}

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
