# EHR Dashboard API Documentation

This document provides comprehensive documentation for all API endpoints in the EHR Dashboard application, including both internal application routes and external FHIR API integration.

Postman Collection: https://shreyasmm567-1027582.postman.co/workspace/Shreyas's-Workspace~8885f949-90c9-4225-8db3-1c203d6abe1a/collection/48429417-4d435da5-6686-4b04-8337-aa6d5b7526c6?action=share&source=copy-link&creator=48429417

## Table of Contents

1. [Authentication](#authentication)
2. [Internal Application API](#internal-application-api)
3. [External FHIR API Integration](#external-fhir-api-integration)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

---

## Authentication

All API endpoints (except authentication endpoints) require valid authentication. The application uses NextAuth.js with JWT strategy.

### Authentication Headers

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Session Management

- **Session Duration**: 30 days
- **Token Strategy**: JWT
- **Cookie Name**: `next-auth.session-token`

---

## Internal Application API

Base URL: `http://localhost:3000/api`

### Authentication Endpoints

#### GET `/api/auth/me`
Get current user information.

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "admin@admin.com",
    "name": "Admin User"
  },
  "authenticated": true
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token

---

#### POST `/api/auth/[...nextauth]`
NextAuth.js authentication handler for login/logout.

**Endpoints:**
- `/api/auth/signin` - User login
- `/api/auth/signout` - User logout
- `/api/auth/session` - Get session information

---

### Patient Management

#### GET `/api/patients`
Retrieve paginated list of patients.

**Query Parameters:**
- `_count` (optional): Number of patients per page (default: 10)
- `page` (optional): Page number (default: 1)

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
```

**Example Request:**
```http
GET /api/patients?_count=20&page=2
```

**Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 150,
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "256708",
        "name": [
          {
            "family": "Smith",
            "given": ["John"]
          }
        ],
        "birthDate": "1985-03-15",
        "telecom": [
          {
            "system": "email",
            "value": "john.smith@email.com"
          },
          {
            "system": "phone",
            "value": "555-123-4567"
          }
        ]
      }
    }
  ]
}
```

---

#### POST `/api/patients`
Create a new patient.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
Content-Type: application/json
```

**Request Body:**
```json
{
  "resourceType": "Patient",
  "name": [
    {
      "family": "Doe",
      "given": ["Jane"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "555-987-6543",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "jane.doe@email.com"
    }
  ],
  "birthDate": "1990-07-22"
}
```

**Response:**
```json
{
  "resourceType": "Patient",
  "id": "256709",
  "name": [
    {
      "family": "Doe",
      "given": ["Jane"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "555-987-6543",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "jane.doe@email.com"
    }
  ],
  "birthDate": "1990-07-22"
}
```

---

#### GET `/api/patients/[id]`
Retrieve a specific patient by ID.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
```

**Example Request:**
```http
GET /api/patients/256708
```

**Response:**
```json
{
  "resourceType": "Patient",
  "id": "256708",
  "name": [
    {
      "family": "Smith",
      "given": ["John"]
    }
  ],
  "birthDate": "1985-03-15",
  "telecom": [
    {
      "system": "email",
      "value": "john.smith@email.com"
    },
    {
      "system": "phone",
      "value": "555-123-4567"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Patient not found
- `500 Internal Server Error` - Server error

---

#### PUT `/api/patients/[id]`
Update an existing patient.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
Content-Type: application/json
```

**Request Body:**
```json
{
  "resourceType": "Patient",
  "id": "256708",
  "name": [
    {
      "family": "Smith",
      "given": ["John"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "555-123-4567",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "john.smith.updated@email.com"
    }
  ],
  "birthDate": "1985-03-15"
}
```

**Response:**
```json
{
  "resourceType": "Patient",
  "id": "256708",
  "name": [
    {
      "family": "Smith",
      "given": ["John"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "555-123-4567",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "john.smith.updated@email.com"
    }
  ],
  "birthDate": "1985-03-15"
}
```

---

#### DELETE `/api/patients/[id]`
Delete a patient.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
```

**Response:**
```json
{
  "success": true
}
```

---

### Appointment Management

#### GET `/api/appointments`
Retrieve all appointments.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
```

**Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 25,
  "entry": [
    {
      "resource": {
        "resourceType": "Appointment",
        "id": "12345",
        "status": "booked",
        "start": "2024-01-15T10:00:00Z",
        "end": "2024-01-15T10:30:00Z",
        "minutesDuration": 30,
        "participant": [
          {
            "actor": {
              "reference": "Patient/256708",
              "display": "John Smith"
            },
            "status": "accepted"
          },
          {
            "actor": {
              "reference": "Practitioner/123",
              "display": "Dr. Johnson"
            },
            "status": "accepted"
          }
        ]
      }
    }
  ]
}
```

---

#### POST `/api/appointments`
Create a new appointment.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
Content-Type: application/json
```

**Request Body:**
```json
{
  "patientId": "256708",
  "practitionerId": "123",
  "startDateTime": "2024-01-20T14:00:00Z",
  "endDateTime": "2024-01-20T14:30:00Z",
  "minutesDuration": 30
}
```

**Response:**
```json
{
  "resourceType": "Appointment",
  "id": "12346",
  "status": "booked",
  "start": "2024-01-20T14:00:00Z",
  "end": "2024-01-20T14:30:00Z",
  "minutesDuration": 30,
  "participant": [
    {
      "actor": {
        "reference": "Patient/256708",
        "display": "John Smith"
      },
      "status": "accepted"
    },
    {
      "actor": {
        "reference": "Practitioner/123",
        "display": "Dr. Johnson"
      },
      "status": "accepted"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `404 Not Found` - Patient or practitioner not found
- `409 Conflict` - Booking unavailable (BOOKING_UNAVAILABLE)

---

#### GET `/api/appointments/[id]`
Retrieve a specific appointment by ID.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
```

**Response:**
```json
{
  "resourceType": "Appointment",
  "id": "12345",
  "status": "booked",
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T10:30:00Z",
  "minutesDuration": 30,
  "participant": [
    {
      "actor": {
        "reference": "Patient/256708",
        "display": "John Smith"
      },
      "status": "accepted"
    }
  ]
}
```

---

#### PUT `/api/appointments/[id]`
Update an existing appointment.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
Content-Type: application/json
```

**Request Body:**
```json
{
  "resourceType": "Appointment",
  "id": "12345",
  "status": "confirmed",
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T10:30:00Z",
  "minutesDuration": 30,
  "participant": [
    {
      "actor": {
        "reference": "Patient/256708",
        "display": "John Smith"
      },
      "status": "accepted"
    }
  ]
}
```

---

### Practitioner Management

#### GET `/api/practitioners/[id]`
Retrieve a specific practitioner by ID.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
```

**Response:**
```json
{
  "resourceType": "Practitioner",
  "id": "123",
  "name": [
    {
      "family": "Johnson",
      "given": ["Dr. Sarah"]
    }
  ],
  "telecom": [
    {
      "system": "email",
      "value": "sarah.johnson@clinic.com"
    },
    {
      "system": "phone",
      "value": "555-456-7890"
    }
  ]
}
```

---

### Billing & Insurance

#### GET `/api/account`
Retrieve patient account information.

**Query Parameters:**
- `patient` (required): Patient ID

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
```

**Example Request:**
```http
GET /api/account?patient=256708
```

**Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "resource": {
        "resourceType": "Account",
        "id": "acc-001",
        "status": "active",
        "subject": [
          {
            "reference": "Patient/256708"
          }
        ],
        "balance": {
          "value": 150.00,
          "currency": "USD"
        }
      }
    }
  ]
}
```

---

#### GET `/api/coverage`
Retrieve patient insurance coverage information.

**Query Parameters:**
- `patient` (required): Patient ID

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
```

**Example Request:**
```http
GET /api/coverage?patient=256708
```

**Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "resource": {
        "resourceType": "Coverage",
        "id": "cov-001",
        "status": "active",
        "subscriber": {
          "reference": "Patient/256708"
        },
        "payor": [
          {
            "display": "Blue Cross Blue Shield"
          }
        ],
        "costToBeneficiary": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/coverage-copay-type",
                  "code": "copay",
                  "display": "Copay"
                }
              ]
            },
            "valueMoney": {
              "value": 25.00,
              "currency": "USD"
            }
          }
        ]
      }
    }
  ]
}
```

---

### Clinical Records

#### GET `/api/patient-details/allergies`
Retrieve patient allergies.

**Query Parameters:**
- `patientId` (required): Patient ID

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
```

**Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "resource": {
        "resourceType": "AllergyIntolerance",
        "id": "allergy-001",
        "clinicalStatus": {
          "coding": [
            {
              "system": "https://www.hl7.org/fhir/valueset-allergyintolerance-clinical.html",
              "code": "active",
              "display": "Active"
            }
          ]
        },
        "code": {
          "text": "Penicillin"
        },
        "patient": {
          "reference": "Patient/256708"
        },
        "reaction": [
          {
            "description": "Hives and difficulty breathing"
          }
        ]
      }
    }
  ]
}
```

---

#### POST `/api/patient-details/allergies`
Create a new allergy record.

**Headers:**
```http
Authorization: Bearer <jwt-token>
x-api-key: <api-key>
Content-Type: application/json
```

**Request Body:**
```json
{
  "patientId": "256708",
  "code": "Shellfish",
  "description": "Nausea and skin rash",
  "clinicalStatus": "active"
}
```

---

#### GET `/api/patient-details/medications`
Retrieve patient medications.

**Query Parameters:**
- `patientId` (required): Patient ID

**Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "resource": {
        "resourceType": "MedicationStatement",
        "id": "med-001",
        "status": "active",
        "medicationCodeableConcept": {
          "text": "Lisinopril 10mg"
        },
        "subject": {
          "reference": "Patient/256708"
        },
        "effectiveDateTime": "2024-01-01",
        "dosage": [
          {
            "text": "Once daily"
          }
        ]
      }
    }
  ]
}
```

---

#### POST `/api/patient-details/medications`
Create a new medication record.

**Request Body:**
```json
{
  "patientId": "256708",
  "medicationCodeableConcept": "Metformin 500mg",
  "status": "active",
  "effectiveDateTime": "2024-01-01",
  "dosage": "Twice daily",
  "note": "For type 2 diabetes management"
}
```

---

#### GET `/api/patient-details/conditions`
Retrieve patient conditions.

**Query Parameters:**
- `patientId` (required): Patient ID

**Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "resource": {
        "resourceType": "Condition",
        "id": "cond-001",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
              "code": "active",
              "display": "Active"
            }
          ]
        },
        "code": {
          "text": "Hypertension"
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                "code": "encounter-diagnosis",
                "display": "Encounter Diagnosis"
              }
            ]
          }
        ],
        "subject": {
          "reference": "Patient/256708"
        }
      }
    }
  ]
}
```

