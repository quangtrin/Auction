npx hardhat node

npx hardhat run scripts/deploy.js --network localhost
move file "artifacts/contracts/AuctionContract.sol/AuctionContract.json" -> folder "src/context"
update AuctionContractAddress in file "scr/context/constants"

update file .env
examp_value:
REACT_APP_INFURIA_PID=2RpehrQCfbltNnGlS3NcXEGNdnV
REACT_APP_INFURIA_API=081b1f0dd5ab43b1268d7411467a327d

npm start