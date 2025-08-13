# Seating Chart Check-In

🌐 **Live Website**: [https://szhang.github.io/SeatChart](https://szhang.github.io/SeatChart)

A modern, responsive web application for managing daily seating chart check-ins. Built with vanilla HTML, CSS, and JavaScript, this application allows anyone with the link to view and update seating assignments with real-time status indicators.

## Features

### 🏢 Interactive Floor Plan
- Visual representation of office areas with seating capacity
- Color-coded status indicators for each seat
- Click-to-interact seats for quick check-ins
- Responsive design that works on all devices

### 👥 Employee Management
- Searchable employee list with real-time filtering
- Department and status tracking
- Easy check-in/check-out functionality
- Status legend with color coding

### 📊 Status Tracking
- **Working From the Office** (Blue)
- **Working Remotely** (Gray)
- **Traveling for Business** (Green)
- **Out of Office** (Yellow)
- **Not in / Scheduled** (White/Gray)
- **Emergency Response Team In Office** (Red)

### 🔧 Modern Features
- Local storage for data persistence
- Responsive design for mobile and desktop
- Real-time search functionality
- Date and location selection
- Last updated tracking

## Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your site will be available at `https://yourusername.github.io/SeatChart`

### Option 2: Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SeatChart.git
   cd SeatChart
   ```

2. Open `index.html` in your web browser or serve with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Visit `http://localhost:8000` in your browser

## Usage

### For Employees
1. Click the "CHECK IN" button or click on an empty seat
2. Fill in your name, select your seat, and choose your department
3. Select your current status
4. Click "Submit" to check in

### For Managers
1. View the floor plan to see current occupancy
2. Use the search function to find specific employees
3. Click on employee names to edit their information
4. Monitor status changes in real-time

### Features for Debugging
Open the browser console and use these commands:
- `seatingChart.addSampleData()` - Load sample data
- `seatingChart.clearAllData()` - Clear all data
- `seatingChart.employees()` - View current employee data

## Customization

### Adding New Areas
Edit the `floorPlanData` object in `script.js`:
```javascript
const floorPlanData = {
    areas: [
        { name: 'Your Area', capacity: 10, x: 10, y: 10, width: 150, height: 100 },
        // Add more areas...
    ]
};
```

### Modifying Status Options
Update the `statusOptions` object in `script.js`:
```javascript
const statusOptions = {
    'your-status': { label: 'Your Status Label', color: '#your-color' },
    // Add more statuses...
};
```

### Styling
- Main styles are in `styles.css`
- Color scheme can be modified in the CSS variables
- Responsive breakpoints are defined for mobile optimization

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Data Storage

The application uses browser localStorage for data persistence. This means:
- Data is stored locally in each user's browser
- No server required
- Data persists between sessions
- Each user has their own data (not shared across devices)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and feature requests, please create an issue in the GitHub repository.

---

Built with ❤️ using vanilla HTML, CSS, and JavaScript
