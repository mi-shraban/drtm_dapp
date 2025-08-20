// Global variables
let web3;
let contract;
let currentAccount;
let userType = 'Unknown';

// Check existing connection
async function checkConnection() {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            currentAccount = accounts[0];
            await updateConnectionStatus();
        }
    } catch (error) {
        console.error('Error checking connection:', error);
    }
}

// Connect wallet
async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        currentAccount = accounts[0];
        await updateConnectionStatus();
        showAlert('Wallet connected successfully!', 'success');
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showAlert('Failed to connect wallet: ' + error.message, 'error');
    }
}

// Update connection status
async function updateConnectionStatus() {
    try {
        document.getElementById('connectionStatus').textContent = 'Connected';
        document.getElementById('currentAccount').textContent = 
            currentAccount.substring(0, 6) + '...' + currentAccount.substring(38);
        
        const networkId = await web3.eth.net.getId();
        document.getElementById('networkId').textContent = networkId;
        
        await determineUserType();
        await loadBookingFee();
        await loadTrainersAndAdmins();
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

// Determine user type
async function determineUserType() {
    try {
        const isAdmin = await contract.methods.isAdmin(currentAccount).call();
        const participant = await contract.methods.parts(currentAccount).call();
        const trainer = await contract.methods.trainers(currentAccount).call();
        
        if (isAdmin) {
            userType = 'Admin';
        } else if (participant.exists) {
            userType = 'Participant';
        } else if (trainer.exists) {
            userType = 'Trainer';
        } else {
            userType = 'Unregistered';
        }
        
        document.getElementById('userType').textContent = userType;
    } catch (error) {
        console.error('Error determining user type:', error);
        userType = 'Unknown';
    }
}

// Load booking fee
async function loadBookingFee() {
    try {
        const fee = await contract.methods.bookingFee().call();
        const feeInEth = web3.utils.fromWei(fee, 'ether');
        document.getElementById('bookingFeeDisplay').textContent = feeInEth;
    } catch (error) {
        console.error('Error loading booking fee:', error);
    }
}

// Load trainers and admins for dropdowns
async function loadTrainersAndAdmins() {
    try {
        // Load trainers
        const trainerSelect = document.getElementById('bookingTrainer');
        trainerSelect.innerHTML = '<option value="">Select a Trainer</option>';
        
        const nextTrainerId = await contract.methods.nextTrainerId().call();
        for (let i = 1; i < nextTrainerId; i++) {
            try {
                const trainerAddr = await contract.methods.trainersList(i - 1).call();
                const trainer = await contract.methods.trainers(trainerAddr).call();
                if (trainer.exists) {
                    const option = document.createElement('option');
                    option.value = trainerAddr;
                    option.textContent = `${trainer.name} (${trainer.district})`;
                    trainerSelect.appendChild(option);
                }
            } catch (e) {
                // Skip if trainer doesn't exist at this index
                break;
            }
        }
        
        // Load admins
        const adminSelect = document.getElementById('adminPayee');
        adminSelect.innerHTML = '<option value="">Select Admin</option>';
        
        const nextPartId = await contract.methods.nextPartId().call();
        for (let i = 0; i < nextPartId; i++) {
            try {
                const partAddr = await contract.methods.partsList(i).call();
                const isAdmin = await contract.methods.isAdmin(partAddr).call();
                if (isAdmin) {
                    const option = document.createElement('option');
                    option.value = partAddr;
                    option.textContent = partAddr.substring(0, 8) + '...';
                    adminSelect.appendChild(option);
                }
            } catch (e) {
                // Skip if address doesn't exist
                break;
            }
        }
    } catch (error) {
        console.error('Error loading trainers/admins:', error);
    }
}