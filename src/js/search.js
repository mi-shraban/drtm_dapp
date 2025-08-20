// Load district statistics
async function loadDistrictStats() {
    try {
        const districtStatsDiv = document.getElementById('districtStats');
        districtStatsDiv.innerHTML = '<div class="loading">Loading statistics...</div>';
        
        const districts = await contract.methods.districts().call();
        
        if (districts.length === 0) {
            districtStatsDiv.innerHTML = '<div class="alert alert-info">No district data available.</div>';
            return;
        }
        
        // Get counts for each district
        const districtData = [];
        for (const district of districts) {
            const count = await contract.methods.districtCount(district).call();
            districtData.push({ name: district, count: parseInt(count) });
        }
        
        // Sort by count (descending)
        districtData.sort((a, b) => b.count - a.count);
        
        let statsHTML = '';
        for (const data of districtData) {
            statsHTML += `
                <div class="district-card">
                    <div class="district-name">${data.name}</div>
                    <div class="district-count">${data.count} participant${data.count !== 1 ? 's' : ''}</div>
                </div>
            `;
        }
        
        districtStatsDiv.innerHTML = statsHTML;
        
    } catch (error) {
        console.error('Error loading district stats:', error);
        showAlert('Error loading district statistics: ' + error.message, 'error');
    }
}

// Search by district
async function searchByDistrict() {
    const searchTerm = document.getElementById('searchDistrict').value.trim();
    
    if (!searchTerm) {
        showAlert('Please enter a district name!', 'error');
        return;
    }
    
    try {
        const participants = await contract.methods.getParticipantsByDistrict(searchTerm).call();
        const resultsDiv = document.getElementById('searchResults');
        
        if (participants.length === 0) {
            resultsDiv.innerHTML = '<div class="alert alert-info">No participants found in this district.</div>';
            return;
        }
        
        let resultsHTML = `<h4>Participants in ${searchTerm} (${participants.length})</h4>`;
        resultsHTML += '<div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin-top: 1rem;">';
        
        for (const participantAddr of participants) {
            try {
                const participant = await contract.methods.parts(participantAddr).call();
                resultsHTML += `
                    <div style="border-bottom: 1px solid #dee2e6; padding: 0.5rem 0;">
                        <strong>${participant.name}</strong> (Age: ${participant.age})<br>
                        <small>Address: ${participantAddr}</small><br>
                        <small>Training: ${trainingTypes[participant.trainingType]} | 
                        Completed: ${participant.hasCompletedTraining ? 'Yes' : 'No'}</small>
                    </div>
                `;
            } catch (e) {
                console.error('Error loading participant:', e);
            }
        }
        
        resultsHTML += '</div>';
        resultsDiv.innerHTML = resultsHTML;
        
    } catch (error) {
        console.error('Error searching by district:', error);
        showAlert('Error searching by district: ' + error.message, 'error');
    }
}