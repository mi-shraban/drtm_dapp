// Load participant data for admin panel
async function loadParticipantData() {
    const address = document.getElementById('updatePartAddress').value.trim();
    
    if (!address) {
        showAlert('Please enter participant address!', 'error');
        return;
    }
    
    try {
        const participant = await contract.methods.parts(address).call();
        
        if (!participant.exists) {
            showAlert('Participant not found!', 'error');
            return;
        }
        
        const infoDiv = document.getElementById('participantInfo');
        infoDiv.innerHTML = `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
                <p><strong>ID:</strong> ${participant.id}</p>
                <p><strong>Name:</strong> ${participant.name}</p>
                <p><strong>Age:</strong> ${participant.age}</p>
                <p><strong>Gender:</strong> ${participant.gender}</p>
                <p><strong>District:</strong> ${participant.district}</p>
                <p><strong>Training Type:</strong> ${trainingTypes[participant.trainingType]}</p>
                <p><strong>Completed Training:</strong> ${participant.hasCompletedTraining ? 'Yes' : 'No'}</p>
            </div>
        `;
        
        document.getElementById('participantData').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading participant data:', error);
        showAlert('Error loading participant data: ' + error.message, 'error');
    }
}

// Update participant (admin only)
async function updateParticipant() {
    if (!currentAccount) {
        showAlert('Please connect your wallet first!', 'error');
        return;
    }
    
    if (userType !== 'Admin') {
        showAlert('Only admins can update participant data!', 'error');
        return;
    }
    
    const address = document.getElementById('updatePartAddress').value.trim();
    const newTrainingType = document.getElementById('updateTrainingType').value;
    const markComplete = document.getElementById('markComplete').value;
    
    if (!address) {
        showAlert('Please enter participant address!', 'error');
        return;
    }
    
    if (!newTrainingType && !markComplete) {
        showAlert('Please select at least one field to update!', 'error');
        return;
    }
    
    try {
        showAlert('Updating participant... Please confirm transaction in MetaMask.', 'info');
        
        const updateType = newTrainingType !== '';
        const setCompleted = markComplete === 'true';
        const trainingType = updateType ? parseInt(newTrainingType) : 0;
        
        await contract.methods.adminUpdatePart(address, trainingType, updateType, setCompleted)
            .send({ from: currentAccount });
        
        showAlert('Participant updated successfully!', 'success');
        
        // Refresh participant data if loaded
        if (!document.getElementById('participantData').classList.contains('hidden')) {
            await loadParticipantData();
        }
    } catch (error) {
        console.error('Error updating participant:', error);
        showAlert('Error updating participant: ' + error.message, 'error');
    }
}