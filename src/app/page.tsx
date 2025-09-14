import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, Calendar, Stethoscope, CreditCard } from 'lucide-react'

export default function Home() {
  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Appointments Today',
      value: '24',
      change: '+3',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Clinical Notes',
      value: '89',
      change: '+7%',
      icon: Stethoscope,
      color: 'text-purple-600'
    },
    {
      title: 'Pending Bills',
      value: '$12,450',
      change: '-5%',
      icon: CreditCard,
      color: 'text-orange-600'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your EHR Integration Dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.change} from last month</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-600">10:00 AM - Consultation</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Confirmed
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Sarah Smith</p>
                    <p className="text-sm text-gray-600">2:30 PM - Checkup</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Scheduled
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="font-medium">Add Patient</p>
                  <p className="text-sm text-gray-600">Register new patient</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Calendar className="h-6 w-6 text-green-600 mb-2" />
                  <p className="font-medium">Book Appointment</p>
                  <p className="text-sm text-gray-600">Schedule new visit</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Stethoscope className="h-6 w-6 text-purple-600 mb-2" />
                  <p className="font-medium">Add Clinical Note</p>
                  <p className="text-sm text-gray-600">Record patient data</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <CreditCard className="h-6 w-6 text-orange-600 mb-2" />
                  <p className="font-medium">Process Payment</p>
                  <p className="text-sm text-gray-600">Handle billing</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
    </DashboardLayout>
  )
}
