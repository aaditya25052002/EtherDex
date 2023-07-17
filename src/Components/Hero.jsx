import React from "react";
import Link from "next/link";
import useMediaQuery from "@/hooks/useMediaquery";

const Home = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return isNonMobileScreens ? (
    <div
      className="flex h-screen"
      style={{ marginBottom: "-10%", marginTop: "-5%" }}
    >
      <div className="w-1/2 flex items-center text-white justify-center flex-col">
        {/* Left-hand side with image */}
        <h6 className="text-1xl">
          The future of decentralized exchanges is here.
        </h6>
        <h3 className="text-3xl text-purple-800 font-bold">
          Eth/CD-Token based Exchange
        </h3>
        <h3 className="text-1xl text-center m-4 text-white">
          Introducing DeFiSwap: The Fun and Funky Way to Swap CD Tokens and ETH!
          Join us for a groovy experience, where trading meets entertainment.
          Swap, shimmy, and secure your assets with advanced protocols.
        </h3>
        <div className="flex justify-center items-center">
          <button className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded cursor-pointer mr-2">
            Mint CD Tokens
          </button>
          <Link href="/Dashboard">
            <button className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
              Dashboard
            </button>
          </Link>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center relative">
        {/* Company Name and Logo */}

        {/* Right-hand side content */}
        <img
          className="max-h-96 max-w-full border-8"
          src="https://statics.ambcrypto.com/wp-content/uploads/2023/05/eth-wale.png"
          alt="Image"
        />
      </div>
    </div>
  ) : (
    <div className="flex items-center text-white justify-center flex-col mt-32 mr-8 ml-8">
      {/* Left-hand side with image */}
      <h6 className="text-1xl">
        The future of decentralized exchanges is here!
      </h6>
      <h3 className="text-3xl text-purple-800 text-center font-bold">
        Eth/CD-Token based Exchange
      </h3>
      <h3 className="text-2xl text-center m-4 text-white mt-8">
        Introducing DeFiSwap: The Fun and Funky Way to Swap CD Tokens and ETH!
        Join us for a groovy experience, where trading meets entertainment.
        Swap, shimmy, and secure your assets with advanced protocols.
      </h3>
      <div className="flex justify-center items-center">
        <button className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded cursor-pointer mr-2">
          Mint CD Tokens
        </button>
        <Link href="/Dashboard">
          <button className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
