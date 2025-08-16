let provider, signer, contract, currentAccount;

const ABI = [
  // pulled from drtm.sol
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

async function ensureReady() {
  if (!window.ethereum) throw new Error("MetaMask required");
  if (!provider) provider = new ethers.BrowserProvider(window.ethereum);
  if (!signer) signer = await provider.getSigner();
  if (!contract) {
    const addr = $("contractAddr").value.trim();
    contract = new ethers.Contract(addr, ABI, signer);
  }
  currentAccount = await signer.getAddress();
}

$("btnConnect").onclick = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  currentAccount = await signer.getAddress();
  $("acct").textContent = currentAccount;
};

$("btnLoad").onclick = async () => {
  try {
    await ensureReady();
    $("owner").textContent = await contract.ownerAddr();
    $("bookingFee").textContent = (await contract.bookingFee()).toString();
  } catch (e) { alert(e.message); }
};

// Register Participant
$("btnRegPart").onclick = async () => {
  try {
    await ensureReady();
    const tx = await contract.registerPart(
      $("pId").value,
      $("pName").value,
      Number($("pAge").value),
      $("pGender").value,
      $("pDistrict").value,
      Number($("pTraining").value)
    );
    await tx.wait();
    $("pRegMsg").textContent = "Registered participant!";
  } catch (e) { $("pRegMsg").textContent = e.message; }
};

// Register Trainer
$("btnRegTrainer").onclick = async () => {
  try {
    await ensureReady();
    const tx = await contract.registerTrainer(
      $("tId").value,
      $("tName").value,
      $("tDistrict").value
    );
    await tx.wait();
    $("tRegMsg").textContent = "Registered trainer!";
  } catch (e) { $("tRegMsg").textContent = e.message; }
};

// Add Admin
$("btnAddAdmin").onclick = async () => {
  try {
    await ensureReady();
    const tx = await contract.addAdmin($("newAdmin").value);
    await tx.wait();
    $("aAddMsg").textContent = "Admin added!";
  } catch (e) { $("aAddMsg").textContent = e.message; }
};

// Admin Update
$("btnAdminUpdate").onclick = async () => {
  try {
    await ensureReady();
    const trainingVal = $("updTraining").value;
    const updateType = trainingVal !== "";
    const newType = updateType ? Number(trainingVal) : 0;
    const completed = $("updCompleted").checked;
    const tx = await contract.adminUpdatePart(
      $("updAddr").value,
      newType,
      updateType,
      completed
    );
    await tx.wait();
    $("updMsg").textContent = "Updated!";
  } catch (e) { $("updMsg").textContent = e.message; }
};

// Book Slot
$("btnBook").onclick = async () => {
  try {
    await ensureReady();
    const fee = await contract.bookingFee();
    const tx = await contract.bookSlot(
      $("trainerAddr").value,
      Number($("dayKey").value),
      Number($("startMin").value),
      $("adminPayee").value,
      { value: fee }
    );
    await tx.wait();
    $("bookMsg").textContent = "Slot booked!";
  } catch (e) { $("bookMsg").textContent = e.message; }
};

// Get Schedule
$("btnSched").onclick = async () => {
  try {
    await ensureReady();
    const [parts, starts, ends] = await contract.getTrainerSchedByDay(
      $("schedTrainer").value,
      Number($("schedDayKey").value)
    );
    let out = "";
    for (let i = 0; i < parts.length; i++) {
      out += `${parts[i]}: ${starts[i]}–${ends[i]}\n`;
    }
    $("schedOut").textContent = out || "No bookings";
  } catch (e) { $("schedOut").textContent = e.message; }
};
