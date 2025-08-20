let provider, signer, contract, currentAccount;

	const ABI = [
	  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
	  {"inputs":[],"name":"ownerAddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
	  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
	  {"inputs":[],"name":"bookingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
	  {"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint8","name":"_age","type":"uint8"},{"internalType":"string","name":"_gender","type":"string"},{"internalType":"string","name":"_district","type":"string"},{"internalType":"uint8","name":"_trainingtype","type":"uint8"}],"name":"registerPart","outputs":[],"stateMutability":"nonpayable","type":"function"},
	  {"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_district","type":"string"}],"name":"registerTrainer","outputs":[],"stateMutability":"nonpayable","type":"function"},
	  {"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"addAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},
	  {"inputs":[{"internalType":"address","name":"partAddr","type":"address"},{"internalType":"uint8","name":"newType","type":"uint8"},{"internalType":"bool","name":"updateType","type":"bool"},{"internalType":"bool","name":"setCompletedToTrue","type":"bool"}],"name":"adminUpdatePart","outputs":[],"stateMutability":"nonpayable","type":"function"},
	  {"inputs":[{"internalType":"address","name":"trainerAddr","type":"address"},{"internalType":"uint32","name":"dayKey","type":"uint32"},{"internalType":"uint16","name":"startMin","type":"uint16"},{"internalType":"address","name":"adminPayee","type":"address"}],"name":"bookSlot","outputs":[],"stateMutability":"payable","type":"function"},
	  {"inputs":[{"internalType":"address","name":"trainerAddr","type":"address"},{"internalType":"uint32","name":"dayKey","type":"uint32"}],"name":"getTrainerSchedByDay","outputs":[{"internalType":"address[]","name":"partsOut","type":"address[]"},{"internalType":"uint16[]","name":"startMinsOut","type":"uint16[]"},{"internalType":"uint16[]","name":"endMinsOut","type":"uint16[]"}],"stateMutability":"view","type":"function"}
	];

	const $ = id => document.getElementById(id);

	function showMessage(elementId, message, isError = false) {
	  const element = $(elementId);
	  element.textContent = message;
	  element.className = `message ${isError ? 'error' : 'success'}`;
	}

	async function ensureReady() {
	  if (!window.ethereum) {
		throw new Error("MetaMask is required. Please install MetaMask browser extension.");
	  }
	  
	  if (!provider) {
		provider = new ethers.BrowserProvider(window.ethereum);
	  }
	  
	  if (!signer) {
		signer = await provider.getSigner();
	  }
	  
	  if (!contract) {
		const addr = $("contractAddr").value.trim();
		if (!addr) {
		  throw new Error("Please enter contract address and click Load Contract first.");
		}
		contract = new ethers.Contract(addr, ABI, signer);
	  }
	  
	  currentAccount = await signer.getAddress();
	}

	// Initialize today's key
	const todayKey = Math.floor(Date.now() / 1000 / 86400);
	$("todayKey").textContent = todayKey;

	$("btnConnect").onclick = async () => {
	  try {
		await window.ethereum.request({ method: "eth_requestAccounts" });
		provider = new ethers.BrowserProvider(window.ethereum);
		signer = await provider.getSigner();
		currentAccount = await signer.getAddress();
		$("acct").textContent = currentAccount;
		showMessage("connectionStatus", "MetaMask connected successfully!");
	  } catch (e) {
		showMessage("connectionStatus", `Connection failed: ${e.message}`, true);
	  }
	};

	$("btnLoad").onclick = async () => {
	  try {
		await ensureReady();
		const owner = await contract.ownerAddr();
		const fee = await contract.bookingFee();
		$("owner").textContent = owner;
		$("bookingFee").textContent = fee.toString();
		showMessage("connectionStatus", "Contract loaded successfully!");
	  } catch (e) {
		showMessage("connectionStatus", `Failed to load contract: ${e.message}`, true);
	  }
	};

	// Register Participant
	$("btnRegPart").onclick = async () => {
	  try {
		await ensureReady();
		const id = $("pId").value;
		const name = $("pName").value;
		const age = parseInt($("pAge").value);
		const gender = $("pGender").value;
		const district = $("pDistrict").value;
		const training = parseInt($("pTraining").value);

		if (!id || !name || !age || !gender || !district) {
		  throw new Error("Please fill in all fields");
		}

		const tx = await contract.registerPart(id, name, age, gender, district, training);
		showMessage("pRegMsg", "Transaction submitted, waiting for confirmation...");
		await tx.wait();
		showMessage("pRegMsg", "Participant registered successfully!");
	  } catch (e) {
		showMessage("pRegMsg", `Registration failed: ${e.message}`, true);
	  }
	};

	// Register Trainer
	$("btnRegTrainer").onclick = async () => {
	  try {
		await ensureReady();
		const id = $("tId").value;
		const name = $("tName").value;
		const district = $("tDistrict").value;

		if (!id || !name || !district) {
		  throw new Error("Please fill in all fields");
		}

		const tx = await contract.registerTrainer(id, name, district);
		showMessage("tRegMsg", "Transaction submitted, waiting for confirmation...");
		await tx.wait();
		showMessage("tRegMsg", "Trainer registered successfully!");
	  } catch (e) {
		showMessage("tRegMsg", `Registration failed: ${e.message}`, true);
	  }
	};

	// Add Admin
	$("btnAddAdmin").onclick = async () => {
	  try {
		await ensureReady();
		const adminAddr = $("newAdmin").value.trim();
		if (!adminAddr) {
		  throw new Error("Please enter admin address");
		}
		
		const tx = await contract.addAdmin(adminAddr);
		showMessage("aAddMsg", "Transaction submitted, waiting for confirmation...");
		await tx.wait();
		showMessage("aAddMsg", "Admin added successfully!");
	  } catch (e) {
		showMessage("aAddMsg", `Failed to add admin: ${e.message}`, true);
	  }
	};

	// Admin Update
	$("btnAdminUpdate").onclick = async () => {
	  try {
		await ensureReady();
		const partAddr = $("updAddr").value.trim();
		const trainingVal = $("updTraining").value;
		const updateType = trainingVal !== "";
		const newType = updateType ? parseInt(trainingVal) : 0;
		const completed = $("updCompleted").checked;

		if (!partAddr) {
		  throw new Error("Please enter participant address");
		}

		const tx = await contract.adminUpdatePart(partAddr, newType, updateType, completed);
		showMessage("updMsg", "Transaction submitted, waiting for confirmation...");
		await tx.wait();
		showMessage("updMsg", "Participant updated successfully!");
	  } catch (e) {
		showMessage("updMsg", `Update failed: ${e.message}`, true);
	  }
	};

	// Book Slot
	$("btnBook").onclick = async () => {
	  try {
		await ensureReady();
		const trainerAddr = $("trainerAddr").value.trim();
		const dayKey = parseInt($("dayKey").value);
		const startMin = parseInt($("startMin").value);
		const adminPayee = $("adminPayee").value.trim();

		if (!trainerAddr || !dayKey || !startMin || !adminPayee) {
		  throw new Error("Please fill in all fields");
		}

		const fee = await contract.bookingFee();
		const tx = await contract.bookSlot(trainerAddr, dayKey, startMin, adminPayee, { value: fee });
		showMessage("bookMsg", "Transaction submitted, waiting for confirmation...");
		await tx.wait();
		showMessage("bookMsg", "Slot booked successfully!");
	  } catch (e) {
		showMessage("bookMsg", `Booking failed: ${e.message}`, true);
	  }
	};

	// Get Schedule
	$("btnSched").onclick = async () => {
	  try {
		await ensureReady();
		const trainerAddr = $("schedTrainer").value.trim();
		const dayKey = parseInt($("schedDayKey").value);

		if (!trainerAddr || !dayKey) {
		  throw new Error("Please enter trainer address and day key");
		}

		const [parts, starts, ends] = await contract.getTrainerSchedByDay(trainerAddr, dayKey);
		let out = "";
		if (parts.length === 0) {
		  out = "No bookings for this trainer on this day.";
		} else {
		  out = "Participant Address -> Time Slot\n";
		  out += "=".repeat(50) + "\n";
		  for (let i = 0; i < parts.length; i++) {
			const startHour = Math.floor(starts[i] / 60);
			const startMinute = starts[i] % 60;
			const endHour = Math.floor(ends[i] / 60);
			const endMinute = ends[i] % 60;
			out += `${parts[i]} -> ${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}-${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}\n`;
		  }
		}
		$("schedOut").textContent = out;
	  } catch (e) {
		$("schedOut").textContent = `Error: ${e.message}`;
	  }
	};

	// Handle account changes
	if (window.ethereum) {
	  window.ethereum.on('accountsChanged', function (accounts) {
		if (accounts.length > 0) {
		  $("acct").textContent = accounts[0];
		  currentAccount = accounts[0];
		} else {
		  $("acct").textContent = "–";
		  currentAccount = null;
		}
	  });
	}