import useSWR from 'swr'
import { getAccountInfo, getCoverageInfo, AccountInfo, CoverageInfo } from '@/lib/api/billing'

export function useAccountInfo(patientId: string) {
  const { data, error, isLoading, mutate } = useSWR<AccountInfo | null>(
    patientId ? `account-${patientId}` : null,
    () => getAccountInfo(patientId)
  )
  
  return {
    accountInfo: data,
    isLoading,
    error,
    mutate
  }
}

export function useCoverageInfo(patientId: string) {
  const { data, error, isLoading, mutate } = useSWR<CoverageInfo[]>(
    patientId ? `coverage-${patientId}` : null,
    () => getCoverageInfo(patientId)
  )
  
  return {
    coverageInfo: data || [],
    isLoading,
    error,
    mutate
  }
}
