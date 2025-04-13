# Secure E-Voting Using Blockchain

This project was developed during a 24-hour Codathon organized at Dronacharya Group of Institutions.

## Project Contributors
1. [Ayush Jain](https://github.com/IkemenSenpai/)
2. [Himanshu Verma](https://github.com/username)
3. [Vivek Chaurasiya](https://github.com/username)

## About The Project
A secure electronic voting system built on blockchain technology with face verification. The system ensures secure and transparent voting through blockchain technology while using face verification for additional security.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Blockchain**: Ethereum (Solidity), Web3.js, Truffle
- **Face Verification**: Python, OpenCV, Flask
- **Database**: Blockchain (Ethereum Smart Contracts)
- **Development Tools**: Visual Studio Code, Ganache


## Prerequisites
- Node.js (v14 or higher)
- Python 3.12
- Ganache
- MetaMask browser extension
- Truffle Framework (`npm install -g truffle`)
- Git

## Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/Decentralized-Voting-System.git
cd Decentralized-Voting-System
```

2. Install Node.js dependencies
```bash
npm install
```

3. Install Python dependencies
```bash
pip install -r requirements.txt
```

4. Configure Ganache:
   - Open Ganache
   - Create a new workspace
   - Configure the port to `7545`
   - Keep it running in the background

5. Configure MetaMask:
   - Install MetaMask browser extension
   - Connect to `localhost:7545`
   - Import accounts from Ganache

6. Deploy smart contracts
```bash
truffle migrate --reset
```

7. Build the application
```bash
npm run build
```

8. Start the Node.js server
```bash
npm start
```

9. Start the Python face verification server (in a new terminal)
```bash
cd face_verification
python server.py
```

## Usage
1. Access the application at [http://localhost:8080](http://localhost:8080)
2. Login credentials:
   - **Admin**:  
     - Username: `admin`  
     - Password: `admin123`
   - **Voters**:  
     - Username: `voter1` to `voter6`  
     - Password: `voter123`

## Features
### Admin Panel
- Add/manage candidates
- Set voting dates

### Voter Features
- Secure login with face verification
- Vote for candidates
- View election status
- Session timeout management

## Security Features
- Face verification for voter authentication
- Blockchain-based immutable voting records
- Session management with timeouts
- One vote per voter enforcement

## Common Issues and Solutions
1. **Face verification fails:**
   - Ensure good lighting
   - Look directly at the camera
   - Make sure Python server is running

2. **MetaMask connection fails:**
   - Verify Ganache is running
   - Check if MetaMask is connected to `localhost:7545`

3. **Smart contracts don’t deploy:**
   - Ensure Ganache is running
   - Check `truffle-config.js` settings

## Future Scope
- Add support for real-time vote analytics
- Integrate biometric fingerprint/OTP-based verification
