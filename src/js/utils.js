// Utility functions

// Convert minutes to time format (HH:MM)
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Show alert messages
function showAlert(message, type) {
    const alertsDiv = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        ${message}
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 1.2rem; cursor: pointer;">&times;</button>
    `;
    alertsDiv.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Show tab function
function showTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Populate time slots for booking
function populateTimeSlots() {
    const select = document.getElementById('bookingStartTime');
    select.innerHTML = '<option value="">Select Start Time</option>';
    
    for (let hour = 9; hour <= 23; hour++) {
        for (let min = 0; min < 60; min += 30) {
            if (hour === 23 && min === 30) break; // Don't go past 23:30
            
            const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            const endHour = min === 30 ? hour + 1 : hour;
            const endMin = min === 30 ? 0 : min + 30;
            const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
            
            const totalMinutes = hour * 60 + min;
            
            const option = document.createElement('option');
            option.value = totalMinutes;
            option.textContent = `${timeStr} - ${endTimeStr}`;
            select.appendChild(option);
        }
    }
}

// Set default dates to today
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').value = today;
    document.getElementById('scheduleDate').value = today;
}