// Global variables
let employees = [];
let floorAreas = [];
let selectedDate = new Date().toISOString().split('T')[0];
let dailyCheckins = {}; // Store daily check-in data
let employeeHistory = {}; // Store employee history and basic info
let currentLocation = 'nyc'; // Default location

// Floor plan data for different locations
const floorPlanData = {
    nyc: {
        areas: [
            { name: 'Barclay', capacity: 18, x: 10, y: 5, width: 200, height: 120 },
            { name: 'Hudson', capacity: 26, x: 10, y: 140, width: 180, height: 150 },
            { name: 'Jersey', capacity: 14, x: 10, y: 300, width: 160, height: 100 },
            { name: 'Empire', capacity: 6, x: 220, y: 80, width: 120, height: 80 },
            { name: 'Training Area', capacity: 20, x: 10, y: 420, width: 200, height: 120 },
            { name: 'Ellis', capacity: 10, x: 10, y: 560, width: 140, height: 80 },
            { name: 'Liberty', capacity: 6, x: 220, y: 180, width: 100, height: 60 },
            { name: 'Manahata', capacity: 8, x: 360, y: 40, width: 120, height: 80 },
            { name: 'Woolworth', capacity: 8, x: 360, y: 140, width: 120, height: 80 },
            { name: 'St. Paul', capacity: 6, x: 360, y: 240, width: 100, height: 60 },
            { name: 'Roebling', capacity: 8, x: 360, y: 320, width: 120, height: 80 },
            { name: 'Governors', capacity: 8, x: 360, y: 420, width: 120, height: 80 }
        ]
    },
    la: {
        areas: [
            { name: 'Hollywood', capacity: 15, x: 10, y: 5, width: 180, height: 100 },
            { name: 'Venice', capacity: 20, x: 10, y: 120, width: 200, height: 120 },
            { name: 'Santa Monica', capacity: 12, x: 10, y: 260, width: 160, height: 90 },
            { name: 'Beverly Hills', capacity: 8, x: 220, y: 60, width: 120, height: 80 },
            { name: 'Downtown', capacity: 16, x: 10, y: 370, width: 180, height: 110 },
            { name: 'Westside', capacity: 10, x: 220, y: 160, width: 140, height: 80 },
            { name: 'Pasadena', capacity: 6, x: 220, y: 260, width: 100, height: 60 },
            { name: 'Malibu', capacity: 4, x: 360, y: 40, width: 100, height: 60 },
            { name: 'Culver City', capacity: 8, x: 360, y: 120, width: 120, height: 80 },
            { name: 'Glendale', capacity: 6, x: 360, y: 220, width: 100, height: 60 },
            { name: 'Burbank', capacity: 8, x: 360, y: 300, width: 120, height: 80 },
            { name: 'Studio City', capacity: 6, x: 360, y: 400, width: 100, height: 60 }
        ]
    },
    shanghai: {
        areas: [
            { name: 'Pudong', capacity: 25, x: 10, y: 5, width: 220, height: 140 },
            { name: 'Puxi', capacity: 20, x: 10, y: 160, width: 200, height: 120 },
            { name: 'Lujiazui', capacity: 15, x: 10, y: 300, width: 180, height: 100 },
            { name: 'Xintiandi', capacity: 10, x: 240, y: 80, width: 140, height: 80 },
            { name: 'Jing\'an', capacity: 12, x: 10, y: 420, width: 160, height: 90 },
            { name: 'Huangpu', capacity: 8, x: 240, y: 180, width: 120, height: 70 },
            { name: 'Hongkou', capacity: 6, x: 240, y: 270, width: 100, height: 60 },
            { name: 'Yangpu', capacity: 8, x: 400, y: 40, width: 120, height: 80 },
            { name: 'Changning', capacity: 10, x: 400, y: 140, width: 140, height: 80 },
            { name: 'Putuo', capacity: 6, x: 400, y: 240, width: 100, height: 60 },
            { name: 'Minhang', capacity: 8, x: 400, y: 320, width: 120, height: 80 },
            { name: 'Songjiang', capacity: 4, x: 400, y: 420, width: 80, height: 50 }
        ]
    }
};

