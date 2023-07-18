import React, { useEffect, useState } from "react";
import { BigNumber, utils } from "ethers";
import { useSelector } from "react-redux";
import { CChart } from "@coreui/react-chartjs";
import {
  getCDTokensBalance,
  getEtherBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "@/utils/getAmount";

const Account = () => {
  const zero = BigNumber.from(0);
  const [ethBalance, setEtherBalance] = useState(zero);
  const [cdBalance, setCDBalance] = useState(zero);
  const [lpBalance, setLPBalance] = useState(zero);

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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAmounts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen text-white">
      <div className="w-full sm:w-3/4 md:w-1/2 lg:w-2/3 xl:w-1/2 max-w-2xl">
        <CChart
          type="bar"
          data={{
            labels: ["Crypto Dev Token", "Ether", "Crypto Dev LP Token"],
            datasets: [
              {
                label: "User Wallet Stats",
                backgroundColor: "#7E22CE",
                data: [
                  parseFloat(utils.formatEther(cdBalance)),
                  parseFloat(utils.formatEther(ethBalance)),
                  parseFloat(utils.formatEther(lpBalance)),
                ],
              },
            ],
          }}
          labels="months"
        />
      </div>
      <div className="text-1xl text-center mt-8">
        <h1 className="text-1xl">Ehtereum: {utils.formatEther(ethBalance)}</h1>
        <h1 className="text-1xl">
          Crypto Devs: {utils.formatEther(cdBalance)}
        </h1>
        <h1 className="text-1xl">
          Liquidity Provider Tokens: {utils.formatEther(lpBalance)}
        </h1>
      </div>
    </div>
  );
};

export default Account;
