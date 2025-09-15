# EHR Dashboard - Architecture & Application Documentation

## ⚠️ **IMPORTANT DEVELOPMENT CONSTRAINTS & LIMITATIONS**

### 🌍 **Regional API Restrictions**
- **ModMed API is region-locked to the United States**
- **VPN connection to USA required for development and testing**
- All API calls will fail without proper VPN connection
- This is a critical requirement for any development or deployment

### 🚫 **API Functionality Limitations**

#### **Appointment Management Issues**
- **POST/PUT routes for appointments are partially functional**
- The API expects specific codes that are not documented in the provided API documentation
- Appointment creation and updates may fail due to missing required code parameters
- This affects the core appointment booking functionality

#### **Data Availability Constraints**
- **Allergy records**: No actual data available in the API - cannot create or display allergy information
- **Patient clinical details**: Limited to basic patient information only
- **Diagnostic reports**: API contains no records for diagnostic data
- **Medication records**: No medication data available in the API
- **Condition tracking**: No condition data exists in the API

### 🔧 **Development Impact**
These limitations significantly impact the application's functionality:
- Many features appear implemented but will not work with actual data
- UI components are built but cannot display real clinical information
- Form submissions for clinical data will fail or return empty results
- Testing requires understanding these API constraints

---

## Overview

The EHR Dashboard is a modern healthcare management application built with Next.js 15, React 19, and TypeScript. It provides a comprehensive interface for managing patient records, appointments, billing, and clinical data through integration with external FHIR-compliant APIs.

**Note**: Due to the API limitations mentioned above, this application serves as a demonstration of architecture and integration patterns rather than a fully functional clinical system.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   FHIR API      │
│                 │    │                 │    │                 │
│ • React 19      │    │ • NextAuth.js   │    │ • Patient Data  │
│ • TypeScript    │    │ • JWT Auth      │    │ • Appointments  │
│ • SWR Caching   │    │ • Middleware    │    │ • Billing       │
│ • Tailwind CSS  │    │ • Error Handling│    │ • Clinical Data │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with JWT strategy
- **State Management**: SWR for data fetching and caching
- **API Integration**: Axios for HTTP requests
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest, React Testing Library

## 🔄 Integration Architecture

### ⚠️ **Critical Integration Limitations**

Before diving into the integration details, it's essential to understand the significant constraints:

#### **Regional Access Requirements**
- **ModMed API requires USA VPN connection** for all development and testing
- Without VPN, all API calls will return connection errors
- This is a hard requirement that cannot be bypassed

#### **Functional Limitations**
- **Appointment POST/PUT operations**: Partially broken due to undocumented required codes
- **Clinical data endpoints**: Return empty results as no data exists in the API
- **Allergy/Medication/Condition APIs**: Cannot create or retrieve actual data
- **Diagnostic reports**: No real data available for testing or display

### 1. API Integration Flow

The application follows a three-tier integration pattern, **with the understanding that many endpoints will not return actual data**:

#### External FHIR API Integration
```typescript
// API Route Layer (src/app/api/)
export const GET = createAuthenticatedHandler(async (request: NextRequest, token) => {
  const { apiKey, accessToken } = getApiCredentialsFromRequest(request)
  
  const response = await axios.get(
    `${API_BASE_URL}/${API_URL_PREFIX}/ema/fhir/v2/Patient`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    }
  )
  
  return NextResponse.json(response.data)
})
```

#### Data Transformation Layer
```typescript
// Client API Layer (src/lib/api/)
export async function getPatients(params?: PaginationParams): Promise<PaginatedResponse<Patient>> {
  const response = await axios.get(`/api/patients?${queryParams.toString()}`)
  
  // Transform FHIR Bundle to application format
  if (response.data && response.data.entry && Array.isArray(response.data.entry)) {
    patients = response.data.entry.map((entry: any) => ({
      id: resource.id,
      family: resource.name?.[0]?.family || '',
      given: resource.name?.[0]?.given?.[0] || '',
      // ... other transformations
    }))
  }
  
  return { data: patients, total, page, count, hasNext, hasPrev }
}
```

