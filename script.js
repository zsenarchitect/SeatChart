// Global variables
let employees = [];
let floorAreas = [];
let selectedDate = new Date().toISOString().split('T')[0];

// Sample floor plan data (based on the reference screenshot)
const floorPlanData = {
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
};

// Employee list for daily check-ins
const employeeList = [
    { name: 'Stefan Abel', email: 'stefan.abel@company.com', dept: 'Technica' },
    { name: 'Jlees Ahmed', email: 'jlees.ahmed@company.com', dept: 'Engineering' },
    { name: 'Kristen Alexander', email: 'kristen.alexander@company.com', dept: 'Technica' },
    { name: 'Yumeng An', email: 'yumeng.an@company.com', dept: 'Technica' },
    { name: 'Gary Anderson', email: 'gary.anderson@company.com', dept: 'Technica' },
    { name: 'David Appel', email: 'david.appel@company.com', dept: 'Marketing' },
    { name: 'Elizabeth Austin', email: 'elizabeth.austin@company.com', dept: 'Technica' },
    { name: 'Michael Baker', email: 'michael.baker@company.com', dept: 'HR' },
    { name: 'Sarah Chen', email: 'sarah.chen@company.com', dept: 'Finance' },
    { name: 'John Davis', email: 'john.davis@company.com', dept: 'Engineering' },
    { name: 'Lisa Evans', email: 'lisa.evans@company.com', dept: 'Training' },
    { name: 'Frank Garcia', email: 'frank.garcia@company.com', dept: 'Legal' },
    { name: 'Maria Hernandez', email: 'maria.hernandez@company.com', dept: 'Operations' },
    { name: 'Robert Johnson', email: 'robert.johnson@company.com', dept: 'Sales' },
    { name: 'Jennifer Kim', email: 'jennifer.kim@company.com', dept: 'Marketing' },
    { name: 'Kevin Lee', email: 'kevin.lee@company.com', dept: 'Engineering' },
    { name: 'Amanda Lopez', email: 'amanda.lopez@company.com', dept: 'Design' },
    { name: 'Thomas Moore', email: 'thomas.moore@company.com', dept: 'Product' }
];

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
    const savedEmployees = localStorage.getItem('seatingChart_employees');
    const savedDate = localStorage.getItem('seatingChart_date');
    
    if (savedEmployees) {
        employees = JSON.parse(savedEmployees);
    } else {
        employees = [...sampleEmployees];
        saveData();
    }
    
    if (savedDate) {
        selectedDate = savedDate;
        document.getElementById('datePicker').value = selectedDate;
    }
}

function saveData() {
    localStorage.setItem('seatingChart_employees', JSON.stringify(employees));
    localStorage.setItem('seatingChart_date', selectedDate);
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
    
    floorPlanData.areas.forEach(area => {
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
        const statusDot = document.createElement('div');
        statusDot.className = `status-dot ${employee.status}`;
        seatElement.appendChild(statusDot);
        
        // Add tooltip
        seatElement.title = `${employee.name} - ${statusOptions[employee.status].label}`;
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
    // In a real application, you would load data for the selected location
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

// Export functions for debugging
window.seatingChart = {
    addSampleData,
    clearAllData,
    employees: () => employees,
    saveData
};
