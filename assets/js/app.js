// Global variables
let employees = [];
let floorAreas = [];
let selectedDate = new Date().toISOString().split('T')[0];
let dailyCheckins = {}; // Store daily check-in data
let employeeHistory = {}; // Store employee history and basic info
let currentLocation = 'nyc'; // Default location

// Professional floor plan data structure based on EA Planner
const floorPlanData = {
    nyc: {
        // Seat coordinates using percentage-based positioning (like EA Planner)
        seats: {
            // South section (SG, SF, SE, SD, SC, SB, SA)
            SG01: { x: 0.408347, y: 0.126417 }, SG02: { x: 0.408347, y: 0.101613 }, SG03: { x: 0.408347, y: 0.076808 }, SG04: { x: 0.408347, y: 0.052465 }, SG05: { x: 0.408347, y: 0.028011 },
            SF10: { x: 0.445660, y: 0.126417 }, SF09: { x: 0.445660, y: 0.101613 }, SF08: { x: 0.445660, y: 0.076808 }, SF06: { x: 0.445660, y: 0.028011 },
            SF01: { x: 0.481547, y: 0.126417 }, SF02: { x: 0.481547, y: 0.101613 }, SF03: { x: 0.481547, y: 0.076808 }, SF05: { x: 0.481547, y: 0.028011 },
            SE10: { x: 0.518860, y: 0.126417 }, SE09: { x: 0.518860, y: 0.101613 }, SE08: { x: 0.518860, y: 0.077215 }, SE06: { x: 0.518860, y: 0.028011 },
            SE01: { x: 0.554747, y: 0.126417 }, SE02: { x: 0.554747, y: 0.101613 }, SE03: { x: 0.554747, y: 0.076808 }, SE05: { x: 0.554747, y: 0.028011 },
            SD10: { x: 0.592060, y: 0.126417 }, SD09: { x: 0.592060, y: 0.101613 }, SD08: { x: 0.592060, y: 0.076808 }, SD06: { x: 0.592060, y: 0.028011 },
            SD01: { x: 0.627947, y: 0.126417 }, SD02: { x: 0.627947, y: 0.101613 }, SD03: { x: 0.627947, y: 0.076808 }, SD05: { x: 0.627947, y: 0.028011 },
            SC10: { x: 0.665260, y: 0.126417 }, SC09: { x: 0.665260, y: 0.101613 }, SC08: { x: 0.665260, y: 0.076808 }, SC06: { x: 0.665260, y: 0.028011 },
            SC01: { x: 0.701147, y: 0.126417 }, SC02: { x: 0.701147, y: 0.101613 }, SC03: { x: 0.701147, y: 0.076808 }, SC05: { x: 0.701147, y: 0.028011 },
            SB10: { x: 0.738460, y: 0.126417 }, SB09: { x: 0.738460, y: 0.101613 }, SB08: { x: 0.738460, y: 0.076808 }, SB06: { x: 0.738460, y: 0.028011 },
            SB01: { x: 0.774347, y: 0.126417 }, SB02: { x: 0.774347, y: 0.101613 }, SB03: { x: 0.774347, y: 0.076808 }, SB05: { x: 0.774347, y: 0.028011 },
            SA01: { x: 0.811660, y: 0.126417 }, SA02: { x: 0.811660, y: 0.101613 }, SA03: { x: 0.811660, y: 0.076808 }, SA05: { x: 0.811660, y: 0.028011 },
            
            // North section (NG, NF, NE, ND, NC, NB, NA)
            NG01: { x: 0.812157, y: 0.872255 }, NG02: { x: 0.812157, y: 0.897059 }, NG03: { x: 0.812157, y: 0.921864 }, NG05: { x: 0.812157, y: 0.970660 },
            NF10: { x: 0.774372, y: 0.873158 }, NF09: { x: 0.774372, y: 0.897962 }, NF08: { x: 0.774372, y: 0.922767 }, NF06: { x: 0.774372, y: 0.971563 },
            NF01: { x: 0.738817, y: 0.873158 }, NF02: { x: 0.738817, y: 0.897962 }, NF03: { x: 0.738817, y: 0.922767 }, NF05: { x: 0.738817, y: 0.971563 },
            NE10: { x: 0.701528, y: 0.873158 }, NE09: { x: 0.701528, y: 0.897962 }, NE08: { x: 0.701528, y: 0.922767 }, NE06: { x: 0.701528, y: 0.971563 },
            NE01: { x: 0.665313, y: 0.873158 }, NE02: { x: 0.665313, y: 0.897962 }, NE03: { x: 0.665313, y: 0.922767 }, NE05: { x: 0.665313, y: 0.971563 },
            ND10: { x: 0.628024, y: 0.873158 }, ND09: { x: 0.628024, y: 0.897962 }, ND08: { x: 0.628024, y: 0.922767 }, ND06: { x: 0.628024, y: 0.971563 },
            ND01: { x: 0.592112, y: 0.873158 }, ND02: { x: 0.592112, y: 0.897962 }, ND03: { x: 0.592112, y: 0.922767 }, ND05: { x: 0.592112, y: 0.971563 },
            NC10: { x: 0.554824, y: 0.873158 }, NC09: { x: 0.554824, y: 0.897962 }, NC08: { x: 0.554824, y: 0.922767 }, NC06: { x: 0.554824, y: 0.971563 },
            NC01: { x: 0.518913, y: 0.873158 }, NC02: { x: 0.518913, y: 0.897962 }, NC03: { x: 0.518913, y: 0.922767 }, NC05: { x: 0.518913, y: 0.971563 },
            NB10: { x: 0.481624, y: 0.873158 }, NB09: { x: 0.481624, y: 0.897962 }, NB08: { x: 0.481624, y: 0.922767 }, NB06: { x: 0.481624, y: 0.971563 },
            NB01: { x: 0.445713, y: 0.873158 }, NB02: { x: 0.445713, y: 0.897962 }, NB03: { x: 0.445713, y: 0.922767 }, NB05: { x: 0.445713, y: 0.971563 },
            NA09: { x: 0.408424, y: 0.873158 }, NA08: { x: 0.408424, y: 0.897962 }, NA07: { x: 0.408424, y: 0.922767 }, NA05: { x: 0.408424, y: 0.971563 },
            NA01: { x: 0.372096, y: 0.896306 }, NA02: { x: 0.372096, y: 0.922129 }, NA03: { x: 0.372096, y: 0.945716 },
            
            // West section (WD, WC, WB, WA)
            WD01: { x: 0.110189, y: 0.372462 }, WD02: { x: 0.084365, y: 0.372462 }, WD03: { x: 0.060779, y: 0.372462 }, WD04: { x: 0.036379, y: 0.372462 },
            WD05: { x: 0.036379, y: 0.412315 }, WD06: { x: 0.060779, y: 0.412315 }, WD07: { x: 0.084365, y: 0.412315 }, WD08: { x: 0.110189, y: 0.412315 },
            WC01: { x: 0.110189, y: 0.298893 }, WC02: { x: 0.084365, y: 0.298893 }, WC03: { x: 0.060779, y: 0.298893 }, WC04: { x: 0.036379, y: 0.298893 },
            WC05: { x: 0.036379, y: 0.336056 }, WC06: { x: 0.060779, y: 0.336056 }, WC07: { x: 0.084365, y: 0.336056 }, WC08: { x: 0.110189, y: 0.336056 },
            WB01: { x: 0.110189, y: 0.225521 }, WB02: { x: 0.084365, y: 0.225521 }, WB03: { x: 0.060779, y: 0.225521 }, WB04: { x: 0.036379, y: 0.225521 },
            WB05: { x: 0.036379, y: 0.262690 }, WB06: { x: 0.060779, y: 0.262690 }, WB07: { x: 0.084365, y: 0.262690 }, WB08: { x: 0.110189, y: 0.262690 },
            WA01: { x: 0.110189, y: 0.151443 }, WA02: { x: 0.084365, y: 0.151443 }, WA03: { x: 0.060779, y: 0.151443 }, WA04: { x: 0.036379, y: 0.151443 },
            WA05: { x: 0.036379, y: 0.189522 }, WA06: { x: 0.060779, y: 0.189522 }, WA07: { x: 0.084365, y: 0.189522 }, WA08: { x: 0.110189, y: 0.189522 }
        },
        // Conference room areas
        areas: [
            {
                name: 'Barclay',
                id: 'barclay',
                capacity: 18,
                x: 0.233899, y: 0.056076, width: 0.15, height: 0.08
            },
            {
                name: 'Hudson',
                id: 'hudson',
                capacity: 26,
                x: 0.067818, y: 0.399867, width: 0.14, height: 0.12
            },
            {
                name: 'Empire',
                id: 'empire',
                capacity: 6,
                x: 0.542083, y: 0.24, width: 0.08, height: 0.06
            },
            {
                name: 'Training Area',
                id: 'training-area',
                capacity: 20,
                x: 0.21, y: 0.658690, width: 0.16, height: 0.10
            },
            {
                name: 'Liberty',
                id: 'liberty',
                capacity: 6,
                x: 0.509828, y: 0.76, width: 0.08, height: 0.06
            }
        ]
    },
    la: {
        seats: {
            HO01: { x: 0.1, y: 0.1 }, HO02: { x: 0.15, y: 0.1 }, HO03: { x: 0.2, y: 0.1 }, HO04: { x: 0.25, y: 0.1 },
            VE01: { x: 0.1, y: 0.2 }, VE02: { x: 0.15, y: 0.2 }, VE03: { x: 0.2, y: 0.2 }, VE04: { x: 0.25, y: 0.2 },
            SM01: { x: 0.1, y: 0.3 }, SM02: { x: 0.15, y: 0.3 }, SM03: { x: 0.2, y: 0.3 }, SM04: { x: 0.25, y: 0.3 },
            BH01: { x: 0.4, y: 0.1 }, BH02: { x: 0.45, y: 0.1 }, BH03: { x: 0.5, y: 0.1 }, BH04: { x: 0.55, y: 0.1 }
        },
        areas: [
            { name: 'Hollywood', capacity: 15, x: 0.1, y: 0.05, width: 0.2, height: 0.15 },
            { name: 'Venice', capacity: 20, x: 0.1, y: 0.25, width: 0.2, height: 0.15 },
            { name: 'Santa Monica', capacity: 12, x: 0.1, y: 0.45, width: 0.2, height: 0.12 },
            { name: 'Beverly Hills', capacity: 8, x: 0.35, y: 0.05, width: 0.25, height: 0.12 }
        ]
    },
    shanghai: {
        seats: {
            PD01: { x: 0.1, y: 0.1 }, PD02: { x: 0.15, y: 0.1 }, PD03: { x: 0.2, y: 0.1 }, PD04: { x: 0.25, y: 0.1 }, PD05: { x: 0.3, y: 0.1 },
            PX01: { x: 0.1, y: 0.2 }, PX02: { x: 0.15, y: 0.2 }, PX03: { x: 0.2, y: 0.2 }, PX04: { x: 0.25, y: 0.2 }, PX05: { x: 0.3, y: 0.2 },
            LJ01: { x: 0.1, y: 0.3 }, LJ02: { x: 0.15, y: 0.3 }, LJ03: { x: 0.2, y: 0.3 }, LJ04: { x: 0.25, y: 0.3 }, LJ05: { x: 0.3, y: 0.3 }
        },
        areas: [
            { name: 'Pudong', capacity: 25, x: 0.05, y: 0.05, width: 0.35, height: 0.2 },
            { name: 'Puxi', capacity: 20, x: 0.05, y: 0.25, width: 0.35, height: 0.2 },
            { name: 'Lujiazui', capacity: 15, x: 0.05, y: 0.45, width: 0.35, height: 0.15 }
        ]
    }
};

