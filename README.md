# Decentralized Exchange Project

This project is a decentralized exchange built using Next.js. It enables the exchange of Crypto Dev Tokens (CDT) and Ether (ETH) and provides LP (Liquidity Provider) tokens in return for providing liquidity to the exchange.

## Smart Contract

The smart contract used in this project is named "Exchange.sol" and is based on the ERC20 standard. It inherits from the OpenZeppelin ERC20 contract. Here is the code for the smart contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    address public cryptoDevTokenAddress;

    constructor(address _CryptoDevtoken) ERC20("CryptoDev LP Token", "CDLP") {
        require(_CryptoDevtoken != address(0), "Token address passed is a null address");
        cryptoDevTokenAddress = _CryptoDevtoken;
    }

    // ... rest of the smart contract code

}
```

The smart contract extends the ERC20 contract and adds functionality specific to the decentralized exchange. It has a constructor that initializes the contract with the address of the Crypto Dev Token (CDT) contract.

The smart contract provides functions to add liquidity, remove liquidity, and perform token swaps between ETH and CDT. It also includes helper functions to get the reserve amount, calculate token amounts, and perform token transfers.

## Usage

To use the decentralized exchange, you can interact with the smart contract functions described above. Here are some key features of the project:

- `addLiquidity`: Users can add liquidity to the exchange by providing an amount of CDT and ETH tokens. The function calculates the appropriate amount of LP tokens to be minted and transfers the tokens to the user.

- `removeLiquidity`: Users can remove liquidity from the exchange by burning a specified amount of LP tokens. The function returns the corresponding amounts of ETH and CDT tokens to the user.

- `ethToCryptoDevToken`: Users can swap ETH for CDT tokens using this function. The function calculates the amount of CDT tokens that will be received based on the ETH input and transfers the tokens to the user.

- `cryptoDevTokenToEth`: Users can swap CDT tokens for ETH using this function. The function calculates the amount of ETH that will be received based on the CDT input and transfers the ETH to the user.

Please note that this is a simplified explanation of the decentralized exchange project. It is important to review the complete code and understand the implications before deploying and using the smart contract in a production environment.

Feel free to explore and enhance the project based on your requirements and business logic.

## Setup

To set up and run the project locally, follow these steps:

1. Clone the project repository.
2. Install the necessary dependencies using `npm install` or `yarn install`.
3. Update the smart contract address and other configuration parameters as required.
4. Start the development server using `npm run dev` or `yarn dev`.
5. Access the decentralized exchange application through the provided URL.

Make sure to have a compatible Ethereum provider available for interacting with the smart contract, such as MetaMask.

### CD Tokens to ETH Conversion

The smart contract includes a function called `cryptoDevTokenToEth` which allows users to swap CD tokens for ETH. The function calculates the amount of ETH that will be received based on the number of CD tokens input by the user.

The calculation follows a concept called the "XY = K" curve, which ensures that the price impact is minimal when adding or removing liquidity. The formula used is:

```
ETH Amount = (CD Tokens Sold * ETH Reserve) / CD Token Reserve
```

- `CD Tokens Sold`: The number of CD tokens the user wants to swap.
- `ETH Reserve`: The current ETH reserve held by the smart contract.
- `CD Token Reserve`: The current CD token reserve held by the smart contract.

By using this formula, the smart contract determines the appropriate amount of ETH to be sent to the user based on the ratio of CD tokens sold to the reserves.

### ETH to CD Tokens Conversion

The smart contract includes a function called `ethToCryptoDevToken` which allows users to swap ETH for CD tokens. Similar to the CD to ETH conversion, the function calculates the number of CD tokens that will be received based on the amount of ETH input by the user.

The calculation follows the same "XY = K" curve concept, and the formula used is:

```
CD Tokens Bought = (ETH Sent * CD Token Reserve) / ETH Reserve
```

- `ETH Sent`: The amount of ETH sent by the user for the swap.
- `CD Token Reserve`: The current CD token reserve held by the smart contract.
- `ETH Reserve`: The current ETH reserve held by the smart contract.

By using this formula, the smart contract determines the appropriate number of CD tokens to be transferred to the user based on the ratio of ETH sent to the reserves.

These formulas ensure that the conversion between CD tokens and ETH maintains the liquidity and price stability in the decentralized exchange.

Please note that the formulas include a 1% fee, as mentioned in the code comments, which is subtracted from the input amount to account for the fee charged by the exchange.

It's important to understand these formulas and the impact they have on the conversion process when interacting with the smart contract in the decentralized exchange.

## Disclaimer

This project serves as an example and should not be considered as financial or investment advice. Always exercise caution and perform due diligence when using decentralized exchanges or interacting with smart contracts.
