# Farmer Data System Web UI

The Climate Smart Irrigated Agriculture Project (CSIAP), in collaboration with the FAO and World Bank, aims to digitize and centralize farmer-level data to support data-driven agricultural planning and policy-making in Sri Lanka. This repository contains the Web UI for the system.

## Features

- **JWT Authentication**: Secure login with JWT token-based authentication
- **Farmer Management**: Add, update, view, and search farmers by NIC or name
- **Data Entry Forms**:
  - Equipment tracking
  - Home Garden management
  - CSA Agriculture records
  - Agro Well information
  - Poultry Farming data
- **Field Validation**: Built-in form validation with error messages
- **API Integration**: Seamless integration with the backend API

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Climate-Smart-Agriculture/Farmer-Data-System-Web-Ui.git
cd Farmer-Data-System-Web-Ui
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the API base URL:
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

## Running the Application

### Development Mode

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

The build folder will contain the production-ready static files.

### Run Tests

```bash
npm test
```

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── farmer/         # Farmer management components
│   └── forms/          # Data entry forms
├── contexts/           # React contexts (Auth)
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (validation)
└── config/             # Configuration files
```

## API Integration

This application integrates with the [Farmer Data System API](https://github.com/Climate-Smart-Agriculture/Farmer-Data-System-Api).

Ensure the backend API is running and accessible before using this application.

## Default Routes

- `/login` - Login page
- `/dashboard` - Main dashboard
- `/farmers` - Farmer list and search
- `/farmers/new` - Add new farmer
- `/farmers/:id` - View farmer details
- `/farmers/:id/edit` - Edit farmer
- `/equipment/new` - Add equipment
- `/home-gardens/new` - Add home garden
- `/csa-agriculture/new` - Add CSA agriculture record
- `/agro-wells/new` - Add agro well
- `/poultry/new` - Add poultry farming record

## Technologies Used

- React 19
- TypeScript
- React Router v6
- Axios for API calls
- JWT for authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue in the GitHub repository.