#### State Management Layer
```typescript
// Custom Hooks (src/hooks/)
export function usePatients(params?: PaginationParams) {
  const key = params ? `patients-${params.page}-${params.count}` : 'patients'
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Patient>>(
    key, 
    () => getPatients(params)
  )
  
  return { patients: data?.data || [], pagination, isLoading, error, mutate }
}
```

### 2. Authentication Integration

#### NextAuth.js Configuration
```typescript
export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({
    async authorize(credentials) {
      // Fixed admin credentials + dynamic signup
      if (credentials.email === FIXED_USERNAME && credentials.password === FIXED_PASSWORD) {
        return { id: "1", email: credentials.email, name: "Admin User" }
      }
      // Allow new user signup
      if (credentials.email !== FIXED_USERNAME) {
        return { id: Date.now().toString(), email: credentials.email, name: credentials.email.split('@')[0] }
      }
      return null
    }
  })],
  session: { strategy: "jwt" },
  jwt: { maxAge: 30 * 24 * 60 * 60 }, // 30 days
}
```

#### Authentication Middleware
```typescript
export async function withAuth(request: NextRequest, handler: Function) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized - No valid session" }, { status: 401 })
  }
  
  return await handler(request, token)
}
```

### 3. API Credential Management

The system supports flexible credential management with fallback priority:

1. **Cookie-based Configuration** (highest priority)
2. **Environment Variables** (fallback)

```typescript
export function getApiCredentialsFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie')
  let apiKey = process.env.API_KEY
  let accessToken = process.env.API_ACCESS_TOKEN
  
  if (cookieHeader) {
    const cookies = parseCookies(cookieHeader)
    if (cookies.api_key) apiKey = cookies.api_key
    if (cookies.access_token) accessToken = cookies.access_token
  }
  
  return { apiKey, accessToken }
}
```

## ⚙️ Command Processing Logic

### ⚠️ **Known Processing Issues**

#### **Appointment Management Problems**
- **POST/PUT appointment routes are partially functional**
- The ModMed API expects specific codes that are not documented
- Appointment creation may fail with cryptic error messages
- Update operations may not work as expected due to missing parameters

#### **Data Processing Limitations**
- **Empty response handling**: Many endpoints return empty FHIR Bundles
- **Clinical data processing**: No actual data to process for allergies, medications, conditions
- **Diagnostic report processing**: Endpoints exist but return no data

### 1. Request Flow Architecture

```
Client Request → Authentication Middleware → API Route Handler → External API → Response Transformation → Client
```

**Note**: Due to API limitations, many responses will be empty or contain error states.

#### Authentication Flow
1. **Token Validation**: Extract JWT from request headers
2. **Session Verification**: Validate token with NextAuth.js
3. **Credential Extraction**: Get API credentials from cookies/env
4. **Request Authorization**: Proceed if authenticated

#### API Request Processing
1. **Parameter Parsing**: Extract query parameters and request body
2. **FHIR Format Conversion**: Transform application data to FHIR format
3. **External API Call**: Make authenticated request to FHIR API
4. **Response Processing**: Handle FHIR Bundle responses
5. **Error Handling**: Implement comprehensive error management

### 2. CRUD Operations Pattern

#### Create Operations
```typescript
export const POST = createAuthenticatedHandler(async (request: NextRequest, token) => {
  const body = await request.json()
  const fhirData = transformToFHIRFormat(body)
  
  const response = await axios.post(fhirEndpoint, fhirData, { headers })
  
  return NextResponse.json({
    ...response.data,
    id: extractIdFromResponse(response)
  })
})
```

