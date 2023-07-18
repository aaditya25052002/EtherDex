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

    // Exchange is inheriting ERC20, because our exchange would keep track of Crypto Dev LP tokens
    constructor(address _CryptoDevtoken) ERC20("CryptoDev LP Token", "CDLP") {
        require(_CryptoDevtoken != address(0), "Token address passed is a null address");
        cryptoDevTokenAddress = _CryptoDevtoken;
    }

    /**
    * @dev Returns the amount of `Crypto Dev Tokens` held by the contract
    */
    function getReserve() public view returns (uint256) {
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }

    /**
    * @dev Adds liquidity to the exchange.
    */
    function addLiquidity(uint _amount) public payable returns (uint) {
        uint liquidity;
        uint ethBalance = address(this).balance;
        uint cryptoDevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);
        /*
            If the reserve is empty, intake any user supplied value for
            `Ether` and `Crypto Dev` tokens because there is no ratio currently
        */
        if(cryptoDevTokenReserve == 0) {
            // Transfer the `cryptoDevToken` address from the user's account to the contract
            cryptoDevToken.transferFrom(msg.sender, address(this), _amount);
            // Take the current ethBalance and mint `ethBalance` amount of LP tokens to the user.
            // `liquidity` provided is equal to `ethBalance` because this is the first time user
            // is adding `Eth` to the contract, so whatever `Eth` contract has is equal to the one supplied
            // by the user in the current `addLiquidity` call
            // `liquidity` tokens that need to be minted to the user on `addLiquidity` call should always be proportional
            // to the Eth specified by the user
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        } else {
            /*
                If the reserve is not empty, intake any user supplied value for
                `Ether` and determine according to the ratio how many `Crypto Dev` tokens
                need to be supplied to prevent any large price impacts because of the additional
                liquidity
            */
            // EthReserve should be the current ethBalance subtracted by the value of ether sent by the user
            // in the current `addLiquidity` call
            uint ethReserve =  ethBalance - msg.value;
            // Ratio should always be maintained so that there are no major price impacts when adding liquidity
            // Ration here is -> (cryptoDevTokenAmount user can add/cryptoDevTokenReserve in the contract) = (Eth Sent by the user/Eth Reserve in the contract);
            // So doing some maths, (cryptoDevTokenAmount user can add) = (Eth Sent by the user * cryptoDevTokenReserve /Eth Reserve);
            uint cryptoDevTokenAmount = (msg.value * cryptoDevTokenReserve)/(ethReserve);
            require(_amount >= cryptoDevTokenAmount, "Amount of tokens sent is less than the minimum tokens required");
            // transfer only (cryptoDevTokenAmount user can add) amount of `Crypto Dev tokens` from users account
            // to the contract
            cryptoDevToken.transferFrom(msg.sender, address(this), cryptoDevTokenAmount);
            // The amount of LP tokens that would be sent to the user should be propotional to the liquidity of
            // ether added by the user
            // Ratio here to be maintained is ->
            // (lp tokens to be sent to the user (liquidity)/ totalSupply of LP tokens in contract) = (Eth sent by the user)/(Eth reserve in the contract)
            // by some maths -> liquidity =  (totalSupply of LP tokens in contract * (Eth sent by the user))/(Eth reserve in the contract)
            liquidity = (totalSupply() * msg.value)/ ethReserve;
            _mint(msg.sender, liquidity);
        }
         return liquidity;
    }

    /**
    * @dev Returns the amount Eth/Crypto Dev tokens that would be returned to the user
    * in the swap
    */
    function removeLiquidity(uint _amount) public returns (uint , uint) {
        require(_amount > 0, "_amount should be greater than zero");
        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();
        // The amount of Eth that would be sent back to the user is based
        // on a ratio
        // Ratio is -> (Eth sent back to the user/ Current Eth reserve)
        // = (amount of LP tokens that user wants to withdraw) / (total supply of LP tokens)
        // Then by some maths -> (Eth sent back to the user)
        // = (current Eth reserve * amount of LP tokens that user wants to withdraw) / (total supply of LP tokens)
        uint ethAmount = (ethReserve * _amount)/ _totalSupply;
        // The amount of Crypto Dev token that would be sent back to the user is based
        // on a ratio
        // Ratio is -> (Crypto Dev sent back to the user) / (current Crypto Dev token reserve)
        // = (amount of LP tokens that user wants to withdraw) / (total supply of LP tokens)
        // Then by some maths -> (Crypto Dev sent back to the user)
        // = (current Crypto Dev token reserve * amount of LP tokens that user wants to withdraw) / (total supply of LP tokens)
        uint cryptoDevTokenAmount = (getReserve() * _amount)/ _totalSupply;
        // Burn the sent `LP` tokens from the user's wallet because they are already sent to
        // remove liquidity
        _burn(msg.sender, _amount);
        // Transfer `ethAmount` of Eth from the contract to the user's wallet
        payable(msg.sender).transfer(ethAmount);
        // Transfer `cryptoDevTokenAmount` of `Crypto Dev` tokens from the contract to the user's wallet
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);
        return (ethAmount, cryptoDevTokenAmount);
    }

    /**
    * @dev Returns the amount Eth/Crypto Dev tokens that would be returned to the user
    * in the swap
    */
    function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        // We are charging a fee of `1%`
        // Input amount with fee = (input amount - (1*(input amount)/100)) = ((input amount)*99)/100
        uint256 inputAmountWithFee = inputAmount * 99;
        // Because we need to follow the concept of `XY = K` curve
        // We need to make sure (x + Δx) * (y - Δy) = x * y
        // So the final formula is Δy = (y * Δx) / (x + Δx)
        // Δy in our case is `tokens to be received`
        // Δx = ((input amount)*99)/100, x = inputReserve, y = outputReserve
        // So by putting the values in the formulae you can get the numerator and denominator
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }

    /**
    * @dev Swaps Eth for CryptoDev Tokens
    */
    function ethToCryptoDevToken(uint _minTokens) public payable {
        uint256 tokenReserve = getReserve();
        // call the `getAmountOfTokens` to get the amount of Crypto Dev tokens
        // that would be returned to the user after the swap
        // Notice that the `inputReserve` we are sending is equal to
        // `address(this).balance - msg.value` instead of just `address(this).balance`
        // because `address(this).balance` already contains the `msg.value` user has sent in the given call
        // so we need to subtract it to get the actual input reserve
        uint256 tokensBought = getAmountOfTokens(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );

        require(tokensBought >= _minTokens, "insufficient output amount");
        // Transfer the `Crypto Dev` tokens to the user
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokensBought);
    }


    /**
    * @dev Swaps CryptoDev Tokens for Eth
    */
    function cryptoDevTokenToEth(uint _tokensSold, uint _minEth) public {
        uint256 tokenReserve = getReserve();
        // call the `getAmountOfTokens` to get the amount of Eth
        // that would be returned to the user after the swap
        uint256 ethBought = getAmountOfTokens(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );
        require(ethBought >= _minEth, "insufficient output amount");
        // Transfer `Crypto Dev` tokens from the user's address to the contract
        ERC20(cryptoDevTokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        // send the `ethBought` to the user from the contract
        payable(msg.sender).transfer(ethBought);
    }
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
