# Legal Analytics Dashboard

A full-stack Business Intelligence solution that provides interactive analytics and visualizations for legal case data. This project demonstrates ETL pipeline implementation, data processing, and interactive dashboard development.

## Features

### ETL Pipeline
- Data extraction from various sources
- Data transformation and standardization
- Loading into SQLite database
- Automated data processing workflow

### Interactive Dashboard
- Real-time case statistics
- Interactive data filtering
- Multiple visualization types:
  - Case distribution charts
  - Success rate analysis
  - Resolution time tracking
- Data export functionality

### Technical Implementation
- Backend API with Flask
- Frontend with React and Material UI
- Interactive charts using Recharts
- SQLite database for data storage

## Tech Stack

### Backend
- Python 3.11+
- Flask (Web Framework)
- Pandas (Data Processing)
- SQLite (Database)
- Flask-CORS (Cross-Origin Resource Sharing)

### Frontend
- React (UI Library)
- Material UI (Component Library)
- Recharts (Visualization Library)
- Vite (Build Tool)


## Setup Instructions

### Backend Setup

1. Create and activate Python virtual environment:
```bash
cd backend
python -m venv .venv
# For Windows:
.venv\Scripts\activate
# For macOS/Linux:
source .venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask application:
```bash
python app.py
```
The backend server will start at http://localhost:5000

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```
The frontend application will be available at http://localhost:5173

## Features and Usage

### Dashboard Overview
- The dashboard displays key metrics including:
  - Total number of cases
  - Active cases count
  - Average resolution time
  - Overall success rate

### Data Filtering
Users can filter data by:
- Case type
- Practice area
- Status
- Search term

### Data Export
- Export case analytics data to CSV format using the "Export Data" button

### Charts and Visualizations
1. Case Distribution Chart
   - Shows distribution of cases by type
   - Includes success rate comparison

2. Case Type Distribution (Pie Chart)
   - Visual representation of case volume by type

3. Resolution Times Chart
   - Displays average, minimum, and maximum resolution times by practice area

## Development Notes

### ETL Pipeline
The ETL pipeline:
1. Extracts data from sample data (can be modified for real data sources)
2. Transforms data by:
   - Standardizing case types and practice areas
   - Calculating case durations
   - Computing success metrics
3. Loads processed data into SQLite database

### API Endpoints
- `/api/cases/stats`: Overall case statistics
- `/api/cases/by-type`: Case distribution by type
- `/api/cases/resolution-times`: Resolution time analysis

### Data Updates
- Data is automatically processed when the backend starts
- The frontend updates in real-time when filters are applied

## Future Enhancements
- Authentication and user roles
- Additional analytics features
- Custom report generation
- Real-time data updates
- More advanced filtering options
- Export options in different formats

## Troubleshooting

### Common Issues
1. Backend not starting
   - Verify Python virtual environment is activated
   - Check if required ports are available
   - Ensure all dependencies are installed

2. Frontend issues
   - Clear npm cache: `npm clean-cache --force`
   - Remove node_modules and reinstall: 
     ```bash
     rm -rf node_modules
     npm install
     ```

3. Database issues
   - Delete the SQLite database file and restart the backend to regenerate