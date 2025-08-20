// Show/hide registration forms
function toggleRegistrationForm() {
    const type = document.getElementById('registrationType').value;
    const participantForm = document.getElementById('participantForm');
    const trainerForm = document.getElementById('trainerForm');
    
    participantForm.classList.add('hidden');
    trainerForm.classList.add('hidden');
    
    if (type === 'participant') {
        participantForm.classList.remove('hidden');
    } else if (type === 'trainer') {
        trainerForm.classList.remove('hidden');
    }
}

// Register participant
async function registerParticipant() {
    if (!currentAccount) {
        showAlert('Please connect your wallet first!', 'error');
        return;
    }
    
    const name = document.getElementById('partName').value.trim();
    const age = parseInt(document.getElementById('partAge').value);
    const gender = document.getElementById('partGender').value;
    const district = document.getElementById('partDistrict').value.trim();
    const trainingType = parseInt(document.getElementById('partTrainingType').value);
    
    if (!name || !age || !gender || !district || trainingType === '') {
        showAlert('Please fill all fields!', 'error');
        return;
    }
    
    try {
        showAlert('Registering participant... Please confirm transaction in MetaMask.', 'info');
        
        await contract.methods.registerPart(name, age, gender, district, trainingType)
            .send({ from: currentAccount });
        
        showAlert('Participant registered successfully!', 'success');
        
        // Clear form
        document.getElementById('partName').value = '';
        document.getElementById('partAge').value = '';
        document.getElementById('partGender').value = '';
        document.getElementById('partDistrict').value = '';
        document.getElementById('partTrainingType').value = '';
        
        await updateConnectionStatus();
    } catch (error) {
        console.error('Error registering participant:', error);
        showAlert('Error registering participant: ' + error.message, 'error');
    }
}

// Register trainer
async function registerTrainer() {
    if (!currentAccount) {
        showAlert('Please connect your wallet first!', 'error');
        return;
    }
    
    const name = document.getElementById('trainerName').value.trim();
    const district = document.getElementById('trainerDistrict').value.trim();
    
    if (!name || !district) {
        showAlert('Please fill all fields!', 'error');
        return;
    }
    
    try {
        showAlert('Registering trainer... Please confirm transaction in MetaMask.', 'info');
        
        await contract.methods.registerTrainer(name, district)
            .send({ from: currentAccount });
        
        showAlert('Trainer registered successfully!', 'success');
        
        // Clear form
        document.getElementById('trainerName').value = '';
        document.getElementById('trainerDistrict').value = '';
        
        await updateConnectionStatus();
        await loadTrainersAndAdmins();
    } catch (error) {
        console.error('Error registering trainer:', error);
        showAlert('Error registering trainer: ' + error.message, 'error');
    }
}