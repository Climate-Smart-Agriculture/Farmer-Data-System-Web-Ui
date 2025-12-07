# Development Guide

## Application Overview

This is a React-based web application for managing farmer data as part of the Climate Smart Irrigated Agriculture Project (CSIAP). The application uses TypeScript, JWT authentication, and integrates with a backend API.

## Architecture

### Frontend Stack
- **React 19** with TypeScript
- **React Router v6** for navigation
- **Axios** for HTTP requests
- **JWT** for authentication
- **CSS** for styling (no CSS framework)

### Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components (Login)
│   ├── common/            # Shared components (Layout, PrivateRoute, Dashboard)
│   ├── farmer/            # Farmer management components
│   └── forms/             # Data entry forms for various modules
├── contexts/              # React Context providers (Auth)
├── services/              # API service layer
│   ├── authService.ts     # Authentication service
│   ├── apiService.ts      # Base API service with interceptors
│   ├── farmerService.ts   # Farmer CRUD operations
│   └── ...                # Other domain-specific services
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions (validation)
└── config/                # Configuration files (API endpoints)
```

## Key Features

### 1. Authentication (JWT)
- Login page with username/password
- JWT token storage in localStorage
- Automatic token refresh on 401 errors
- Protected routes using PrivateRoute component
- Auth context for global auth state

### 2. Farmer Management
- List all farmers with pagination
- Search farmers by NIC or name
- Add new farmer
- Edit existing farmer
- View farmer details
- Delete farmer

### 3. Data Entry Forms
All forms support:
- Farmer selection (dropdown)
- Field validation
- Error messages
- Cancel/Save actions

Modules:
- **Equipment**: Track farming equipment
- **Home Garden**: Manage home garden data
- **CSA Agriculture**: Climate Smart Agriculture records
- **Agro Well**: Agro well information
- **Poultry Farming**: Poultry farming records

## API Integration

### Configuration
API base URL is configured via environment variable:
```bash
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### API Service Layer
The application uses a layered architecture:

1. **apiService.ts**: Base HTTP client with:
   - Request interceptor (adds JWT token)
   - Response interceptor (handles 401, token refresh)

2. **Domain Services**: Each domain (farmers, equipment, etc.) has its own service:
   - Encapsulates API calls
   - Handles error transformations
   - Provides typed responses

### API Endpoints

All endpoints are defined in `src/config/api.config.ts`:

- **Auth**: `/auth/login`, `/auth/logout`, `/auth/refresh`
- **Farmers**: `/farmers`, `/farmers/:id`, `/farmers/search`
- **Equipment**: `/equipment`, `/equipment/:id`, `/equipment/farmer/:farmerId`
- **Home Gardens**: `/home-gardens`, `/home-gardens/:id`, `/home-gardens/farmer/:farmerId`
- **CSA Agriculture**: `/csa-agriculture`, `/csa-agriculture/:id`, `/csa-agriculture/farmer/:farmerId`
- **Agro Wells**: `/agro-wells`, `/agro-wells/:id`, `/agro-wells/farmer/:farmerId`
- **Poultry**: `/poultry-farming`, `/poultry-farming/:id`, `/poultry-farming/farmer/:farmerId`

## Validation

Form validation is handled by utility functions in `src/utils/validation.ts`:

### Validators
- `validateEmail()`: Email format validation
- `validatePhoneNumber()`: Sri Lankan phone number format
- `validateNIC()`: Sri Lankan NIC format (old and new)
- `validateRequired()`: Required field validation
- `validateNumber()`: Number validation with min/max
- `validateDate()`: Date format validation

### Form Validators
Each form has a dedicated validator:
- `validateFarmerForm()`
- `validateEquipmentForm()`
- `validateHomeGardenForm()`
- `validateCSAAgricultureForm()`
- `validateAgroWellForm()`
- `validatePoultryForm()`
- `validateLoginForm()`

## Routing

The application uses React Router v6 with the following routes:

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | Login | Public |
| `/dashboard` | Dashboard | Protected |
| `/farmers` | FarmerList | Protected |
| `/farmers/new` | FarmerForm | Protected |
| `/farmers/:id` | FarmerDetail | Protected |
| `/farmers/:id/edit` | FarmerForm | Protected |
| `/equipment/new` | EquipmentForm | Protected |
| `/home-gardens/new` | HomeGardenForm | Protected |
| `/csa-agriculture/new` | CSAAgricultureForm | Protected |
| `/agro-wells/new` | AgroWellForm | Protected |
| `/poultry/new` | PoultryForm | Protected |

## Development Workflow

### Setup
```bash
npm install
cp .env.example .env
# Edit .env with your API URL
```

### Development Server
```bash
npm start
```
Runs on http://localhost:3000

### Building
```bash
npm run build
```
Creates optimized production build in `build/` folder

### Testing
```bash
npm test
```

## Code Style

### Naming Conventions
- **Components**: PascalCase (e.g., `FarmerList.tsx`)
- **Services**: camelCase with 'Service' suffix (e.g., `farmerService.ts`)
- **Types**: PascalCase (e.g., `Farmer`, `Equipment`)
- **Functions**: camelCase (e.g., `handleSubmit`, `loadFarmers`)

### Component Structure
```tsx
// Imports
import React, { useState, useEffect } from 'react';

// Component
const ComponentName: React.FC = () => {
  // State
  const [data, setData] = useState();
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

## Common Issues

### 1. API Connection
If you get API connection errors:
- Verify the API is running
- Check REACT_APP_API_BASE_URL in .env
- Check CORS settings on the API

### 2. Authentication
If authentication fails:
- Clear localStorage
- Verify JWT token format
- Check token expiration

### 3. Build Errors
If build fails with linting errors:
- Check ESLint warnings
- Ensure all imports are used
- Fix TypeScript type errors

## Future Enhancements

Potential improvements:
1. Add list views for all data modules (currently only forms exist)
2. Implement pagination for all list views
3. Add filtering and sorting capabilities
4. Implement form edit functionality for all modules
5. Add data visualization (charts, graphs)
6. Implement export functionality (CSV, PDF)
7. Add user management and role-based access control
8. Implement offline support with service workers
9. Add internationalization (i18n) for multiple languages
10. Implement unit and integration tests for all components

## Support

For issues or questions:
1. Check this development guide
2. Review the README.md
3. Check the API documentation
4. Open an issue on GitHub
