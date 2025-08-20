// Initialize the app
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await initializeContract();
        await checkConnection();
        populateTimeSlots();
        setDefaultDate();
    } else {
        showAlert('MetaMask not detected! Please install MetaMask to use this application.', 'error');
    }
});

// Initialize contract instance
async function initializeContract() {
    try {
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        console.log('Contract initialized successfully');
    } catch (error) {
        console.error('Error initializing contract:', error);
        showAlert('Error initializing contract. Please check the contract address.', 'error');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Connect wallet button event listener
    const connectButton = document.getElementById('connectWallet');
    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
    }
    
    // MetaMask account change listener
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function (accounts) {
            if (accounts.length > 0) {
                currentAccount = accounts[0];
                updateConnectionStatus();
            } else {
                currentAccount = null;
                document.getElementById('connectionStatus').textContent = 'Disconnected';
                document.getElementById('currentAccount').textContent = 'Not Connected';
                document.getElementById('userType').textContent = 'Unknown';
            }
        });
        
        // Network change listener
        window.ethereum.on('chainChanged', function(chainId) {
            // Reload the page on network change
            window.location.reload();
        });
    }
});