// Employee lists for different locations
const employeeLists = {
    nyc: [
        { name: 'Stefan Abel', email: 'stefan.abel@company.com', dept: 'Technica', seat: 'SA01' },
        { name: 'Jlees Ahmed', email: 'jlees.ahmed@company.com', dept: 'Engineering', seat: 'SB02' },
        { name: 'Kristen Alexander', email: 'kristen.alexander@company.com', dept: 'Technica', seat: 'SC03' },
        { name: 'Yumeng An', email: 'yumeng.an@company.com', dept: 'Technica', seat: 'SD04' },
        { name: 'Gary Anderson', email: 'gary.anderson@company.com', dept: 'Technica', seat: 'SE05' },
        { name: 'David Appel', email: 'david.appel@company.com', dept: 'Marketing', seat: 'SF06' },
        { name: 'Elizabeth Austin', email: 'elizabeth.austin@company.com', dept: 'Technica', seat: 'SG07' },
        { name: 'Michael Baker', email: 'michael.baker@company.com', dept: 'HR', seat: 'NA01' },
        { name: 'Sarah Chen', email: 'sarah.chen@company.com', dept: 'Finance', seat: 'NB02' },
        { name: 'John Davis', email: 'john.davis@company.com', dept: 'Engineering', seat: 'NC03' },
        { name: 'Lisa Evans', email: 'lisa.evans@company.com', dept: 'Training', seat: 'ND04' },
        { name: 'Frank Garcia', email: 'frank.garcia@company.com', dept: 'Legal', seat: 'NE05' }
    ],
    la: [
        { name: 'Alex Rodriguez', email: 'alex.rodriguez@company.com', dept: 'Engineering', seat: 'HO01' },
        { name: 'Emma Wilson', email: 'emma.wilson@company.com', dept: 'Design', seat: 'VE02' },
        { name: 'James Brown', email: 'james.brown@company.com', dept: 'Marketing', seat: 'SM03' },
        { name: 'Sophie Davis', email: 'sophie.davis@company.com', dept: 'Product', seat: 'BH04' }
    ],
    shanghai: [
        { name: 'Li Wei', email: 'li.wei@company.com', dept: 'Engineering', seat: 'PD01' },
        { name: 'Zhang Ming', email: 'zhang.ming@company.com', dept: 'Design', seat: 'PX02' },
        { name: 'Wang Fang', email: 'wang.fang@company.com', dept: 'Marketing', seat: 'LJ03' },
        { name: 'Chen Hao', email: 'chen.hao@company.com', dept: 'Product', seat: 'XT04' },
        { name: 'Liu Yan', email: 'liu.yan@company.com', dept: 'Engineering', seat: 'JA05' }
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

// Professional status options based on EA Planner
const statusOptions = {
    'working-office': { label: 'Working From the Office', color: '#4987e8' },
    'working-remote': { label: 'Working Remotely', color: '#c9daf8' },
    'traveling': { label: 'Traveling for Business', color: '#b5d7a8' },
    'out-office': { label: 'Out of Office', color: '#f2c331' },
    'not-scheduled': { label: 'Not in / Scheduled', color: '#b0bec5' },
    'emergency': { label: 'Emergency Response Team In Office', color: '#e53e3e' }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Seating Chart App initializing...');
    try {
        initializeApp();
        console.log('Seating Chart App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        if (window.errorTracker) {
            window.errorTracker.logError('Application initialization failed', { error: error.message, stack: error.stack });
        }
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
        const datePicker = document.getElementById('datePicker');
        if (datePicker) {
            datePicker.value = selectedDate;
        }
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
    const lastUpdatedByElement = document.getElementById('lastUpdatedBy');
    const lastUpdatedDateElement = document.getElementById('lastUpdatedDate');
    
    if (lastUpdatedByElement) {
        lastUpdatedByElement.textContent = lastUpdatedBy;
    }
    if (lastUpdatedDateElement) {
        lastUpdatedDateElement.textContent = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
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
    
    // Render conference room areas
    currentFloorPlan.areas.forEach(area => {
        const areaElement = createFloorArea(area);
        floorPlan.appendChild(areaElement);
    });
    
    // Render all seats using the professional coordinate system
    Object.keys(currentFloorPlan.seats).forEach(seatId => {
        const seatData = currentFloorPlan.seats[seatId];
        const seatElement = createSeatFromCoordinates(seatId, seatData);
        floorPlan.appendChild(seatElement);
    });
    
    console.log('Floor plan rendered successfully');
}

function createFloorArea(area) {
    const areaElement = document.createElement('div');
    areaElement.className = 'floor-area';
    
    // Calculate position based on percentage coordinates
    const floorPlan = document.getElementById('floorPlan');
    if (!floorPlan) {
        console.error('Floor plan element not found for area positioning');
        return areaElement;
    }

    const areaWidth = floorPlan.offsetWidth;
    const areaHeight = floorPlan.offsetHeight;

    const areaX = area.x * areaWidth;
    const areaY = area.y * areaHeight;
    const areaW = area.width * areaWidth;
    const areaH = area.height * areaHeight;

    areaElement.style.left = areaX + 'px';
    areaElement.style.top = areaY + 'px';
    areaElement.style.width = areaW + 'px';
    areaElement.style.height = areaH + 'px';
    
    areaElement.innerHTML = `
        <div class="area-name">${area.name}</div>
        <div class="area-capacity">Capacity: ${area.capacity}</div>
    `;
    
    return areaElement;
}

function createSeatFromCoordinates(seatId, seatData) {
    const seatElement = document.createElement('div');
    seatElement.className = 'seat';
    
    // Calculate position based on percentage coordinates
    const floorPlan = document.getElementById('floorPlan');
    if (!floorPlan) {
        console.error('Floor plan element not found for seat positioning');
        return seatElement;
    }

    const floorWidth = floorPlan.offsetWidth;
    const floorHeight = floorPlan.offsetHeight;

    const seatX = seatData.x * floorWidth;
    const seatY = seatData.y * floorHeight;
    
    seatElement.style.left = seatX + 'px';
    seatElement.style.top = seatY + 'px';
    
    // Extract seat number from seat ID (e.g., "SA01" -> "01")
    const seatNumber = seatId.substring(2);
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
        seatElement.title = `${employee.name} - ${statusOptions[employee.status]?.label || 'Unknown'}${checkinStatus}`;
    }
    
    seatElement.addEventListener('click', () => handleSeatClick(seatId));
    
    return seatElement;
}

function handleSeatClick(seatId) {
    const employee = employees.find(emp => emp.seat === seatId);
    if (employee) {
        // Show employee info or allow editing
        alert(`Seat ${seatId} is occupied by ${employee.name} (${statusOptions[employee.status]?.label || 'Unknown'})`);
    } else {
        // Allow assigning to this seat
        openCheckinModal(seatId);
    }
}

// Employee table rendering
function renderEmployeeTable() {
    const tableBody = document.getElementById('employeeTableBody');
    if (!tableBody) {
        console.error('Employee table body not found');
        return;
    }
    
    tableBody.innerHTML = '';
    
    employees.forEach(employee => {
        const row = createEmployeeRow(employee);
        tableBody.appendChild(row);
    });
}

function createEmployeeRow(employee) {
    const row = document.createElement('tr');
    
    // Check if employee has checked in today
    const todayKey = selectedDate;
    const hasCheckedIn = dailyCheckins[todayKey] && 
                       dailyCheckins[todayKey].some(checkin => checkin.employeeName === employee.name);
    
    const checkinStatus = hasCheckedIn ? 
        '<span class="checkin-status checked-in">✓ Checked in</span>' : 
        '<span class="checkin-status not-checked-in">○ Not checked in</span>';
    
    row.innerHTML = `
        <td class="employee-name">${employee.name}</td>
        <td class="employee-seat">${employee.seat}</td>
        <td class="employee-dept">${employee.dept}</td>
        <td class="employee-status">
            <div class="status-dot ${employee.status}"></div>
            ${statusOptions[employee.status]?.label || 'Unknown'}
        </td>
        <td class="employee-checkin">${checkinStatus}</td>
    `;
    
    row.addEventListener('click', () => editEmployee(employee));
    
    return row;
}

// Search functionality
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    if (clearSearch) {
        clearSearch.addEventListener('click', clearSearchInput);
    }
    
    // Check-in modal
    const checkinBtn = document.getElementById('checkinBtn');
    const modal = document.getElementById('checkinModal');
    const closeModal = document.getElementById('closeModal');
    const cancelCheckin = document.getElementById('cancelCheckin');
    const submitCheckin = document.getElementById('submitCheckin');
    
    if (checkinBtn) {
        checkinBtn.addEventListener('click', () => openCheckinModal());
    }
    if (closeModal) {
        closeModal.addEventListener('click', closeCheckinModal);
    }
    if (cancelCheckin) {
        cancelCheckin.addEventListener('click', closeCheckinModal);
    }
    if (submitCheckin) {
        submitCheckin.addEventListener('click', handleCheckinSubmit);
    }
    
    // Date picker
    const datePicker = document.getElementById('datePicker');
    if (datePicker) {
        datePicker.addEventListener('change', handleDateChange);
    }
    
    // Location selector
    const locationSelect = document.getElementById('locationSelect');
    if (locationSelect) {
        locationSelect.addEventListener('change', handleLocationChange);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCheckinModal();
            }
        });
    }
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const clearSearch = document.getElementById('clearSearch');
    const tableBody = document.getElementById('employeeTableBody');
    
    if (!tableBody) return;
    
    if (searchTerm) {
        if (clearSearch) clearSearch.style.display = 'block';
    } else {
        if (clearSearch) clearSearch.style.display = 'none';
    }
    
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const name = row.querySelector('.employee-name')?.textContent.toLowerCase() || '';
        const seat = row.querySelector('.employee-seat')?.textContent.toLowerCase() || '';
        const dept = row.querySelector('.employee-dept')?.textContent.toLowerCase() || '';
        
        if (name.includes(searchTerm) || seat.includes(searchTerm) || dept.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function clearSearchInput() {
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.value = '';
    }
    if (clearSearch) {
        clearSearch.style.display = 'none';
    }
    handleSearch();
}

