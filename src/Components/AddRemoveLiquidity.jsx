import React, { useEffect, useState } from "react";
import { Input, Button } from "@chakra-ui/react";
import { CChart } from "@coreui/react-chartjs";
import Navbar from "./Navbar";
import { BigNumber, providers, utils } from "ethers";
import { useSelector } from "react-redux";
import { addLiquidity } from "@/utils/addLiquidity";
import { removeLiquidity } from "@/utils/removeLiquidity";
import useMediaQuery from "@/hooks/useMediaquery";
import {
  getCDTokensBalance,
  getEtherBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "@/utils/getAmount";

const AddRemoveLiquidity = () => {
  const zero = BigNumber.from(0);
  const [addEther, setAddEther] = useState(zero);
  const [addCDTokens, setAddCDTokens] = useState(zero);
  const [ethBalance, setEtherBalance] = useState(zero);
  const [cdBalance, setCDBalance] = useState(zero);
  const [lpBalance, setLPBalance] = useState(zero);
  const [etherBalanceContract, setEtherBalanceContract] = useState(zero);
  const [reservedCD, setReservedCD] = useState(zero);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const signer = useSelector((state) => state.providerOrSigner);
  const provider = useSelector((state) => state.provider);
  const address = useSelector((state) => state.address);

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

  const _addLiquidity = async () => {
    try {
      const addEtherWei = utils.parseEther(addEther.toString());

      if (!addCDTokens == 0 && !addEtherWei.eq(zero)) {
        console.log("hey there add liquidity is working fine!!");
        await addLiquidity(signer, addCDTokens, addEtherWei);
        setAddCDTokens(zero);
        await getAmounts();
      } else {
        setAddCDTokens(zero);
      }
    } catch (err) {
      console.error(err);
      setAddCDTokens(zero);
    }
  };

  useEffect(() => {
    getAmounts();
  }, []);

  const DualInput = ({ setFunc1, setFunc2 }) => {
    return (
      <div className="flex border-2 border-purple-500 rounded-md mb-2">
        <Input
          variant="outlinedx"
          bg="transparent"
          color="white"
          placeholder="Add Ether"
          _placeholder={{ color: "white" }}
          size="lg"
          onChange={(e) => setFunc1(e.target.value || "0")}
        />
        <div className="border-l-2 border-purple-500 my-2"></div>
        <Input
          variant="outlinedx"
          bg="transparent"
          color="white"
          placeholder="Add CD"
          _placeholder={{ color: "white" }}
          size="lg"
          onChange={(e) => setFunc2(e.target.value || "0")}
        />
      </div>
    );
  };

  console.log(reservedCD.toString());
  return (
    <div>
      <Navbar />
      <div className="flex flex-col sm:flex-row h-full sm:h-full">
        <div className="flex items-center justify-center flex-col text-white w-full sm:w-1/2 h-1/2 sm:h-full">
          <h1 className="text-1xl text-center">Remove Liquidity</h1>
          <form className="flex flex-col sm:flex-row">
            <Input
              variant="outlinedx"
              bg="transparent"
              border="2px"
              borderColor="purple.500"
              color="white"
              placeholder="Enter your text"
              _placeholder={{ color: "white" }}
              size="lg"
              mb={2}
              mr={2}
            />
            <Button
              colorScheme="purple"
              size="lg"
              _hover={{ bg: "purple.600" }}
              _active={{ bg: "purple.700" }}
            >
              Remove
            </Button>
          </form>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-center flex-col text-white mx-8 sm:mx-0 my-8 sm:my-0">
            <h1 className="text-1xl text-center">Add Liquidity</h1>

            {utils.parseEther(reservedCD.toString()).eq(zero) ? (
              <div className="flex">
                <form className="flex flex-col sm:flex-row">
                  <DualInput setFunc1={setAddEther} setFunc2={setAddCDTokens} />

                  <Button
                    colorScheme="purple"
                    size="lg"
                    _hover={{ bg: "purple.600" }}
                    _active={{ bg: "purple.700" }}
                    onClick={_addLiquidity}
                    ml={1}
                  >
                    Add
                  </Button>
                </form>
              </div>
            ) : (
              <div>
                <form className="flex flex-col sm:flex-row">
                  <Input
                    variant="outlinedx"
                    bg="transparent"
                    border="2px"
                    borderColor="purple.500"
                    color="white"
                    placeholder="Enter your text"
                    _placeholder={{ color: "white" }}
                    //  _hover={{ bg: "purple.500" }}
                    //  _focus={{ bg: "purple.500" }}
                    size="lg"
                    mb={4}
                    mr={2}
                    onChange={async (e) => {
                      setAddEther(e.target.value || "0");
                      // calculate the number of CD tokens that
                      // can be added given  `e.target.value` amount of Eth
                      const _addCDTokens = await calculateCD(
                        e.target.value || "0",
                        etherBalanceContract,
                        reservedCD
                      );
                      setAddCDTokens(_addCDTokens);
                    }}
                  />
                  <Button
                    colorScheme="purple"
                    size="lg"
                    _hover={{ bg: "purple.600" }}
                    _active={{ bg: "purple.700" }}
                    onClick={_addLiquidity}
                  >
                    Add
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-screen -mt-64 sm:-mt-32">
        <div style={{ width: "350px" }} className="mx-auto sm:mx-0">
          <CChart
            type="doughnut"
            data={{
              labels: ["Eth", "CD Token"],
              datasets: [
                {
                  backgroundColor: ["#805AD5", "white"],
                  data: [parseFloat(ethBalance), parseFloat(cdBalance)],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddRemoveLiquidity;