// Employee lists for different locations
const employeeLists = {
    nyc: [
        { name: 'Stefan Abel', email: 'stefan.abel@company.com', dept: 'Technica', seat: 'BA01' },
        { name: 'Jlees Ahmed', email: 'jlees.ahmed@company.com', dept: 'Engineering', seat: 'HU02' },
        { name: 'Kristen Alexander', email: 'kristen.alexander@company.com', dept: 'Technica', seat: 'JE03' },
        { name: 'Yumeng An', email: 'yumeng.an@company.com', dept: 'Technica', seat: 'EM04' },
        { name: 'Gary Anderson', email: 'gary.anderson@company.com', dept: 'Technica', seat: 'TR05' },
        { name: 'David Appel', email: 'david.appel@company.com', dept: 'Marketing', seat: 'EL06' },
        { name: 'Elizabeth Austin', email: 'elizabeth.austin@company.com', dept: 'Technica', seat: 'LI07' },
        { name: 'Michael Baker', email: 'michael.baker@company.com', dept: 'HR', seat: 'MA08' },
        { name: 'Sarah Chen', email: 'sarah.chen@company.com', dept: 'Finance', seat: 'WO09' },
        { name: 'John Davis', email: 'john.davis@company.com', dept: 'Engineering', seat: 'SP10' },
        { name: 'Lisa Evans', email: 'lisa.evans@company.com', dept: 'Training', seat: 'RO11' },
        { name: 'Frank Garcia', email: 'frank.garcia@company.com', dept: 'Legal', seat: 'GV12' }
    ],
    la: [
        { name: 'Alex Rodriguez', email: 'alex.rodriguez@company.com', dept: 'Engineering', seat: 'HO01' },
        { name: 'Emma Wilson', email: 'emma.wilson@company.com', dept: 'Design', seat: 'VE02' },
        { name: 'James Brown', email: 'james.brown@company.com', dept: 'Marketing', seat: 'SM03' },
        { name: 'Sophie Davis', email: 'sophie.davis@company.com', dept: 'Product', seat: 'BH04' },
        { name: 'Michael Chen', email: 'michael.chen@company.com', dept: 'Engineering', seat: 'DT05' },
        { name: 'Olivia Taylor', email: 'olivia.taylor@company.com', dept: 'Sales', seat: 'WS06' },
        { name: 'David Kim', email: 'david.kim@company.com', dept: 'Finance', seat: 'PA07' },
        { name: 'Isabella Lee', email: 'isabella.lee@company.com', dept: 'HR', seat: 'MA08' },
        { name: 'Christopher Wang', email: 'christopher.wang@company.com', dept: 'Engineering', seat: 'CC09' },
        { name: 'Ava Johnson', email: 'ava.johnson@company.com', dept: 'Design', seat: 'GL10' },
        { name: 'Daniel Smith', email: 'daniel.smith@company.com', dept: 'Marketing', seat: 'BU11' },
        { name: 'Mia Garcia', email: 'mia.garcia@company.com', dept: 'Product', seat: 'SC12' }
    ],
    shanghai: [
        { name: 'Li Wei', email: 'li.wei@company.com', dept: 'Engineering', seat: 'PD01' },
        { name: 'Zhang Ming', email: 'zhang.ming@company.com', dept: 'Design', seat: 'PX02' },
        { name: 'Wang Fang', email: 'wang.fang@company.com', dept: 'Marketing', seat: 'LJ03' },
        { name: 'Chen Hao', email: 'chen.hao@company.com', dept: 'Product', seat: 'XT04' },
        { name: 'Liu Yan', email: 'liu.yan@company.com', dept: 'Engineering', seat: 'JA05' },
        { name: 'Yang Jun', email: 'yang.jun@company.com', dept: 'Sales', seat: 'HP06' },
        { name: 'Zhao Lei', email: 'zhao.lei@company.com', dept: 'Finance', seat: 'HK07' },
        { name: 'Wu Xia', email: 'wu.xia@company.com', dept: 'HR', seat: 'YP08' },
        { name: 'Sun Jing', email: 'sun.jing@company.com', dept: 'Engineering', seat: 'CN09' },
        { name: 'Ma Lin', email: 'ma.lin@company.com', dept: 'Design', seat: 'PT10' },
        { name: 'Huang Wei', email: 'huang.wei@company.com', dept: 'Marketing', seat: 'MH11' },
        { name: 'Zhou Min', email: 'zhou.min@company.com', dept: 'Product', seat: 'SJ12' }
    ]
};

// Employee list for daily check-ins (current location)
const employeeList = employeeLists[currentLocation] || employeeLists.nyc;

// Sample employee data (for backward compatibility)
const sampleEmployees = employeeList.map(emp => ({
    name: emp.name,
    seat: 'TBD',
    dept: emp.dept,
    status: 'not-scheduled'
}));

