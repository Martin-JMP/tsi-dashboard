# France-Latvia Dashboard

This dashboard provides a comprehensive comparison of key indicators between France and Latvia across multiple domains including economics, demographics, society, and environment.

## Features

- **Home Page Overview**: Quick glance at key statistics across all categories
- **Economic Indicators**: Detailed GDP, inflation, and financial metrics
- **Labor Market**: Employment statistics and workforce data
- **Society & Quality of Life**: Health, education, and social development metrics
- **Environment & Energy**: Sustainability and environmental performance data

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install the required chart libraries:
```bash
npm install chart.js react-chartjs-2
# or
yarn add chart.js react-chartjs-2
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Data Source

The dashboard uses data from a CSV file located at `src/app/DB/LIFE KPI(PIB...) FRANCE LATVIA.csv`. The data includes:

- Demographics (population, median age, birth rate)
- Economy (GDP, inflation, unemployment)
- Society (life expectancy, education, healthcare)
- Environment (emissions, renewable energy, forest coverage)

## Extending the Dashboard

### Adding New Data

To add new data points:

1. Edit the CSV file in `src/app/DB/`
2. Follow the format: `Group KPI;Indicator;France;Latvia`
3. The dashboard components will automatically update to reflect the new data

### Creating New Visualizations

You can extend the dashboard by:

1. Creating new components in the `components` directory
2. Using the data utilities from `utils/data.ts` to parse and process CSV data
3. Adding new pages in the app directory following the Next.js file structure

## Technologies Used

- Next.js 15.2
- React 19
- TypeScript
- CSS Modules
- Chart.js (recommended for adding charts)

## Project Structure

- `/src/app/components` - Reusable UI components
- `/src/app/utils` - Data processing utilities
- `/src/app/DB` - Data sources
- `/src/app/[page]` - Individual page components

## License

This project is open source and available for academic and educational purposes.