#### Read Operations
```typescript
export const GET = createAuthenticatedHandler(async (request: NextRequest, token) => {
  const { searchParams } = new URL(request.url)
  const queryParams = buildFHIRQueryParams(searchParams)
  
  const response = await axios.get(`${endpoint}?${queryParams}`, { headers })
  
  return NextResponse.json(response.data)
})
```

#### Update Operations
```typescript
export const PUT = createAuthenticatedHandler(async (request: NextRequest, token) => {
  const { id } = await params
  const updates = await request.json()
  
  // Merge with existing data
  const currentData = await getCurrentResource(id)
  const mergedData = { ...currentData, ...updates }
  
  const response = await axios.put(`${endpoint}/${id}`, mergedData, { headers })
  return NextResponse.json(response.data)
})
```

### 3. Data Validation & Transformation

#### FHIR Data Transformation
```typescript
// Transform application data to FHIR format
const fhirPatient = {
  resourceType: "Patient",
  name: [{ family: patient.family, given: [patient.given] }],
  telecom: [
    { system: "phone", value: patient.phone, use: "mobile" },
    { system: "email", value: patient.email }
  ],
  birthDate: patient.birthDate
}

// Transform FHIR response to application format
const transformedPatient = {
  id: resource.id,
  family: resource.name?.[0]?.family || '',
  given: resource.name?.[0]?.given?.[0] || '',
  email: resource.telecom?.find(t => t.system === 'email')?.value || '',
  phone: resource.telecom?.find(t => t.system === 'phone')?.value || ''
}
```

## 📊 State Management Approach

### 1. SWR-Based State Management

The application uses SWR (Stale-While-Revalidate) for efficient data fetching and caching:

#### Cache Key Strategy
```typescript
// Paginated data with unique keys
const key = params ? `patients-${params.page}-${params.count}` : 'patients'

// Individual resource caching
const { data } = useSWR(`patient-${id}`, () => getPatient(id))

// Search results caching
const { data } = useSWR(searchId ? `search-${searchId}` : null, () => searchPatientById(searchId))
```

#### Cache Invalidation
```typescript
export function usePatientMutations() {
  const { mutate } = useSWR('patients')
  
  const update = async (id: string, updates: Partial<Patient>) => {
    const updatedPatient = await updatePatient(id, updates)
    mutate() // Invalidate list cache
    mutate(`patient-${id}`) // Invalidate individual cache
    return updatedPatient
  }
  
  return { update }
}
```

### 2. Context Providers

#### Session Provider
```typescript
export default function SessionProvider({ children }: SessionProviderProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
```

### 3. Form State Management

#### React Hook Form Integration
```typescript
const form = useForm<PatientFormData>({
  resolver: zodResolver(patientSchema),
  defaultValues: {
    family: '',
    given: '',
    email: '',
    phone: '',
    birthDate: ''
  }
})
```

### 4. Component State Patterns

#### Local State for UI
```typescript
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
const [searchQuery, setSearchQuery] = useState('')
```

#### Derived State
```typescript
const filteredPatients = useMemo(() => {
  return patients.filter(patient => 
    patient.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.given.toLowerCase().includes(searchQuery.toLowerCase())
  )
}, [patients, searchQuery])
```

## 🛡️ Error Handling Strategies

### ⚠️ **API-Specific Error Scenarios**

#### **Regional Access Errors**
```typescript
// VPN connection required - will fail without USA VPN
if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
  return NextResponse.json(
    { error: 'API access requires USA VPN connection' },
    { status: 503 }
  )
}
```

#### **Appointment Creation Failures**
```typescript
// Undocumented required codes cause appointment failures
if (error.response?.data?.error?.includes('code') || 
    error.response?.data?.message?.includes('required field')) {
  return NextResponse.json(
    { error: 'Appointment creation failed - missing required codes (API documentation incomplete)' },
    { status: 400 }
  )
}
```

