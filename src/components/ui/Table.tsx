import React from 'react'
import { cn } from '@/lib/utils'

interface TableProps {
  children: React.ReactNode
  className?: string
}

interface TableHeaderProps {
  children: React.ReactNode
  className?: string
}

interface TableBodyProps {
  children: React.ReactNode
  className?: string
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
}

interface TableHeadProps {
  children: React.ReactNode
  className?: string
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props}>
      {children}
    </thead>
  )
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    >
      {children}
    </tbody>
  )
)
TableBody.displayName = 'TableBody'

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-black [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 align-middle text-black [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    >
      {children}
    </td>
  )
)
TableCell.displayName = 'TableCell'

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
}