// Status options
const statusOptions = {
    'working-office': { label: 'Working From the Office', color: '#3b82f6' },
    'working-remote': { label: 'Working Remotely', color: '#94a3b8' },
    'traveling': { label: 'Traveling for Business', color: '#10b981' },
    'out-office': { label: 'Out of Office', color: '#f59e0b' },
    'not-scheduled': { label: 'Not in / Scheduled', color: '#d1d5db' },
    'emergency': { label: 'Emergency Response Team In Office', color: '#ef4444' }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Seating Chart App initializing...');
    try {
        initializeApp();
        console.log('Seating Chart App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

function initializeApp() {
    loadData();
    renderFloorPlan();
    renderEmployeeTable();
    setupEventListeners();
    updateLastUpdated();
}

// Data management
function loadData() {
    const savedEmployees = localStorage.getItem(`seatingChart_employees_${currentLocation}`);
    const savedDate = localStorage.getItem('seatingChart_date');
    const savedDailyCheckins = localStorage.getItem(`seatingChart_dailyCheckins_${currentLocation}`);
    const savedEmployeeHistory = localStorage.getItem(`seatingChart_employeeHistory_${currentLocation}`);
    
    if (savedEmployees) {
        employees = JSON.parse(savedEmployees);
    } else {
        // Initialize with current location's employee list
        employees = employeeLists[currentLocation] || employeeLists.nyc;
        saveData();
    }
    
    if (savedDailyCheckins) {
        dailyCheckins = JSON.parse(savedDailyCheckins);
    }
    
    if (savedEmployeeHistory) {
        employeeHistory = JSON.parse(savedEmployeeHistory);
    }
    
    if (savedDate) {
        selectedDate = savedDate;
        document.getElementById('datePicker').value = selectedDate;
    }
}

function saveData() {
    localStorage.setItem(`seatingChart_employees_${currentLocation}`, JSON.stringify(employees));
    localStorage.setItem('seatingChart_date', selectedDate);
    localStorage.setItem(`seatingChart_dailyCheckins_${currentLocation}`, JSON.stringify(dailyCheckins));
    localStorage.setItem(`seatingChart_employeeHistory_${currentLocation}`, JSON.stringify(employeeHistory));
    updateLastUpdated();
}

function updateLastUpdated() {
    const now = new Date();
    const lastUpdatedBy = localStorage.getItem('seatingChart_lastUpdatedBy') || 'System';
    document.getElementById('lastUpdatedBy').textContent = lastUpdatedBy;
    document.getElementById('lastUpdatedDate').textContent = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Floor plan rendering
function renderFloorPlan() {
    console.log('Rendering floor plan...');
    const floorPlan = document.getElementById('floorPlan');
    if (!floorPlan) {
        console.error('Floor plan element not found');
        return;
    }
    
    floorPlan.innerHTML = '';
    
    const currentFloorPlan = floorPlanData[currentLocation];
    if (!currentFloorPlan) {
        console.error('Floor plan not found for location:', currentLocation);
        return;
    }
    
    currentFloorPlan.areas.forEach(area => {
        const areaElement = createFloorArea(area);
        floorPlan.appendChild(areaElement);
        
        // Add seats for this area
        const seatCount = Math.min(area.capacity, 12); // Limit seats for visual clarity
        for (let i = 1; i <= seatCount; i++) {
            const seat = createSeat(area, i);
            floorPlan.appendChild(seat);
        }
    });
    console.log('Floor plan rendered successfully');
}

function createFloorArea(area) {
    const areaElement = document.createElement('div');
    areaElement.className = 'floor-area';
    areaElement.style.left = area.x + 'px';
    areaElement.style.top = area.y + 'px';
    areaElement.style.width = area.width + 'px';
    areaElement.style.height = area.height + 'px';
    
    areaElement.innerHTML = `
        <div class="area-name">${area.name}</div>
        <div class="area-capacity">Capacity: ${area.capacity}</div>
    `;
    
    return areaElement;
}

function createSeat(area, seatNumber) {
    const seatElement = document.createElement('div');
    seatElement.className = 'seat';
    
    // Calculate seat position within the area
    const seatsPerRow = 4;
    const row = Math.floor((seatNumber - 1) / seatsPerRow);
    const col = (seatNumber - 1) % seatsPerRow;
    
    const seatX = area.x + 10 + (col * 25);
    const seatY = area.y + 25 + (row * 25);
    
    seatElement.style.left = seatX + 'px';
    seatElement.style.top = seatY + 'px';
    
    // Generate seat ID
    const seatId = generateSeatId(area.name, seatNumber);
    seatElement.textContent = seatNumber;
    seatElement.dataset.seatId = seatId;
    
    // Check if seat is occupied
    const employee = employees.find(emp => emp.seat === seatId);
    if (employee) {
        seatElement.classList.add('occupied');
        
        // Check if employee has checked in today
        const todayKey = selectedDate;
        const hasCheckedIn = dailyCheckins[todayKey] && 
                           dailyCheckins[todayKey].some(checkin => checkin.employeeName === employee.name);
        
        // Add status dot
        const statusDot = document.createElement('div');
        statusDot.className = `status-dot ${employee.status}`;
        seatElement.appendChild(statusDot);
        
        // Add check-in indicator if they've checked in today
        if (hasCheckedIn) {
            const checkinIndicator = document.createElement('div');
            checkinIndicator.className = 'checkin-indicator';
            checkinIndicator.innerHTML = '✓';
            seatElement.appendChild(checkinIndicator);
        }
        
        // Add tooltip
        const checkinStatus = hasCheckedIn ? ' (Checked in today)' : ' (Not checked in today)';
        seatElement.title = `${employee.name} - ${statusOptions[employee.status].label}${checkinStatus}`;
    }
    
    seatElement.addEventListener('click', () => handleSeatClick(seatId));
    
    return seatElement;
}

function generateSeatId(areaName, seatNumber) {
    const areaCode = areaName.substring(0, 2).toUpperCase();
    return `${areaCode}${seatNumber.toString().padStart(2, '0')}`;
}

function handleSeatClick(seatId) {
    const employee = employees.find(emp => emp.seat === seatId);
    if (employee) {
        // Show employee info or allow editing
        alert(`Seat ${seatId} is occupied by ${employee.name} (${statusOptions[employee.status].label})`);
    } else {
        // Allow assigning to this seat
        openCheckinModal(seatId);
    }
}

// Employee table rendering
function renderEmployeeTable() {
    const tableBody = document.getElementById('employeeTableBody');
    tableBody.innerHTML = '';
    
    employees.forEach(employee => {
        const row = createEmployeeRow(employee);
        tableBody.appendChild(row);
    });
}

function createEmployeeRow(employee) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="employee-name">${employee.name}</td>
        <td class="employee-seat">${employee.seat}</td>
        <td class="employee-dept">${employee.dept}</td>
        <td class="employee-status">
            <div class="status-dot ${employee.status}"></div>
            ${statusOptions[employee.status].label}
        </td>
    `;
    
    row.addEventListener('click', () => editEmployee(employee));
    
    return row;
}

// Search functionality
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchInput);
    
    // Check-in modal
    const checkinBtn = document.getElementById('checkinBtn');
    const modal = document.getElementById('checkinModal');
    const closeModal = document.getElementById('closeModal');
    const cancelCheckin = document.getElementById('cancelCheckin');
    const submitCheckin = document.getElementById('submitCheckin');
    
    checkinBtn.addEventListener('click', () => openCheckinModal());
    closeModal.addEventListener('click', closeCheckinModal);
    cancelCheckin.addEventListener('click', closeCheckinModal);
    submitCheckin.addEventListener('click', handleCheckinSubmit);
    
    // Date picker
    const datePicker = document.getElementById('datePicker');
    datePicker.addEventListener('change', handleDateChange);
    
    // Location selector
    const locationSelect = document.getElementById('locationSelect');
    locationSelect.addEventListener('change', handleLocationChange);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCheckinModal();
        }
    });
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const clearSearch = document.getElementById('clearSearch');
    const tableBody = document.getElementById('employeeTableBody');
    
    if (searchTerm) {
        clearSearch.style.display = 'block';
    } else {
        clearSearch.style.display = 'none';
    }
    
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const name = row.querySelector('.employee-name').textContent.toLowerCase();
        const seat = row.querySelector('.employee-seat').textContent.toLowerCase();
        const dept = row.querySelector('.employee-dept').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || seat.includes(searchTerm) || dept.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function clearSearchInput() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    handleSearch();
}

// Check-in modal functionality
function openCheckinModal(seatId = null) {
    const modal = document.getElementById('checkinModal');
    const seatSelect = document.getElementById('employeeSeat');
    
    // Populate seat options
    seatSelect.innerHTML = '<option value="">Select a seat...</option>';
    floorPlanData.areas.forEach(area => {
        const seatCount = Math.min(area.capacity, 12);
        for (let i = 1; i <= seatCount; i++) {
            const seatId = generateSeatId(area.name, i);
            const isOccupied = employees.some(emp => emp.seat === seatId);
            const option = document.createElement('option');
            option.value = seatId;
            option.textContent = `${seatId} (${area.name})`;
            option.disabled = isOccupied;
            seatSelect.appendChild(option);
        }
    });
    
    if (seatId) {
        seatSelect.value = seatId;
    }
    
    // Clear form
    document.getElementById('employeeName').value = '';
    document.getElementById('employeeDept').value = '';
    document.getElementById('employeeStatus').value = 'working-office';
    
    modal.classList.add('show');
}

function closeCheckinModal() {
    const modal = document.getElementById('checkinModal');
    modal.classList.remove('show');
    
    // Reset editing state
    window.editingEmployee = null;
    document.getElementById('submitCheckin').textContent = 'Submit';
}

function handleCheckinSubmit() {
    const name = document.getElementById('employeeName').value.trim();
    const seat = document.getElementById('employeeSeat').value;
    const dept = document.getElementById('employeeDept').value.trim();
    const status = document.getElementById('employeeStatus').value;
    
    if (!name || !seat || !dept) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Check if we're editing an existing employee
    if (window.editingEmployee) {
        // Update existing employee
        const index = employees.findIndex(emp => emp.seat === window.editingEmployee.seat);
        if (index !== -1) {
            employees[index] = { name, seat, dept, status };
        }
        window.editingEmployee = null;
        document.getElementById('submitCheckin').textContent = 'Submit';
    } else {
        // Check if seat is already occupied
        const existingEmployee = employees.find(emp => emp.seat === seat);
        if (existingEmployee) {
            alert(`Seat ${seat} is already occupied by ${existingEmployee.name}.`);
            return;
        }
        
        // Add new employee
        const newEmployee = { name, seat, dept, status };
        employees.push(newEmployee);
    }
    
    saveData();
    renderFloorPlan();
    renderEmployeeTable();
    closeCheckinModal();
    
    // Update last updated by
    localStorage.setItem('seatingChart_lastUpdatedBy', name);
    updateLastUpdated();
}

function editEmployee(employee) {
    if (confirm(`Edit ${employee.name}?`)) {
        openCheckinModal(employee.seat);
        document.getElementById('employeeName').value = employee.name;
        document.getElementById('employeeDept').value = employee.dept;
        document.getElementById('employeeStatus').value = employee.status;
        
        // Change submit button text
        document.getElementById('submitCheckin').textContent = 'Update';
        
        // Store reference to employee being edited
        window.editingEmployee = employee;
    }
}

function handleDateChange() {
    selectedDate = document.getElementById('datePicker').value;
    saveData();
    // In a real application, you would load data for the selected date
    console.log('Date changed to:', selectedDate);
}

function handleLocationChange() {
    const location = document.getElementById('locationSelect').value;
    currentLocation = location;
    
    // Reload data for the new location
    loadData();
    renderFloorPlan();
    renderEmployeeTable();
    
    console.log('Location changed to:', location);
}

// Utility functions
function getStatusColor(status) {
    return statusOptions[status]?.color || '#d1d5db';
}

function getStatusLabel(status) {
    return statusOptions[status]?.label || 'Unknown';
}

// Debug functions for development
function addSampleData() {
    employees = [...sampleEmployees];
    saveData();
    renderFloorPlan();
    renderEmployeeTable();
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data?')) {
        employees = [];
        saveData();
        renderFloorPlan();
        renderEmployeeTable();
    }
}

// Daily check-in functions
function recordDailyCheckin(employeeName, status) {
    const todayKey = selectedDate;
    
    if (!dailyCheckins[todayKey]) {
        dailyCheckins[todayKey] = [];
    }
    
    // Check if already checked in today
    const existingCheckin = dailyCheckins[todayKey].find(checkin => checkin.employeeName === employeeName);
    if (existingCheckin) {
        // Update existing check-in
        existingCheckin.status = status;
        existingCheckin.checkinTime = new Date().toISOString();
    } else {
        // Add new check-in
        dailyCheckins[todayKey].push({
            employeeName,
            status,
            checkinTime: new Date().toISOString(),
            location: currentLocation
        });
    }
    
    // Update employee history
    if (!employeeHistory[employeeName]) {
        employeeHistory[employeeName] = {
            name: employeeName,
            checkins: []
        };
    }
    
    // Add to history
    employeeHistory[employeeName].checkins.push({
        date: todayKey,
        status,
        checkinTime: new Date().toISOString(),
        location: currentLocation
    });
    
    saveData();
    renderFloorPlan(); // Refresh the floor plan to show check-in status
}

// Export functions for debugging
window.seatingChart = {
    addSampleData,
    clearAllData,
    employees: () => employees,
    saveData,
    recordDailyCheckin,
    dailyCheckins: () => dailyCheckins,
    employeeHistory: () => employeeHistory
};
