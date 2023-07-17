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
    <div className="flex items-center justify-center w-full h-screen text-white">
      <div style={{ width: "50vw", height: "50vh" }}>
        <CChart
          type="bar"
          data={{
            labels: ["Crypto Dev Token", "Ether", "Crypto Dev LP Token"],
            datasets: [
              {
                label: "User Wallet Stats",
                backgroundColor: "#7E22CE",
                data: [
                  parseFloat(cdBalance),
                  parseFloat(ethBalance),
                  parseFloat(lpBalance),
                ],
              },
            ],
          }}
          labels="months"
        />
      </div>
    </div>
  );
};

export default Account;
