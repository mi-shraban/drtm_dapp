// Load schedule
async function loadSchedule() {
    const date = document.getElementById('scheduleDate').value;
    
    if (!date) {
        showAlert('Please select a date!', 'error');
        return;
    }
    
    try {
        const dayKey = Math.floor(new Date(date + 'T00:00:00Z').getTime() / 1000 / 86400);
        const scheduleDisplay = document.getElementById('scheduleDisplay');
        scheduleDisplay.innerHTML = '<div class="loading">Loading schedules...</div>';
        
        // Get all trainers
        const nextTrainerId = await contract.methods.nextTrainerId().call();
        let scheduleHTML = '';
        
        for (let i = 0; i < nextTrainerId - 1; i++) {
            try {
                const trainerAddr = await contract.methods.trainersList(i).call();
                const trainer = await contract.methods.trainers(trainerAddr).call();
                
                if (!trainer.exists) continue;
                
                const schedule = await contract.methods.getTrainerSchedByDay(trainerAddr, dayKey).call();
                
                scheduleHTML += `
                    <div class="trainer-schedule">
                        <div class="trainer-name">
                            ${trainer.name} (${trainer.district})
                            <br><small>${trainerAddr}</small>
                        </div>
                `;
                
                if (schedule.startMinsOut.length === 0) {
                    scheduleHTML += '<div style="color: #6c757d; font-style: italic;">No bookings for this date</div>';
                } else {
                    for (let j = 0; j < schedule.startMinsOut.length; j++) {
                        const startMin = parseInt(schedule.startMinsOut[j]);
                        const endMin = parseInt(schedule.endMinsOut[j]);
                        const participant = schedule.partsOut[j];
                        
                        const startTime = minutesToTime(startMin);
                        const endTime = minutesToTime(endMin);
                        
                        scheduleHTML += `
                            <div class="booking-slot">
                                <div class="slot-time">${startTime} - ${endTime}</div>
                                <div class="slot-participant">Participant: ${participant}</div>
                            </div>
                        `;
                    }
                }
                
                scheduleHTML += '</div>';
            } catch (e) {
                // Skip if trainer doesn't exist
                break;
            }
        }
        
        if (scheduleHTML === '') {
            scheduleDisplay.innerHTML = '<div class="alert alert-info">No trainers found or no schedules available.</div>';
        } else {
            scheduleDisplay.innerHTML = scheduleHTML;
        }
        
    } catch (error) {
        console.error('Error loading schedule:', error);
        showAlert('Error loading schedule: ' + error.message, 'error');
    }
}