---

#### POST `/api/patient-details/conditions`
Create a new condition record.

**Request Body:**
```json
{
  "patientId": "256708",
  "code": "Type 2 Diabetes",
  "clinicalStatus": "active",
  "category": "Encounter Diagnosis",
  "severity": "Moderate",
  "onsetDate": "2023-12-01",
  "note": "Patient requires regular monitoring"
}
```

---

#### GET `/api/patient-details/diagnostic-reports`
Retrieve patient diagnostic reports.

**Query Parameters:**
- `patientId` (required): Patient ID

**Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "resource": {
        "resourceType": "DiagnosticReport",
        "id": "report-001",
        "status": "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0074",
                "code": "LAB",
                "display": "Laboratory"
              }
            ]
          }
        ],
        "code": {
          "text": "Complete Blood Count"
        },
        "subject": {
          "reference": "Patient/256708"
        },
        "effectiveDateTime": "2024-01-10T08:00:00Z",
        "performer": [
          {
            "display": "Dr. Johnson"
          }
        ],
        "conclusion": "All values within normal range"
      }
    }
  ]
}
```

---

#### POST `/api/patient-details/diagnostic-reports`
Create a new diagnostic report.

**Request Body:**
```json
{
  "patientId": "256708",
  "code": "Blood Glucose Test",
  "status": "final",
  "category": "Laboratory",
  "effectiveDate": "2024-01-15T09:00:00Z",
  "performer": "Dr. Smith",
  "conclusion": "Blood glucose level: 95 mg/dL (Normal)"
}
```

---

## External FHIR API Integration

The application integrates with an external FHIR-compliant EHR system. All external API calls are proxied through the internal API endpoints.

### Base Configuration

- **Base URL**: `https://stage.ema-api.com`
- **API Version**: FHIR v2
- **Authentication**: Bearer token + API key
- **Content Type**: `application/json`

