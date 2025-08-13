// Google Sheets Integration for Employee Management
class GoogleSheetsManager {
    constructor() {
        this.apiKey = null;
        this.spreadsheetId = null;
        this.sheetName = 'Employees';
        this.isInitialized = false;
    }

    // Initialize with Google Sheets API credentials
    initialize(apiKey, spreadsheetId) {
        this.apiKey = apiKey;
        this.spreadsheetId = spreadsheetId;
        this.isInitialized = true;
        console.log('Google Sheets Manager initialized');
    }

    // Get employee data from Google Sheets
    async getEmployees() {
        if (!this.isInitialized) {
            throw new Error('Google Sheets Manager not initialized');
        }

        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.sheetName}?key=${this.apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.parseEmployeeData(data.values);
        } catch (error) {
            console.error('Error fetching employee data:', error);
            if (window.errorTracker) {
                window.errorTracker.logError('Google Sheets fetch failed', { error: error.message });
            }
            throw error;
        }
    }

    // Parse raw sheet data into employee objects
    parseEmployeeData(values) {
        if (!values || values.length < 2) {
            return [];
        }

        const headers = values[0];
        const employees = [];

        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            if (row.length >= headers.length) {
                const employee = {
                    name: row[0] || '',
                    email: row[1] || '',
                    dept: row[2] || '',
                    seat: row[3] || '',
                    location: row[4] || 'nyc',
                    status: row[5] || 'working-office',
                    startDate: row[6] || '',
                    manager: row[7] || '',
                    phone: row[8] || '',
                    notes: row[9] || ''
                };
                
                // Only include employees with names
                if (employee.name.trim()) {
                    employees.push(employee);
                }
            }
        }

        return employees;
    }

    // Update employee data in Google Sheets
    async updateEmployee(employeeData) {
        if (!this.isInitialized) {
            throw new Error('Google Sheets Manager not initialized');
        }

        try {
            // First, find the row with this employee
            const allEmployees = await this.getEmployees();
            const employeeIndex = allEmployees.findIndex(emp => 
                emp.email === employeeData.email || emp.name === employeeData.name
            );

            if (employeeIndex === -1) {
                // Add new employee
                return await this.addEmployee(employeeData);
            } else {
                // Update existing employee
                return await this.updateEmployeeRow(employeeIndex + 2, employeeData); // +2 for header and 0-based index
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            if (window.errorTracker) {
                window.errorTracker.logError('Google Sheets update failed', { error: error.message });
            }
            throw error;
        }
    }

    // Add new employee to Google Sheets
    async addEmployee(employeeData) {
        const values = [
            [
                employeeData.name,
                employeeData.email,
                employeeData.dept,
                employeeData.seat,
                employeeData.location,
                employeeData.status,
                employeeData.startDate,
                employeeData.manager,
                employeeData.phone,
                employeeData.notes
            ]
        ];

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.sheetName}:append?valueInputOption=RAW&key=${this.apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: values
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Update specific row in Google Sheets
    async updateEmployeeRow(rowIndex, employeeData) {
        const range = `${this.sheetName}!A${rowIndex}:J${rowIndex}`;
        const values = [
            [
                employeeData.name,
                employeeData.email,
                employeeData.dept,
                employeeData.seat,
                employeeData.location,
                employeeData.status,
                employeeData.startDate,
                employeeData.manager,
                employeeData.phone,
                employeeData.notes
            ]
        ];

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?valueInputOption=RAW&key=${this.apiKey}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: values
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Delete employee from Google Sheets
    async deleteEmployee(email) {
        if (!this.isInitialized) {
            throw new Error('Google Sheets Manager not initialized');
        }

        try {
            const allEmployees = await this.getEmployees();
            const employeeIndex = allEmployees.findIndex(emp => emp.email === email);

            if (employeeIndex === -1) {
                throw new Error('Employee not found');
            }

            // Note: Google Sheets API doesn't support direct row deletion via REST API
            // This would require using the Google Apps Script or setting the row to empty values
            // For now, we'll mark the employee as inactive
            const employee = allEmployees[employeeIndex];
            employee.status = 'inactive';
            employee.notes = 'Deleted on ' + new Date().toISOString().split('T')[0];
            
            return await this.updateEmployeeRow(employeeIndex + 2, employee);
        } catch (error) {
            console.error('Error deleting employee:', error);
            if (window.errorTracker) {
                window.errorTracker.logError('Google Sheets delete failed', { error: error.message });
            }
            throw error;
        }
    }

    // Sync local data with Google Sheets
    async syncWithLocalData() {
        try {
            const sheetEmployees = await this.getEmployees();
            
            // Update local storage with sheet data
            const employeesByLocation = {
                nyc: [],
                la: [],
                shanghai: []
            };

            sheetEmployees.forEach(emp => {
                const location = emp.location || 'nyc';
                if (employeesByLocation[location]) {
                    employeesByLocation[location].push({
                        name: emp.name,
                        email: emp.email,
                        dept: emp.dept,
                        seat: emp.seat,
                        status: emp.status
                    });
                }
            });

            // Save to localStorage
            Object.keys(employeesByLocation).forEach(location => {
                localStorage.setItem(`seatingChart_employees_${location}`, JSON.stringify(employeesByLocation[location]));
            });

            console.log('Synced with Google Sheets successfully');
            return employeesByLocation;
        } catch (error) {
            console.error('Error syncing with Google Sheets:', error);
            if (window.errorTracker) {
                window.errorTracker.logError('Google Sheets sync failed', { error: error.message });
            }
            throw error;
        }
    }

    // Create a template Google Sheet
    createTemplateSheet() {
        const template = {
            headers: [
                'Name',
                'Email',
                'Department',
                'Seat',
                'Location',
                'Status',
                'Start Date',
                'Manager',
                'Phone',
                'Notes'
            ],
            sampleData: [
                [
                    'John Doe',
                    'john.doe@company.com',
                    'Engineering',
                    'SA01',
                    'nyc',
                    'working-office',
                    '2024-01-15',
                    'Jane Smith',
                    '+1-555-0123',
                    'Full-time employee'
                ],
                [
                    'Jane Smith',
                    'jane.smith@company.com',
                    'Engineering',
                    'SB02',
                    'nyc',
                    'working-remote',
                    '2023-06-01',
                    'Bob Johnson',
                    '+1-555-0124',
                    'Team lead'
                ]
            ]
        };

        return template;
    }
}

// Global instance
window.googleSheetsManager = new GoogleSheetsManager();

// Configuration modal for Google Sheets setup
function showGoogleSheetsConfig() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Google Sheets Configuration</h2>
                <span class="close" onclick="closeGoogleSheetsConfig()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="apiKey">Google Sheets API Key:</label>
                    <input type="password" id="apiKey" placeholder="Enter your Google Sheets API key">
                    <small>Get your API key from <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></small>
                </div>
                <div class="form-group">
                    <label for="spreadsheetId">Spreadsheet ID:</label>
                    <input type="text" id="spreadsheetId" placeholder="Enter spreadsheet ID from URL">
                    <small>Found in the URL: https://docs.google.com/spreadsheets/d/<strong>SPREADSHEET_ID</strong>/edit</small>
                </div>
                <div class="form-group">
                    <label for="sheetName">Sheet Name:</label>
                    <input type="text" id="sheetName" value="Employees" placeholder="Sheet name (default: Employees)">
                </div>
                <div class="form-actions">
                    <button onclick="saveGoogleSheetsConfig()" class="btn btn-primary">Save Configuration</button>
                    <button onclick="testGoogleSheetsConnection()" class="btn btn-secondary">Test Connection</button>
                    <button onclick="createTemplateSheet()" class="btn btn-secondary">Create Template</button>
                </div>
                <div id="configStatus" class="status-message"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load existing config
    const savedApiKey = localStorage.getItem('googleSheets_apiKey');
    const savedSpreadsheetId = localStorage.getItem('googleSheets_spreadsheetId');
    const savedSheetName = localStorage.getItem('googleSheets_sheetName');
    
    if (savedApiKey) document.getElementById('apiKey').value = savedApiKey;
    if (savedSpreadsheetId) document.getElementById('spreadsheetId').value = savedSpreadsheetId;
    if (savedSheetName) document.getElementById('sheetName').value = savedSheetName;
}

function closeGoogleSheetsConfig() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function saveGoogleSheetsConfig() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const spreadsheetId = document.getElementById('spreadsheetId').value.trim();
    const sheetName = document.getElementById('sheetName').value.trim() || 'Employees';
    
    if (!apiKey || !spreadsheetId) {
        showConfigStatus('Please fill in all required fields', 'error');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('googleSheets_apiKey', apiKey);
    localStorage.setItem('googleSheets_spreadsheetId', spreadsheetId);
    localStorage.setItem('googleSheets_sheetName', sheetName);
    
    // Initialize Google Sheets Manager
    window.googleSheetsManager.initialize(apiKey, spreadsheetId);
    window.googleSheetsManager.sheetName = sheetName;
    
    showConfigStatus('Configuration saved successfully!', 'success');
}

async function testGoogleSheetsConnection() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const spreadsheetId = document.getElementById('spreadsheetId').value.trim();
    const sheetName = document.getElementById('sheetName').value.trim() || 'Employees';
    
    if (!apiKey || !spreadsheetId) {
        showConfigStatus('Please fill in API key and spreadsheet ID first', 'error');
        return;
    }
    
    try {
        showConfigStatus('Testing connection...', 'info');
        
        const tempManager = new GoogleSheetsManager();
        tempManager.initialize(apiKey, spreadsheetId);
        tempManager.sheetName = sheetName;
        
        const employees = await tempManager.getEmployees();
        showConfigStatus(`Connection successful! Found ${employees.length} employees.`, 'success');
    } catch (error) {
        showConfigStatus(`Connection failed: ${error.message}`, 'error');
    }
}

