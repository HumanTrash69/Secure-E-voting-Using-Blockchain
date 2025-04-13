async function login(event) {
  event.preventDefault();
  const role = localStorage.getItem('role');
  const voterId = localStorage.getItem('voterId');

  if (role && voterId) {
    window.location.href = role === 'admin' ? 'admin.html' : 'voting.html';
  } else {
    alert('Invalid credentials. Please try again.');
  }
}
function checkAdminAccess() {
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}
function checkUserAccess() {
  const voterId = localStorage.getItem('voterId');
  if (!voterId) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}
var App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  init: async function () {
    console.log("Initializing App...");
    return await App.initWeb3();
  },
  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      web3 = new Web3(App.web3Provider);
      try {
        // Request account access
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        web3.eth.defaultAccount = accounts[0];
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },
  initContract: function () {
    console.log("Initializing contract...");
    $.getJSON('/build/contracts/Voting.json', function (votingArtifact) {
      App.contracts.Voting = TruffleContract(votingArtifact);
      App.contracts.Voting.setProvider(App.web3Provider);
      console.log("Contract initialized");
      return App.render();
    }).fail(function (error) {
      console.error("Could not load Voting.json:", error);
    });
  },
  render: function () {
    console.log("Rendering app...");
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        console.log("Current account:", account);
      } else {
        console.error("Error getting account:", err);
      }
    });
    App.contracts.Voting.deployed().then(function (instance) {
      console.log("Contract deployed successfully");
      if (document.getElementById('addCandidate')) {
        document.getElementById('addCandidate').addEventListener('click', App.addCandidate);
      }
      if (document.getElementById('addDate')) {
        document.getElementById('addDate').addEventListener('click', App.setDates);
      }
      App.loadCandidates();
    }).catch(function (error) {
      console.error("Could not connect to contract:", error);
    });
  },
  addCandidate: function () {
    console.log("Adding candidate...");
    var name = document.getElementById('name').value;
    var party = document.getElementById('party').value;
    if (!name || !party) {
      alert("Please enter both name and party");
      return;
    }
    App.contracts.Voting.deployed().then(function (instance) {
      return instance.addCandidate(name, party, { from: App.account });
    }).then(function (result) {
      console.log("Candidate added:", result);
      alert("Candidate added successfully!");
      document.getElementById('name').value = '';
      document.getElementById('party').value = '';
      App.loadCandidates(); // Optional refresh
    }).catch(function (err) {
      console.error("Error adding candidate:", err);
      alert("Error adding candidate. See console for details.");
    });
  },
  setDates: function () {
    console.log("Setting dates...");
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;
    console.log("Input dates:", startDateInput, endDateInput);
    const startDate = Math.floor(new Date(startDateInput).getTime() / 1000);
    const endDate = Math.floor(new Date(endDateInput).getTime() / 1000);
    if (isNaN(startDate) || isNaN(endDate)) {
      alert("Please select valid dates");
      return;
    }
    if (endDate <= startDate) {
      alert("End date must be after start date");
      return;
    }
    console.log("Converted dates:", 
      new Date(startDate * 1000).toLocaleString(),
      new Date(endDate * 1000).toLocaleString()
    );
    App.contracts.Voting.deployed().then(function (instance) {
      return instance.setDates(startDate, endDate, {
        from: App.account,
        gas: 300000,
        gasPrice: web3.utils.toWei('10', 'gwei')
      });
    }).then(function (result) {
      console.log("Dates set transaction:", result);
      alert("Voting dates set successfully!");
      App.loadCandidates(); // Refresh to show new dates
    }).catch(function (err) {
      console.error("Detailed error:", err);
      alert("Error setting dates. Please try again.");
    });
  },
  loadCandidates: function () {
    console.log("Loading candidates...");
    let votingInstance;
    App.contracts.Voting.deployed().then(function (instance) {
      votingInstance = instance;
      return votingInstance.getCountCandidates();
    }).then(function (count) {
      console.log("Number of candidates:", count.toNumber());
      const boxCandidate = document.getElementById('boxCandidate');
      if (!boxCandidate) return;
      boxCandidate.innerHTML = '';
      votingInstance.getDates().then(function (dates) {
        const startDate = new Date(dates[0] * 1000);
        const endDate = new Date(dates[1] * 1000);
        const datesElement = document.getElementById('dates');
        if (datesElement) {
          datesElement.innerHTML = `Voting Period (For Information): ${startDate.toLocaleString()} - ${endDate.toLocaleString()}`;
        }
        const voteButton = document.getElementById('voteButton');
        if (voteButton) {
          voteButton.onclick = null; 
          voteButton.onclick = App.vote; 
        }
      });
      for (let i = 1; i <= count.toNumber(); i++) {
        votingInstance.getCandidate(i).then(function (candidate) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${candidate[1]}</td>
            <td>${candidate[2]}</td>
            <td>${candidate[3].toString()}</td>
            <td><input type="radio" name="candidate" value="${candidate[0]}"></td>
          `;
          boxCandidate.appendChild(row);
        });
      }
    }).catch(function (err) {
      console.error("Error loading candidates:", err);
    });
  },
  vote: function() {
    const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
    if (!selectedCandidate) {
      alert("Please select a candidate");
      return;
    }
    const candidateId = selectedCandidate.value;
    console.log("Attempting to vote for candidate:", candidateId);
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error("Error getting accounts:", error);
        document.getElementById('msg').innerHTML = "Error: Could not get your account";
        return;
      }
      const account = accounts[0];
      console.log("Using account:", account);
      App.contracts.Voting.deployed().then(function(instance) {
        return instance.vote(candidateId, { 
          from: account,
          gas: 200000
        });
      }).then(function(receipt) {
        console.log("Vote transaction receipt:", receipt);
        document.getElementById('msg').innerHTML = "Your vote has been recorded successfully!";
        App.loadCandidates();
      }).catch(function(err) {
        console.error("Vote transaction error:", err);
        if (err.message.includes("revert")) {
          document.getElementById('msg').innerHTML = "Error: Your vote was rejected. You may have already voted.";
        } else {
          document.getElementById('msg').innerHTML = "Error: Could not process your vote. Please try again.";
        }
      });
    });
  }
};
$(function () {
  $(window).on('load', function () {
    console.log("Window loaded, initializing app...");
    App.init();
  });
});
