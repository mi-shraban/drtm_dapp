module.exports = {
    networks: {
        development: {
        host: "127.0.0.1",
        port: 8545,        // Ganache CLI default port
        network_id: "*",   // Match any network
        gas: 6721975,      // Gas limit
        gasPrice: 20000000000, // 20 gwei
        },
    },
    compilers: {
        solc: {
            version: "0.8.20",
            settings: {
                optimizer: {
                enabled: true,
                runs: 200
                },
            }
        },
    },
};