### Required Headers

```http
Authorization: Bearer <access-token>
x-api-key: <api-key>
Content-Type: application/json
```

### External API Endpoints

#### Patient Resources

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Patient`
- Retrieve patient list with pagination
- Query parameters: `_count`, `page`

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Patient/{id}`
- Retrieve specific patient by ID

**POST** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Patient`
- Create new patient

**PUT** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Patient/{id}`
- Update existing patient

**DELETE** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Patient/{id}`
- Delete patient

#### Appointment Resources

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Appointment`
- Retrieve all appointments

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Appointment/{id}`
- Retrieve specific appointment

**POST** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Appointment`
- Create new appointment

**PUT** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Appointment/{id}`
- Update existing appointment

#### Practitioner Resources

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Practitioner/{id}`
- Retrieve specific practitioner

#### Account Resources

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Account?patient={patientId}`
- Retrieve patient account information

#### Coverage Resources

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Coverage?patient={patientId}`
- Retrieve patient insurance coverage

#### Clinical Resources

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/AllergyIntolerance?patient={patientId}`
- Retrieve patient allergies

**POST** `{BASE_URL}/{PREFIX}/ema/fhir/v2/AllergyIntolerance`
- Create new allergy record

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/MedicationStatement?patient={patientId}`
- Retrieve patient medications

