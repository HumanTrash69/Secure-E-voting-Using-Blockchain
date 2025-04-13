
pragma solidity ^0.5.15;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        string party; 
        uint voteCount;
    }

    mapping (uint => Candidate) public candidates;
    mapping (address => bool) public voters;

    
    uint public countCandidates;
    uint256 public votingEnd;
    uint256 public votingStart;


    function addCandidate(string memory name, string memory party) public  returns(uint) {
               countCandidates ++;
               candidates[countCandidates] = Candidate(countCandidates, name, party, 0);
               return countCandidates;
    }
   
    function vote(uint candidateID) public {

       require((votingStart <= now) && (votingEnd > now));
   
       require(candidateID > 0 && candidateID <= countCandidates);

       //daha önce oy kullanmamıs olmalı
       require(!voters[msg.sender]);
              
       voters[msg.sender] = true;
       
       candidates[candidateID].voteCount ++;      
    }
    
    function checkVote() public view returns(bool){
        return voters[msg.sender];
    }
       
    function getCountCandidates() public view returns(uint) {
        return countCandidates;
    }

    function getCandidate(uint candidateID) public view returns (uint,string memory, string memory,uint) {
        return (candidateID,candidates[candidateID].name,candidates[candidateID].party,candidates[candidateID].voteCount);
    }

    function setDates(uint256 _startDate, uint256 _endDate) public {
        require(_startDate > block.timestamp, "Start date must be in the future");
        require(_endDate > _startDate, "End date must be after start date");
        
        // Remove the single-use restriction
        votingStart = _startDate;
        votingEnd = _endDate;
    }

    function getDates() public view returns (uint256,uint256) {
      return (votingStart,votingEnd);
    }
}
