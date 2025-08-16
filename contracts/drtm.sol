// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 < 0.9.0;


/**
 * @title Disaster Response Training Management
*/

contract DRTM {
    
    // roles
    address public ownerAddr;
    mapping(address => bool) public isAdmin;

    modifier onlyOwner() {
        require(msg.sender == ownerAddr, "Only owner can call this");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can call this");
        _;
    }

    enum TrainingType {
        FirstAid,
        ShelterRebuild,
        FoodSafety
    }

    struct Part {
        uint256 id;
        string name;
        uint8 age;
        string gender;
        string district;
        TrainingType trainingType;
        bool hasCompletedTraining;
        bool exists;
    }

    struct Trainer {
        uint256 id;
        string name;
        string district;
        bool exists;
    }

    // Address-indexed registries
    mapping(address => Part) public parts;
    mapping(address => Trainer) public trainers;

    // bookings
    uint256 public bookingFee = 0.000000000000001 ether; // Owner can change preset booking fee.

    struct Bkg {
        address partAddr;
        uint32 dayKey;          // floor(utcTimestamp / 86400)
        uint16 startMin;        // minutes since midnight (for example, 9:00 AM -> 540)
        uint16 endMin;          // startMin + 30
        bool exists;
    }

    // trainer => dayKey => startMin => Booking
    mapping(address => mapping(uint32 => mapping(uint16 => Bkg))) private bkgs;

    // For iterating a trainer's schedule: store the list of slot keys for that day
    mapping(address => mapping(uint32 => uint16[])) private trainerDaySlots;

    // events
    event OwnerTransferred(address indexed oldOwner, address indexed newOwner);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    event PartRegistered(
        address indexed addr,
        uint256 id,
        string name,
        uint8 age,
        string gender,
        string district,
        TrainingType trainingType
    );

    event TrainerRegistered(
        address indexed addr,
        uint256 id,
        string name,
        string district
    );

    event PartUpdated(
        address indexed partAddr,
        TrainingType trainingType,
        bool hasCompletedTraining
    );

    event BookingFeeChanged(uint256 newFee);

    event SlotBooked(
        address indexed partAddr,
        address indexed trainerAddr,
        uint32 indexed dayKey,
        uint16 startMin,
        uint16 endMin,
        address adminPayee,
        uint256 fee
    );

    // constructor
    constructor() {
        ownerAddr = msg.sender;
        isAdmin[msg.sender] = true;
        emit AdminAdded(msg.sender);
    }

    // Admin methods
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnerTransferred(ownerAddr, newOwner);
        ownerAddr = newOwner;
    }

    function addAdmin(address addr) external onlyOwner {
        require(addr != address(0), "Zero address");
        require(!isAdmin[addr], "Already admin");
        isAdmin[addr] = true;
        emit AdminAdded(addr);
    }

    function removeAdmin(address addr) external onlyOwner {
        require(addr != ownerAddr, "Cannot remove owner");
        require(isAdmin[addr], "Not admin");
        isAdmin[addr] = false;
        emit AdminRemoved(addr);
    }

    function setBookingFee(uint256 newFee) external onlyOwner {
        bookingFee = newFee;
        emit BookingFeeChanged(newFee);
    }
    
    // participant registration
    function registerPart(
        uint256 _id,
        string calldata _name,
        uint8 _age,
        string calldata _gender,
        string calldata _district,
        TrainingType _trainingtype
    ) external {
        require(!parts[msg.sender].exists, "Already registered as participant");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_gender).length > 0, "Gender cannot be empty");
        require(bytes(_district).length > 0, "District cannot be empty");
        require(_age > 0, "Age must be greater than 0");
        require(uint8(_trainingtype) <= uint8(TrainingType.FoodSafety), "Invalid training type");

        parts[msg.sender] = Part({
            id: _id,
            name: _name,
            age: _age,
            gender: _gender,
            district: _district,
            trainingType: _trainingtype,
            hasCompletedTraining: false,
            exists: true
        });

        emit PartRegistered(
            msg.sender,
            _id,
            _name,
            _age,
            _gender,
            _district,
            _trainingtype
        );
    }

    function registerTrainer(
        uint256 _id,
        string calldata _name,
        string calldata _district
    ) external {
        require(!trainers[msg.sender].exists, "Already registered as trainer");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_district).length > 0, "District cannot be empty");

        trainers[msg.sender] = Trainer({
            id: _id,
            name: _name,
            district: _district,
            exists: true
        });

        emit TrainerRegistered(msg.sender, _id, _name, _district);
    }

    // participant updates [Admin only]
    function adminUpdatePart(
        address partAddr,
        TrainingType newType,
        bool updateType,
        bool setCompletedToTrue
    ) external onlyAdmin {
        Part storage p = parts[partAddr];
        require(p.exists, "Participant not found");

        if (updateType) {
            require(uint8(newType) <= uint8(TrainingType.FoodSafety), "Invalid training type");
            p.trainingType = newType;
        }

        if (setCompletedToTrue) {
            require(!p.hasCompletedTraining, "Already completed; cannot revert");
            p.hasCompletedTraining = true;
        }

        emit PartUpdated(partAddr, p.trainingType, p.hasCompletedTraining);
    }

    // booking logic
    function bookSlot(
        address trainerAddr,
        uint32 dayKey,
        uint16 startMin,
        address payable adminPayee
    ) external payable {
        require(parts[msg.sender].exists, "Register as participant");
        require(trainers[trainerAddr].exists, "Trainer not found");
        require(isAdmin[adminPayee], "Payee must be an admin");
        require(msg.value == bookingFee, "Incorrect booking fee");

        // Enforce slot bounds & fixed 30-minute duration
        require(startMin <= 1410, "Start too late for 30-min slot"); // 1410 + 30 = 1440
        uint16 endMin = startMin + 30;

        // Prevent double-booking of the same discrete 30-min slot
        Bkg storage existing = bkgs[trainerAddr][dayKey][startMin];
        require(!existing.exists, "Trainer already booked for this slot");

        // Record
        bkgs[trainerAddr][dayKey][startMin] = Bkg({
            partAddr: msg.sender,
            dayKey: dayKey,
            startMin: startMin,
            endMin: endMin,
            exists: true
        });
        trainerDaySlots[trainerAddr][dayKey].push(startMin);

        // Payout fee to chosen admin
        (bool sent, ) = adminPayee.call{value: msg.value}("");
        require(sent, "Fee transfer failed");

        emit SlotBooked(
            msg.sender,
            trainerAddr,
            dayKey,
            startMin,
            endMin,
            adminPayee,
            msg.value
        );
    }

    // view schedule
    function getTrainerSchedByDay(
        address trainerAddr,
        uint32 dayKey
    )
        external
        view
        returns (
            address[] memory partsOut,
            uint16[] memory startMinsOut,
            uint16[] memory endMinsOut
        )
    {
        uint16[] storage keys = trainerDaySlots[trainerAddr][dayKey];
        uint256 n = keys.length;

        partsOut = new address[](n);
        startMinsOut = new uint16[](n);
        endMinsOut = new uint16[](n);

        for (uint256 i = 0; i < n; i++) {
            uint16 start = keys[i];
            Bkg storage b = bkgs[trainerAddr][dayKey][start];
            partsOut[i] = b.partAddr;
            startMinsOut[i] = b.startMin;
            endMinsOut[i] = b.endMin;
        }
    }

    function getSlot(
        address trainerAddr,
        uint32 dayKey,
        uint16 startMin
    ) external view returns (Bkg memory) {
        return bkgs[trainerAddr][dayKey][startMin];
    }
    
    // utilities
    function hhmmToMins(uint16 hour24, uint16 min) external pure returns (uint16) {
        require(hour24 < 24 && min < 60, "Invalid time");
        return uint16(hour24 * 60 + min);
    }
}