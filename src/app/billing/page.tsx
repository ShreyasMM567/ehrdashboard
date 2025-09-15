'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Search, CreditCard as CreditCardIcon, Shield as ShieldIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import SearchBox from '@/components/ui/SearchBox'
import { useAccountInfo, useCoverageInfo } from '@/hooks/useBilling'

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedPatientId, setSearchedPatientId] = useState('')
  
  // Use hooks to fetch account and coverage info
  const { accountInfo, isLoading: accountLoading, error: accountError } = useAccountInfo(searchedPatientId)
  const { coverageInfo, isLoading: coverageLoading, error: coverageError } = useCoverageInfo(searchedPatientId)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setSearchedPatientId(query.trim())
    } else {
      setSearchedPatientId('')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Billing & Insurance</h1>
            <p className="text-black mt-2">Search patient billing and insurance information</p>
          </div>
        </div>

        {/* Search Box */}
        <Card>
          <CardContent className="pt-6">
            <div className="max-w-md">
              <SearchBox
                placeholder="Search by patient ID..."
                onSearch={handleSearch}
                debounceMs={500}
              />
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-2">
                  {accountLoading || coverageLoading ? 'Searching...' : 
                   accountError || coverageError ? 'Error loading patient information' : 
                   accountInfo || coverageInfo.length > 0 ? `Found information for patient ${searchQuery}` :
                   'No billing information found for this patient'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        {accountInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Patient Name</p>
                  <p className="text-lg font-semibold text-black">{accountInfo.patientName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                  <p className="text-lg font-semibold text-red-600">${accountInfo.outstandingBalance.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Unused Funds</p>
                  <p className="text-lg font-semibold text-green-600">${accountInfo.unusedFunds.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(accountInfo.status)}`}>
                    {accountInfo.status}
                  </span>
                </div>
              </div>
              {accountInfo.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                  <p className="text-sm text-gray-800">{accountInfo.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Coverage Information */}
        {coverageInfo.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                Insurance Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subscriber ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost to Beneficiary</TableHead>
                    <TableHead>Period</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coverageInfo.map((coverage) => (
                    <TableRow key={coverage.id}>
                      <TableCell className="font-medium">{coverage.payor}</TableCell>
                      <TableCell>{coverage.type}</TableCell>
                      <TableCell>{coverage.class}</TableCell>
                      <TableCell>{coverage.subscriberId}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(coverage.status)}`}>
                          {coverage.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {coverage.costToBeneficiary ? (
                          <span>
                            {coverage.costToBeneficiary.type}: ${coverage.costToBeneficiary.value.toFixed(2)} {coverage.costToBeneficiary.currency}
                          </span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {coverage.period ? (
                          <div className="text-sm">
                            <div>Start: {formatDate(coverage.period.start)}</div>
                            <div>End: {formatDate(coverage.period.end)}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {searchQuery && !accountLoading && !coverageLoading && !accountInfo && coverageInfo.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Information Found</h3>
              <p className="text-gray-600">
                No billing or insurance information found for patient ID: <span className="font-medium">{searchQuery}</span>
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