// Check-in modal functionality
function openCheckinModal(seatId = null) {
    const modal = document.getElementById('checkinModal');
    const seatSelect = document.getElementById('employeeSeat');
    
    if (!modal || !seatSelect) {
        console.error('Modal or seat select not found');
        return;
    }
    
    // Populate seat options
    seatSelect.innerHTML = '<option value="">Select a seat...</option>';
    
    // Get all seat IDs from the current floor plan data
    const currentFloorPlan = floorPlanData[currentLocation];
    if (!currentFloorPlan) {
        console.error('Floor plan not found for location:', currentLocation);
        return;
    }
    
    const allSeatIds = Object.keys(currentFloorPlan.seats);

    allSeatIds.forEach(seatId => {
        // Determine area name based on seat ID prefix
        let areaName = 'Unknown Area';
        const seatPrefix = seatId.substring(0, 2);
        
        // Map seat prefixes to area names
        const areaMap = {
            'SA': 'South A', 'SB': 'South B', 'SC': 'South C', 'SD': 'South D', 'SE': 'South E', 'SF': 'South F', 'SG': 'South G',
            'NA': 'North A', 'NB': 'North B', 'NC': 'North C', 'ND': 'North D', 'NE': 'North E', 'NF': 'North F', 'NG': 'North G',
            'WA': 'West A', 'WB': 'West B', 'WC': 'West C', 'WD': 'West D',
            'EA': 'East A', 'EB': 'East B', 'EC': 'East C', 'ED': 'East D',
            'WE': 'West Extension',
            'N1': 'North 100', 'S1': 'South 100', 'E1': 'East 100', 'W1': 'West 100',
            'HO': 'Hollywood', 'VE': 'Venice', 'SM': 'Santa Monica', 'BH': 'Beverly Hills',
            'DT': 'Downtown', 'WS': 'Westside', 'PA': 'Pasadena', 'MA': 'Malibu',
            'CC': 'Culver City', 'GL': 'Glendale', 'BU': 'Burbank', 'SC': 'Studio City',
            'PD': 'Pudong', 'PX': 'Puxi', 'LJ': 'Lujiazui', 'XT': 'Xintiandi',
            'JA': 'Jing\'an', 'HP': 'Huangpu', 'HK': 'Hongkou', 'YP': 'Yangpu',
            'CN': 'Changning', 'PT': 'Putuo', 'MH': 'Minhang', 'SJ': 'Songjiang'
        };
        
        areaName = areaMap[seatPrefix] || 'Unknown Area';

        const option = document.createElement('option');
        option.value = seatId;
        option.textContent = `${seatId} (${areaName})`;
        
        // Check if seat is occupied
        const isOccupied = employees.some(emp => emp.seat === seatId);
        option.disabled = isOccupied;

        seatSelect.appendChild(option);
    });
    
    if (seatId) {
        seatSelect.value = seatId;
    }
    
    // Clear form
    const employeeName = document.getElementById('employeeName');
    const employeeDept = document.getElementById('employeeDept');
    const employeeStatus = document.getElementById('employeeStatus');
    
    if (employeeName) employeeName.value = '';
    if (employeeDept) employeeDept.value = '';
    if (employeeStatus) employeeStatus.value = 'working-office';
    
    modal.classList.add('show');
}