#### **Empty Data Responses**
```typescript
// Handle empty FHIR Bundles from clinical endpoints
if (response.data && response.data.entry && response.data.entry.length === 0) {
  return NextResponse.json({
    resourceType: "Bundle",
    type: "searchset",
    total: 0,
    entry: [],
    message: "No data available in API for this resource type"
  })
}
```

### 1. Multi-Layer Error Handling

#### API Route Error Handling
```typescript
export const GET = createAuthenticatedHandler(async (request: NextRequest, token) => {
  try {
    const response = await axios.get(url, { headers })
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching data:', error)
    
    // Handle specific error types
    if (error.response?.status === 404) {
      return NextResponse.json({
        resourceType: "Bundle",
        type: "searchset",
        total: 0,
        entry: []
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
})
```

#### Client-Side Error Handling
```typescript
export async function createAppointment(appointmentData: AppointmentData) {
  try {
    const response = await axios.post('/api/appointments', appointmentData)
    return response.data
  } catch (error: any) {
    // Handle specific business logic errors
    if (error.response?.status === 409 && error.response?.data?.error === 'BOOKING_UNAVAILABLE') {
      throw new Error('BOOKING_UNAVAILABLE')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Patient or practitioner not found')
    }
    
    throw error
  }
}
```

### 2. Error Boundary Implementation

#### Component Error Boundaries
```typescript
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  
  if (hasError) {
    return <div>Something went wrong. Please try again.</div>
  }
  
  return children
}
```

### 3. User-Friendly Error Messages

#### Error Message Mapping
```typescript
const getErrorMessage = (error: any): string => {
  if (error.message === 'BOOKING_UNAVAILABLE') {
    return 'The selected time slot is no longer available. Please choose another time.'
  }
  
  if (error.response?.status === 404) {
    return 'The requested resource was not found.'
  }
  
  if (error.response?.status === 401) {
    return 'You are not authorized to perform this action.'
  }
  
  return 'An unexpected error occurred. Please try again.'
}
```

### 4. Validation Error Handling

#### Form Validation
```typescript
const patientSchema = z.object({
  family: z.string().min(1, 'Family name is required'),
  given: z.string().min(1, 'Given name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  birthDate: z.string().min(1, 'Birth date is required')
})
```

## 🚀 Performance Optimizations

### 1. Data Fetching Optimizations

#### SWR Caching Strategy
```typescript
// Automatic caching and revalidation
const { data, error, isLoading, mutate } = useSWR(
  'patients',
  getPatients,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000
  }
)
```

#### Pagination Implementation
```typescript
// Efficient pagination with query parameters
const queryParams = new URLSearchParams({
  _count: count.toString(),
  page: page.toString()
})

const url = `/api/patients?${queryParams.toString()}`
```

### 2. Component Optimizations

#### Lazy Loading
```typescript
const PatientDetailModal = lazy(() => import('./PatientDetailModal'))
const AppointmentForm = lazy(() => import('./AppointmentForm'))
```

#### Memoization
```typescript
const PatientCard = memo(({ patient, onEdit, onDelete }: PatientCardProps) => {
  return (
    <div className="patient-card">
      {/* Component content */}
    </div>
  )
})
```

### 3. Bundle Optimization

