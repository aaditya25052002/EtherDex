import { useEffect, useState } from "react";
import { BigNumber, providers, utils } from "ethers";
import { Input, Button, Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  getCDTokensBalance,
  getEtherBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "@/utils/getAmount";

import { swapTokens, getAmountOfTokensReceivedFromSwap } from "@/utils/swaps";

const MyComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const [ethSelected, setEthSelected] = useState(false);
  const zero = BigNumber.from(0);
  const [tokenToBeReceivedAfterSwap, settokenToBeReceivedAfterSwap] =
    useState(zero);
  const [ethBalance, setEtherBalance] = useState(zero);
  const [cdBalance, setCDBalance] = useState(zero);
  const [lpBalance, setLPBalance] = useState(zero);
  const [etherBalanceContract, setEtherBalanceContract] = useState(zero);
  const [reservedCD, setReservedCD] = useState(zero);

  const signer = useSelector((state) => state.providerOrSigner);
  const provider = useSelector((state) => state.provider);

  const handleButtonClick1 = async() => {
    // Function for button 1
    setEthSelected(true);
    await _swapTokens();
    setInputValue(""); // Reset the input field
  };

  const handleButtonClick2 = async() => {
    // Function for button 2
    setEthSelected(false);
    await _swapTokens();
    setInputValue(""); // Reset the input field
  };

  const handleInputChange = async(e) => {
    // Function to update the input value
    
      setInputValue(e.target.value || "");
      // Calculate the amount of tokens user would receive after the swap
      await _getAmountOfTokensReceivedFromSwap(e.target.value || "0");
  
  };

  const getAmounts = async () => {
    try {
      const _ethBalance = await getEtherBalance(provider, address);
      const _cdBalance = await getCDTokensBalance(provider, address);
      const _lpBalance = await getLPTokensBalance(provider, address);
      const _reservedCD = await getReserveOfCDTokens(provider);
      const _ethBalanceContract = await getEtherBalance(provider, null, true);
      setEtherBalance(_ethBalance);
      setCDBalance(_cdBalance);
      setLPBalance(_lpBalance);
      setReservedCD(_reservedCD);
      setEtherBalanceContract(_ethBalanceContract);
    } catch (err) {
      console.error(err);
    }
  };

  const _swapTokens = async () => {
    try {
      // Convert the amount entered by the user to a BigNumber using the `parseEther` library from `ethers.js`
      const swapAmountWei = utils.parseEther(inputValue);
      // Check if the user entered zero
      // We are here using the `eq` method from BigNumber class in `ethers.js`
      if (!swapAmountWei.eq(zero)) {
        // Call the swapTokens function from the `utils` folder
        await swapTokens(
          signer,
          swapAmountWei,
          tokenToBeReceivedAfterSwap,
          ethSelected
        );
        // Get all the updated amounts after the swap
        await getAmounts();
        setInputValue("");
      }
    } catch (err) {
      console.error(err);
      setInputValue("");
    }
  };

  const _getAmountOfTokensReceivedFromSwap = async (_swapAmount) => {
    try {
      // Convert the amount entered by the user to a BigNumber using the `parseEther` library from `ethers.js`
      const _swapAmountWEI = utils.parseEther(_swapAmount.toString());
      // Check if the user entered zero
      // We are here using the `eq` method from BigNumber class in `ethers.js`
      if (!_swapAmountWEI.eq(zero)) {
        // Get the amount of ether in the contract
        const _ethBalance = await getEtherBalance(provider, null, true);
        // Call the `getAmountOfTokensReceivedFromSwap` from the utils folder
        const amountOfTokens = await getAmountOfTokensReceivedFromSwap(
          _swapAmountWEI,
          provider,
          ethSelected,
          _ethBalance,
          reservedCD
        );
        settokenToBeReceivedAfterSwap(amountOfTokens);
      } else {
        settokenToBeReceivedAfterSwap(zero);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAmounts();
  }, []);

  return (
    <div
      className="flex h-screen"
      style={{ marginTop: "-10%", marginBottom: "-25%" }}
    >
      <div className="w-1/2 flex items-center text-white justify-center flex-col">
        <Flex direction="column" align="center">
          <Input
            value={inputValue}
            variant="outlinedx"
            bg="transparent"
            border="2px"
            borderColor="purple.500"
            color="white"
            placeholder="Enter the amount to swap"
            _placeholder={{ color: "white" }}
            onChange={handleInputChange}
            //  _hover={{ bg: "purple.500" }}
            //  _focus={{ bg: "purple.500" }}
            size="lg"
            width="100%"
            m={4}
          />
          <div className="flex justify-center items-center">
            <Button
              colorScheme="purple"
              size="lg"
              _hover={{ bg: "purple.600" }}
              _active={{ bg: "purple.700" }}
              onClick={handleButtonClick1}
              mr={2}
            >
              Eth
            </Button>
            <Button
              colorScheme="purple"
              size="lg"
              _hover={{ bg: "purple.600" }}
              _active={{ bg: "purple.700" }}
              onClick={handleButtonClick2}
              ml={2}
            >
              CD
            </Button>
          </div>
        </Flex>
      </div>
      <div className="w-1/2 flex items-center justify-center flex-col ">
        <img
          className="max-h-96 max-w-full border-8"
          src="https://images.squarespace-cdn.com/content/v1/63d2bbe49b0f017e900b381d/641ae55e-cb95-4de6-b46c-44a179ee049e/privacy_icon_k5.gif"
          alt="Image"
        />
      </div>
    </div>
  );
};

export default MyComponent;