function closeCheckinModal() {
    const modal = document.getElementById('checkinModal');
    if (modal) {
        modal.classList.remove('show');
    }
    
    // Reset editing state
    window.editingEmployee = null;
    const submitCheckin = document.getElementById('submitCheckin');
    if (submitCheckin) {
        submitCheckin.textContent = 'Submit';
    }
}

function handleCheckinSubmit() {
    const name = document.getElementById('employeeName')?.value.trim() || '';
    const seat = document.getElementById('employeeSeat')?.value || '';
    const dept = document.getElementById('employeeDept')?.value.trim() || '';
    const status = document.getElementById('employeeStatus')?.value || 'working-office';
    
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
        const submitCheckin = document.getElementById('submitCheckin');
        if (submitCheckin) {
            submitCheckin.textContent = 'Submit';
        }
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
        const employeeName = document.getElementById('employeeName');
        const employeeDept = document.getElementById('employeeDept');
        const employeeStatus = document.getElementById('employeeStatus');
        const submitCheckin = document.getElementById('submitCheckin');
        
        if (employeeName) employeeName.value = employee.name;
        if (employeeDept) employeeDept.value = employee.dept;
        if (employeeStatus) employeeStatus.value = employee.status;
        if (submitCheckin) submitCheckin.textContent = 'Update';
        
        // Store reference to employee being edited
        window.editingEmployee = employee;
    }
}

function handleDateChange() {
    const datePicker = document.getElementById('datePicker');
    if (datePicker) {
        selectedDate = datePicker.value;
        saveData();
        console.log('Date changed to:', selectedDate);
    }
}

function handleLocationChange() {
    const locationSelect = document.getElementById('locationSelect');
    if (locationSelect) {
        const location = locationSelect.value;
        currentLocation = location;
        
        // Reload data for the new location
        loadData();
        renderFloorPlan();
        renderEmployeeTable();
        
        console.log('Location changed to:', location);
    }
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
