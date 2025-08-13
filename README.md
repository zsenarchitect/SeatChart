# SeatChart - Office Seating Management

🌐 **Live Website**: [https://szhang.github.io/SeatChart](https://szhang.github.io/SeatChart)

A professional seating chart check-in system for office management. Track employee status and seating assignments in real-time across multiple office locations.

## 🚀 Quick Start

1. **View the system**: Visit [https://szhang.github.io/SeatChart](https://szhang.github.io/SeatChart)
2. **Test locally**: Open `index.html` in your browser
3. **Check errors**: Open browser console and type `seatChartErrors.stats()`

## 📊 Google Sheets Integration

### Setup Google Sheets for Employee Management:

1. **Create a Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Name the first sheet "Employees"

2. **Set up the headers (Row 1)**
   ```
   Name | Email | Department | Seat | Location | Status | Start Date | Manager | Phone | Notes
   ```

3. **Get Google Sheets API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create credentials (API Key)
   - Copy the API key

4. **Configure in the App**
   - Click "Google Sheets Setup" button
   - Enter your API key and spreadsheet ID
   - Test the connection
   - Save configuration

5. **Sync Data**
   - Add employee data in Google Sheets
   - Click "Sync with Sheets" to update the app

### Google Sheets Template:
The app provides a template with sample data structure. Click "Create Template" in the setup modal for detailed instructions.

## 📋 Manager Guide - How to Update Employee Data

### 1. **Add New Hire**
**Option A: Using Google Sheets (Recommended)**
- Click "Google Sheets Setup" button in the app
- Configure your Google Sheets API key and spreadsheet ID
- Add employee data directly in Google Sheets
- Click "Sync with Sheets" to update the app

**Option B: Manual Code Update**
- Open `assets/js/app.js`
- Find the `employeeLists` section
- Add new employee to the appropriate office location:
```javascript
{ name: 'John Doe', email: 'john.doe@company.com', dept: 'Engineering', seat: 'SA06' }
```

### 2. **Move Employee to Different Seat**
- Open `assets/js/app.js`
- Find the employee in `employeeLists`
- Update their `seat` property to the new seat ID (e.g., 'SB03')

### 3. **Update Office Map**
- Open `assets/js/app.js`
- Find the `floorPlanData` section
- Modify seat coordinates or add new areas:
```javascript
seats: {
    NEW01: { x: 0.5, y: 0.5 }, // Add new seat
    // ... existing seats
}
```

### 4. **Change Default Email Template**
- Open `assets/js/app.js`
- Find the email template in the notification system
- Update the message format as needed

### 5. **Add New Office Location**
- Open `assets/js/app.js`
- Add new location to `floorPlanData` and `employeeLists`
- Update the location selector in `index.html`

## 🔧 Error Tracking

### View Errors Locally
1. Open browser console (F12)
2. Type: `seatChartErrors.stats()` - See error statistics
3. Type: `seatChartErrors.export()` - Export all errors
4. Type: `seatChartErrors.clear()` - Clear error history

### Report Errors to GitHub
1. Open `assets/js/error-tracker.js`
2. Set `enabled: true` in the config section
3. Add your GitHub token
4. Critical errors will automatically create GitHub issues

## 📁 File Structure

```
SeatChart/
├── index.html              # Main application page
├── assets/
│   ├── css/
│   │   └── main.css        # Styles
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   └── error-tracker.js # Error tracking system
│   └── images/             # Images and icons
├── pages/                  # Additional pages (if needed)
├── manifest.json           # PWA configuration
└── README.md              # This file
```

## 🛠️ Development

### Local Testing
```bash
# Start local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Error Monitoring
- Errors are tracked automatically
- Check browser console for real-time error info
- Use `seatChartErrors` object for debugging

## 📞 Support

For issues or questions:
1. Check error logs: `seatChartErrors.stats()`
2. Export error data: `seatChartErrors.export()`
3. Create GitHub issue with error details

---

**Last Updated**: August 2025
**Version**: 1.0.0
