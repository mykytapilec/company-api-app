# Company Postings API

A Node.js/Express API that provides an interface to manage and query freight postings with company information. The API enriches posting data from an existing Posting API with company details from a local database.

## Description

The Company Postings API serves as a middleware between clients and the existing Posting API. It:
- Fetches and filters freight postings
- Enriches posting data with company information
- Provides endpoints to create new postings
- Validates required fields and data integrity

## Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd company-api-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`.

## API Endpoints

### GET /company-postings

Retrieves a list of postings with optional filtering.

#### Query Parameters
- `equipmentType` (optional): Filter by equipment type (e.g., "Van", "Reefer", "Flatbed")
- `fullPartial` (optional): Filter by load type (e.g., "FULL", "PARTIAL")

#### Example Requests
```bash
# Get all postings
curl http://localhost:3000/company-postings

# Filter by equipment type
curl http://localhost:3000/company-postings?equipmentType=Van

# Filter by load type
curl http://localhost:3000/company-postings?fullPartial=FULL

# Filter by both
curl http://localhost:3000/company-postings?equipmentType=Van&fullPartial=FULL
```

#### Response Format
```json
[
  {
    "companyName": "ACCELERATE SHIPPING",
    "freight": {
      "weightPounds": 40000,
      "equipmentType": "Van",
      "fullPartial": "FULL",
      "lengthFeet": 53
    }
  }
]
```

### POST /company-postings

Creates a new posting.

#### Request Body
```json
{
  "companyName": "ACCELERATE SHIPPING",
  "freight": {
    "weightPounds": 40000,
    "equipmentType": "Van",
    "fullPartial": "FULL",
    "lengthFeet": 53
  }
}
```

All fields shown above are required.

#### Example Request
```bash
curl -X POST http://localhost:3000/company-postings \
-H "Content-Type: application/json" \
-d '{
  "companyName": "ACCELERATE SHIPPING",
  "freight": {
    "weightPounds": 40000,
    "equipmentType": "Van",
    "fullPartial": "FULL",
    "lengthFeet": 53
  }
}'
```

#### Response Codes
- 201: Successfully created
- 400: Bad request (missing required fields or invalid company name)
- 500: Internal server error

## Development

### Available Scripts

- `npm run dev`: Starts the development server with hot-reload
- `npm run build`: Builds the TypeScript code
- `npm run start`: Builds and starts the production server
- `npm run lint`: Runs ESLint to check code quality

### Project Structure

```
src/
├── controllers/         # Request handlers
├── services/           # Business logic
├── repositories/       # Data models
├── mocks/             # Mock API and database
└── index.ts           # Application entry point
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

```json
{
  "error": "Error message description"
}
```

Common error messages include:
- "Company not found"
- "companyName is required"
- "freight details are required"
- "freight.weightPounds is required"
- "freight.equipmentType is required"
- "freight.fullPartial is required"
- "freight.lengthFeet is required" 