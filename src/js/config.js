// Contract configuration - HAVE TO UPDATE THESE VALUES after compilation
const CONTRACT_ADDRESS = '0x0xCfEB869F69431e42cdB54A4F4f105C19C080A601'; // Replace with your deployed contract address
const CONTRACT_ABI = [
    {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "admin",
        "type": "address"
        }
    ],
    "name": "AdminAdded",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "admin",
        "type": "address"
        }
    ],
    "name": "AdminRemoved",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": false,
        "internalType": "uint256",
        "name": "newFee",
        "type": "uint256"
        }
    ],
    "name": "BookingFeeChanged",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "oldOwner",
        "type": "address"
        },
        {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
        }
    ],
    "name": "OwnerTransferred",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "addr",
        "type": "address"
        },
        {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "uint8",
        "name": "age",
        "type": "uint8"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "gender",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "district",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "enum DRTM.TrainingType",
        "name": "trainingType",
        "type": "uint8"
        }
    ],
    "name": "PartRegistered",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "partAddr",
        "type": "address"
        },
        {
        "indexed": false,
        "internalType": "enum DRTM.TrainingType",
        "name": "trainingType",
        "type": "uint8"
        },
        {
        "indexed": false,
        "internalType": "bool",
        "name": "hasCompletedTraining",
        "type": "bool"
        }
    ],
    "name": "PartUpdated",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "partAddr",
        "type": "address"
        },
        {
        "indexed": true,
        "internalType": "address",
        "name": "trainerAddr",
        "type": "address"
        },
        {
        "indexed": true,
        "internalType": "uint32",
        "name": "dayKey",
        "type": "uint32"
        },
        {
        "indexed": false,
        "internalType": "uint16",
        "name": "startMin",
        "type": "uint16"
        },
        {
        "indexed": false,
        "internalType": "uint16",
        "name": "endMin",
        "type": "uint16"
        },
        {
        "indexed": false,
        "internalType": "address",
        "name": "adminPayee",
        "type": "address"
        },
        {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
        }
    ],
    "name": "SlotBooked",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "addr",
        "type": "address"
        },
        {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "district",
        "type": "string"
        }
    ],
    "name": "TrainerRegistered",
    "type": "event"
    },
    {
    "inputs": [],
    "name": "bookingFee",
    "outputs": [
        {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "",
        "type": "address"
        }
    ],
    "name": "isAdmin",
    "outputs": [
        {
        "internalType": "bool",
        "name": "",
        "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [],
    "name": "nextPartId",
    "outputs": [
        {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [],
    "name": "nextTrainerId",
    "outputs": [
        {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [],
    "name": "ownerAddr",
    "outputs": [
        {
        "internalType": "address",
        "name": "",
        "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "",
        "type": "address"
        }
    ],
    "name": "parts",
    "outputs": [
        {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
        },
        {
        "internalType": "string",
        "name": "name",
        "type": "string"
        },
        {
        "internalType": "uint8",
        "name": "age",
        "type": "uint8"
        },
        {
        "internalType": "string",
        "name": "gender",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "district",
        "type": "string"
        },
        {
        "internalType": "enum DRTM.TrainingType",
        "name": "trainingType",
        "type": "uint8"
        },
        {
        "internalType": "bool",
        "name": "hasCompletedTraining",
        "type": "bool"
        },
        {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
        }
    ],
    "name": "partsList",
    "outputs": [
        {
        "internalType": "address",
        "name": "",
        "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "",
        "type": "address"
        }
    ],
    "name": "trainers",
    "outputs": [
        {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
        },
        {
        "internalType": "string",
        "name": "name",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "district",
        "type": "string"
        },
        {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
        }
    ],
    "name": "trainersList",
    "outputs": [
        {
        "internalType": "address",
        "name": "",
        "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
        }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "addr",
        "type": "address"
        }
    ],
    "name": "addAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "addr",
        "type": "address"
        }
    ],
    "name": "removeAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
        {
        "internalType": "uint256",
        "name": "newFee",
        "type": "uint256"
        }
    ],
    "name": "setBookingFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
        {
        "internalType": "string",
        "name": "_name",
        "type": "string"
        },
        {
        "internalType": "uint8",
        "name": "_age",
        "type": "uint8"
        },
        {
        "internalType": "string",
        "name": "_gender",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "_district",
        "type": "string"
        },
        {
        "internalType": "enum DRTM.TrainingType",
        "name": "_trainingtype",
        "type": "uint8"
        }
    ],
    "name": "registerPart",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
        {
        "internalType": "string",
        "name": "_name",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "_district",
        "type": "string"
        }
    ],
    "name": "registerTrainer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "partAddr",
        "type": "address"
        },
        {
        "internalType": "enum DRTM.TrainingType",
        "name": "newType",
        "type": "uint8"
        },
        {
        "internalType": "bool",
        "name": "updateType",
        "type": "bool"
        },
        {
        "internalType": "bool",
        "name": "setCompletedToTrue",
        "type": "bool"
        }
    ],
    "name": "adminUpdatePart",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "trainerAddr",
        "type": "address"
        },
        {
        "internalType": "uint32",
        "name": "dayKey",
        "type": "uint32"
        },
        {
        "internalType": "uint16",
        "name": "startMin",
        "type": "uint16"
        },
        {
        "internalType": "address payable",
        "name": "adminPayee",
        "type": "address"
        }
    ],
    "name": "bookSlot",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "trainerAddr",
        "type": "address"
        },
        {
        "internalType": "uint32",
        "name": "dayKey",
        "type": "uint32"
        }
    ],
    "name": "getTrainerSchedByDay",
    "outputs": [
        {
        "internalType": "address[]",
        "name": "partsOut",
        "type": "address[]"
        },
        {
        "internalType": "uint16[]",
        "name": "startMinsOut",
        "type": "uint16[]"
        },
        {
        "internalType": "uint16[]",
        "name": "endMinsOut",
        "type": "uint16[]"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "trainerAddr",
        "type": "address"
        },
        {
        "internalType": "uint32",
        "name": "dayKey",
        "type": "uint32"
        }
    ],
    "name": "getTrainerDayStartMins",
    "outputs": [
        {
        "internalType": "uint16[]",
        "name": "",
        "type": "uint16[]"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "trainerAddr",
        "type": "address"
        },
        {
        "internalType": "uint32",
        "name": "dayKey",
        "type": "uint32"
        },
        {
        "internalType": "uint16",
        "name": "startMin",
        "type": "uint16"
        }
    ],
    "name": "isSlotAvailable",
    "outputs": [
        {
        "internalType": "bool",
        "name": "",
        "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "trainerAddr",
        "type": "address"
        },
        {
        "internalType": "uint32",
        "name": "dayKey",
        "type": "uint32"
        },
        {
        "internalType": "uint16",
        "name": "startMin",
        "type": "uint16"
        }
    ],
    "name": "getSlot",
    "outputs": [
        {
        "components": [
            {
            "internalType": "address",
            "name": "partAddr",
            "type": "address"
            },
            {
            "internalType": "uint32",
            "name": "dayKey",
            "type": "uint32"
            },
            {
            "internalType": "uint16",
            "name": "startMin",
            "type": "uint16"
            },
            {
            "internalType": "uint16",
            "name": "endMin",
            "type": "uint16"
            },
            {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
            }
        ],
        "internalType": "struct DRTM.Bkg",
        "name": "",
        "type": "tuple"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [],
    "name": "districts",
    "outputs": [
        {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "string",
        "name": "name",
        "type": "string"
        }
    ],
    "name": "districtCount",
    "outputs": [
        {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "string",
        "name": "name",
        "type": "string"
        }
    ],
    "name": "getParticipantsByDistrict",
    "outputs": [
        {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
        }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
    },
    {
    "inputs": [
        {
        "internalType": "uint16",
        "name": "hour24",
        "type": "uint16"
        },
        {
        "internalType": "uint16",
        "name": "min",
        "type": "uint16"
        }
    ],
    "name": "hhmmToMins",
    "outputs": [
        {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
        }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
    }
];

// Training type mapping
const trainingTypes = {
    0: 'First Aid',
    1: 'Shelter Rebuild',
    2: 'Food Safety'
};