**POST** `{BASE_URL}/{PREFIX}/ema/fhir/v2/MedicationStatement`
- Create new medication record

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Condition?patient={patientId}`
- Retrieve patient conditions

**POST** `{BASE_URL}/{PREFIX}/ema/fhir/v2/Condition`
- Create new condition record

**GET** `{BASE_URL}/{PREFIX}/ema/fhir/v2/DiagnosticReport?patient={patientId}`
- Retrieve patient diagnostic reports

**POST** `{BASE_URL}/{PREFIX}/ema/fhir/v2/DiagnosticReport`
- Create new diagnostic report

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or invalid
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., booking unavailable)
- `500 Internal Server Error` - Server error

### Common Error Scenarios

#### Authentication Errors
```json
{
  "error": "Unauthorized - No valid session"
}
```

#### Validation Errors
```json
{
  "error": "Patient ID is required"
}
```

#### API Configuration Errors
```json
{
  "error": "API configuration missing"
}
```

#### External API Errors
```json
{
  "error": "Failed to fetch patients",
  "details": "External API error details"
}
```

---

## Rate Limiting

The application implements rate limiting to prevent abuse:

- **Requests per minute**: 100
- **Burst limit**: 20 requests per second
- **Rate limit headers**:
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

### Rate Limit Exceeded Response

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## API Credential Management

The application supports flexible API credential management:

### Environment Variables
```env
API_BASE_URL=https://stage.ema-api.com
API_URL_PREFIX=your-prefix
API_KEY=your-api-key
API_ACCESS_TOKEN=your-access-token
```

### Cookie-based Configuration
- `api_key`: API key stored in browser cookie
- `access_token`: Access token stored in browser cookie

### Fallback Priority
1. Cookie values (highest priority)
2. Environment variables (fallback)

---

## Testing the API

### Using cURL

#### Get Patients
```bash
curl -X GET "http://localhost:3000/api/patients?_count=10&page=1" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-api-key: <api-key>"
```

#### Create Patient
```bash
curl -X POST "http://localhost:3000/api/patients" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "x-api-key: <api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "Doe", "given": ["Jane"]}],
    "telecom": [
      {"system": "email", "value": "jane.doe@email.com"},
      {"system": "phone", "value": "555-123-4567"}
    ],
    "birthDate": "1990-01-01"
  }'
```

### Using JavaScript/Fetch

```javascript
// Get patients
const response = await fetch('/api/patients?_count=10&page=1', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-api-key': apiKey
  }
});

const data = await response.json();
```

---

## Support

For API support and questions:

1. Check the error responses for specific error details
2. Verify authentication tokens are valid
3. Ensure API credentials are properly configured
4. Review the FHIR resource documentation for external API details

---

*Last updated: January 2024*
