module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,  // This should match your Ganache GUI port
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.5.16"  // Use the appropriate Solidity version for your contracts
    }
  }
};