function createTemplateSheet() {
    const template = window.googleSheetsManager.createTemplateSheet();
    
    const templateText = `
Google Sheets Template Setup:

1. Create a new Google Sheet
2. Name the first sheet "Employees"
3. Add these headers in row 1:
${template.headers.join(' | ')}

4. Add sample data starting from row 2:
${template.sampleData.map(row => row.join(' | ')).join('\n')}

5. Make sure the sheet is publicly accessible (or shared with appropriate permissions)
6. Copy the spreadsheet ID from the URL
7. Get an API key from Google Cloud Console

Required Google Sheets API permissions:
- Enable Google Sheets API in Google Cloud Console
- Create credentials (API key)
- Make sure the sheet is accessible
    `;
    
    alert(templateText);
}

function showConfigStatus(message, type) {
    const statusDiv = document.getElementById('configStatus');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
}

// Sync button functionality
async function syncWithGoogleSheets() {
    try {
        if (!window.googleSheetsManager.isInitialized) {
            showGoogleSheetsConfig();
            return;
        }
        
        const employeesByLocation = await window.googleSheetsManager.syncWithLocalData();
        
        // Update current location's employees
        const currentLocation = window.currentLocation || 'nyc';
        if (employeesByLocation[currentLocation]) {
            window.employees = employeesByLocation[currentLocation];
            window.renderFloorPlan();
            window.renderEmployeeTable();
        }
        
        alert('Successfully synced with Google Sheets!');
    } catch (error) {
        alert(`Sync failed: ${error.message}`);
    }
}

// Export functions for global access
window.showGoogleSheetsConfig = showGoogleSheetsConfig;
window.closeGoogleSheetsConfig = closeGoogleSheetsConfig;
window.saveGoogleSheetsConfig = saveGoogleSheetsConfig;
window.testGoogleSheetsConnection = testGoogleSheetsConnection;
window.createTemplateSheet = createTemplateSheet;
window.syncWithGoogleSheets = syncWithGoogleSheets;
