import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Web3Modal from "web3modal";
import { providers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { setWalletConnected, setProviderOrSigner, setAddress, setProvider } from "../store";

function Navbar() {
  const web3ModalRef = useRef();
  const dispatch = useDispatch();
  const walletConnected = useSelector((state) => state.walletConnected);

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
    } catch (err) {
      alert(err);
    }
  };

  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current.connect();
    const providerOrSigner = new providers.Web3Provider(provider);

    dispatch(setProvider(providerOrSigner));
    const { chainId } = await providerOrSigner.getNetwork();

    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    const signer = await providerOrSigner.getSigner();
    const _address = await signer.getAddress();
    dispatch(setAddress(_address));
    dispatch(setProviderOrSigner(signer));
    dispatch(setWalletConnected(true));

    return signer;
  };

  useEffect(() => {
    if (!walletConnected) {
      console.log(walletConnected);
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [walletConnected]);

  // const provider = useSelector((state) => state.providerOrSigner);
  const address = useSelector((state) => state.address);

  return (
    <div>
      <nav className="flex items-center justify-between p-6">
        <Link href="/">
          <h1 className="text-2xl text-purple-800 font-bold sm:text-3xl md:text-4xl lg:text-5xl">
            EtherDex
          </h1>
        </Link>
        <button
          className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded cursor-pointer sm:py-3 sm:px-6 md:py-4 md:px-8 lg:py-2 lg:px-4"
          onClick={connectWallet}
        >
          {walletConnected
            ? address.substring(0, 10) + "..." + address.substring(30, 32)
            : "connect wallet"}
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