#### Next.js Configuration
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}
```

#### Dynamic Imports
```typescript
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false
})
```

### 4. API Response Optimization

#### FHIR Bundle Processing
```typescript
// Efficient FHIR Bundle processing
if (response.data && response.data.entry && Array.isArray(response.data.entry)) {
  patients = response.data.entry.map((entry: any) => {
    const resource = entry.resource
    return transformFHIRResource(resource)
  })
  
  total = response.data.total || patients.length
}
```

#### Response Caching
```typescript
// Cache API responses with appropriate headers
const response = await axios.get(url, {
  headers: {
    'Cache-Control': 'max-age=300', // 5 minutes
    'Authorization': `Bearer ${accessToken}`,
    'x-api-key': apiKey
  }
})
```

### 5. UI Performance Optimizations

#### Virtual Scrolling (for large lists)
```typescript
// Implement virtual scrolling for large patient lists
const VirtualizedList = ({ items, renderItem }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })
  
  return (
    <div className="virtual-list">
      {items.slice(visibleRange.start, visibleRange.end).map(renderItem)}
    </div>
  )
}
```

#### Debounced Search
```typescript
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    setSearchQuery(query)
  }, 300),
  []
)
```

## 🔧 Development & Deployment

### 1. Development Environment

#### Scripts
```json
{
  "dev": "next dev --turbopack",
  "build": "next build --turbopack",
  "start": "next start",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### 2. Environment Configuration

#### Required Environment Variables
```env
# Authentication
NEXTAUTH_SECRET=your-jwt-secret-key
NEXTAUTH_URL=http://localhost:3000

# External API Configuration
API_BASE_URL=https://stage.ema-api.com
API_URL_PREFIX=your-api-prefix
API_KEY=your-api-key
API_ACCESS_TOKEN=your-access-token
```

### 3. Testing Strategy

#### Unit Tests
```typescript
// Component testing
describe('PatientCard', () => {
  it('renders patient information correctly', () => {
    render(<PatientCard patient={mockPatient} />)
    expect(screen.getByText(mockPatient.family)).toBeInTheDocument()
  })
})
```

#### Integration Tests
```typescript
// API integration testing
describe('Patient API', () => {
  it('fetches patients successfully', async () => {
    const response = await getPatients({ page: 1, count: 10 })
    expect(response.data).toHaveLength(10)
    expect(response.total).toBeGreaterThan(0)
  })
})
```

## 📋 Key Architectural Decisions

### 1. **Next.js App Router**: Chosen for modern routing, server components, and improved performance
### 2. **SWR over React Query**: Selected for simpler API, automatic caching, and better integration with Next.js
### 3. **NextAuth.js**: Implemented for robust authentication with JWT strategy
### 4. **FHIR Integration**: Direct integration with external FHIR APIs for healthcare data standards
### 5. **TypeScript**: Full type safety across the application
### 6. **Tailwind CSS**: Utility-first CSS for rapid UI development
### 7. **Axios**: HTTP client for API requests with interceptors
### 8. **Zod**: Runtime type validation for forms and API responses

## 🔄 Data Flow Summary

1. **User Action** → Component triggers API call
2. **Custom Hook** → SWR manages request and caching
3. **API Client** → Transforms data and makes HTTP request
4. **API Route** → Authenticates and forwards to external API
5. **External API** → Returns FHIR-formatted data (often empty)
6. **Response Processing** → Transforms FHIR to application format
7. **State Update** → SWR updates cache and triggers re-render
8. **UI Update** → Component reflects new data (or empty state)

This architecture ensures scalability, maintainability, and optimal performance while providing a robust foundation for healthcare data management.

---

## 🚨 **DEVELOPER WARNINGS & LIMITATIONS SUMMARY**

### **Critical Requirements**
1. **USA VPN Connection**: Mandatory for all API access
2. **Limited Data Availability**: Most clinical endpoints return empty results
3. **Appointment Issues**: POST/PUT operations fail due to undocumented codes
4. **API Documentation Gaps**: Missing required parameters for many operations

### **Functional Impact**
- **Patient Management**: Basic CRUD works, but limited data
- **Appointment Booking**: Partially functional, may fail
- **Clinical Records**: UI exists but no data to display
- **Billing/Insurance**: Limited functionality due to empty API responses

### **Development Considerations**
- This application demonstrates architecture patterns rather than full functionality
- Many features are built but cannot be fully tested due to API limitations
- Error handling includes specific cases for these API constraints
- UI components handle empty states gracefully

**Recommendation**: Use this as a reference for integration patterns and architecture decisions, understanding that full functionality requires a complete API with proper documentation and data availability.
