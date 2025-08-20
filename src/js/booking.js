// Check availability
async function checkAvailability() {
    const trainerAddr = document.getElementById('bookingTrainer').value;
    const date = document.getElementById('bookingDate').value;
    const startMin = document.getElementById('bookingStartTime').value;
    
    if (!trainerAddr || !date || !startMin) {
        showAlert('Please select trainer, date, and time!', 'error');
        return;
    }
    
    try {
        const dayKey = Math.floor(new Date(date).getTime() / 1000 / 86400);
        const available = await contract.methods.isSlotAvailable(trainerAddr, dayKey, parseInt(startMin)).call();
        
        const resultDiv = document.getElementById('availabilityResult');
        if (available) {
            resultDiv.innerHTML = '<div class="alert alert-success"> Slot is available!</div>';
        } else {
            resultDiv.innerHTML = '<div class="alert alert-error"> Slot is already booked!</div>';
        }
    } catch (error) {
        console.error('Error checking availability:', error);
        showAlert('Error checking availability: ' + error.message, 'error');
    }
}

// Book slot
async function bookSlot() {
    if (!currentAccount) {
        showAlert('Please connect your wallet first!', 'error');
        return;
    }
    
    if (userType !== 'Participant') {
        showAlert('Only participants can book training slots!', 'error');
        return;
    }
    
    const trainerAddr = document.getElementById('bookingTrainer').value;
    const date = document.getElementById('bookingDate').value;
    const startMin = document.getElementById('bookingStartTime').value;
    const adminPayee = document.getElementById('adminPayee').value;
    
    if (!trainerAddr || !date || !startMin || !adminPayee) {
        showAlert('Please fill all fields!', 'error');
        return;
    }
    
    try {
        const dayKey = Math.floor(new Date(date).getTime() / 1000 / 86400);
        const available = await contract.methods.isSlotAvailable(trainerAddr, dayKey, parseInt(startMin)).call();
        
        if (!available) {
            showAlert('This slot is already booked!', 'error');
            return;
        }
        
        const bookingFee = await contract.methods.bookingFee().call();
        
        showAlert('Booking slot... Please confirm transaction in MetaMask.', 'info');
        
        await contract.methods.bookSlot(trainerAddr, dayKey, parseInt(startMin), adminPayee)
            .send({ 
                from: currentAccount,
                value: bookingFee
            });
        
        showAlert('Booking Successful! Your training slot has been reserved.', 'success');
        
        // Clear availability result
        document.getElementById('availabilityResult').innerHTML = '';
        
    } catch (error) {
        console.error('Error booking slot:', error);
        showAlert('Error booking slot: ' + error.message, 'error');
    }
}