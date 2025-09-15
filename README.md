# EHR Integration Dashboard

A modern, professional Electronic Health Record (EHR) integration dashboard built with Next.js 15, React 19, and TypeScript. This application provides a comprehensive interface for managing patient records, appointments, billing, and clinical data through integration with external FHIR-compliant APIs.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **API Key** and **Access Token** for the external EHR API

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ehrdashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
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

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Authentication

### Default Login Credentials
- **Email**: `admin@admin.com`
- **Password**: `password123`

### User Registration
- New users can sign up with any email address
- The system automatically creates accounts for new email addresses
- All users are redirected to the patients page after authentication

## 🏗️ Project Structure

```
ehrdashboard/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/               # API routes for external integration
│   │   │   ├── patients/      # Patient management endpoints
│   │   │   ├── appointments/  # Appointment scheduling endpoints
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── billing/       # Billing and insurance endpoints
│   │   │   └── practitioners/ # Healthcare provider endpoints
│   │   ├── patients/          # Patient management page
│   │   ├── appointments/      # Appointment scheduling page
│   │   ├── billing/           # Billing and insurance page
│   │   ├── clinical/          # Clinical records page
│   │   └── auth/              # Authentication pages
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   ├── modals/            # Modal components
│   │   ├── providers/         # Context providers
│   │   └── ui/                # Base UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── api/               # API client functions
│   │   ├── auth.ts            # Authentication configuration
│   │   ├── auth-middleware.ts # Authentication middleware
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript type definitions
├── tests/                     # Test files
├── public/                    # Static assets
└── package.json               # Dependencies and scripts
```

## 🌐 External API Integration

### FHIR API Integration
The application integrates with a FHIR-compliant EHR system through the following endpoints:

- **Base URL**: `https://stage.ema-api.com`
- **API Version**: FHIR v2
- **Authentication**: Bearer token + API key
- **Data Format**: JSON

### Required API Credentials

1. **API Key** (`x-api-key` header)
   - Required for all API requests
   - Can be set via environment variable or cookies

2. **Access Token** (`Authorization: Bearer` header)
   - Required for authenticated requests
   - Can be set via environment variable or cookies

### API Endpoints Used

- `GET /Patient` - Fetch patient records
- `POST /Patient` - Create new patient
- `PUT /Patient/{id}` - Update patient record
- `GET /Appointment` - Fetch appointments
- `POST /Appointment` - Create new appointment
- `PUT /Appointment/{id}` - Update appointment
- `GET /Practitioner` - Fetch healthcare providers
- `GET /Coverage` - Fetch insurance coverage
- `GET /Account` - Fetch billing information

## ✨ Key Features

### 🔐 Authentication & Security
- **NextAuth.js** integration with JWT strategy
- Protected routes with middleware
- Session management with 30-day expiration
- Secure cookie handling

### 👥 Patient Management
- **CRUD Operations**: Create, read, update, delete patient records
- **Search Functionality**: Search patients by ID
- **Pagination**: Efficient data loading with pagination
- **Form Validation**: Zod schema validation for data integrity
- **Real-time Updates**: SWR for data fetching and caching

### 📅 Appointment Scheduling
- **Appointment Booking**: Create new appointments
- **Status Management**: Update appointment status
- **Search & Filter**: Find appointments by ID
- **Validation**: Patient and practitioner validation
- **Conflict Detection**: Booking availability checks

### 💰 Billing & Insurance
- **Account Information**: View patient billing details
- **Insurance Coverage**: Display coverage information
- **Search by Patient ID**: Quick access to billing data
- **Status Tracking**: Monitor payment and coverage status

### 🏥 Clinical Records
- **Vitals Management**: Record and track patient vitals
- **Allergy Tracking**: Manage patient allergies
- **Medication Management**: Track prescribed medications
- **Tabbed Interface**: Organized clinical data views

### 🎨 User Interface
- **Modern Design**: Clean, professional healthcare UI
- **Responsive Layout**: Works on desktop and mobile
- **Dark/Light Theme**: Tailwind CSS styling
- **Interactive Components**: Modals, forms, and tables
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error management

### 📊 Data Management
- **Pagination**: Efficient data loading
- **Search & Filter**: Quick data access
- **Real-time Updates**: Live data synchronization
- **Form Validation**: Client and server-side validation
- **Success Notifications**: User feedback for actions

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🧪 Testing

The project includes comprehensive testing setup:

- **Jest** for unit testing
- **React Testing Library** for component testing
- **Mock implementations** for API calls
- **Coverage reporting** for test coverage

Run tests:
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | JWT secret for authentication | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `API_BASE_URL` | External API base URL | Yes |
| `API_URL_PREFIX` | API URL prefix | Yes |
| `API_KEY` | External API key | Yes |
| `API_ACCESS_TOKEN` | External API access token | Yes |

### API Configuration

The application supports flexible API credential management:

1. **Environment Variables**: Set in `.env.local`
2. **Cookies**: Set via browser cookies for dynamic configuration
3. **Fallback**: Environment variables as fallback

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Setup

Ensure all required environment variables are set in your production environment:

```env
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
API_BASE_URL=https://your-api-domain.com
API_URL_PREFIX=your-prefix
API_KEY=your-production-api-key
API_ACCESS_TOKEN=your-production-access-token
```

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the documentation above
2. Review the test files for usage examples
3. Check the API integration examples in `src/lib/api/`
4. Review the component implementations in `src/components/`

## 🔄 API Integration Notes

### FHIR Data Format
The application handles FHIR Bundle responses and transforms them into application-specific data structures. Key transformations include:

- **Patient Data**: FHIR Patient resources → Application Patient interface
- **Appointments**: FHIR Appointment resources → Application Appointment interface
- **Pagination**: FHIR Bundle pagination → Application pagination logic

### Error Handling
The application includes comprehensive error handling for:

- **API Unavailable**: Graceful fallbacks when external API is down
- **Authentication Errors**: Proper error messages for invalid credentials
- **Validation Errors**: Client and server-side validation feedback
- **Network Errors**: Retry mechanisms and user-friendly error messages

### Performance Optimizations
- **SWR Caching**: Efficient data fetching and caching
- **Pagination**: Load data in chunks for better performance
- **Lazy Loading**: Components loaded on demand
- **Turbopack**: Fast development builds with Next.js 15

---

**Ready to get started?** Follow the Quick Start guide above and you'll have the EHR Dashboard running in minutes! 🚀