import React from "react";
import Link from "next/link";
import { AddIcon, ArrowUpDownIcon, SettingsIcon } from "@chakra-ui/icons";
import useMediaQuery from "@/hooks/useMediaquery";

const Template = ({ title, desc, Icon, link }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <div
      className="w-full md:w-1/3 bg-gradient-to-b from-[#C34FE2]/80 to-[#6B20A1]/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:drop-shadow-[0_2px_10px_rgba(225,252,228,0.75)] hover:-translate-y-1 transition hover:delay-100 "
      style={{
        backgroundImage: "linear-gradient(to bottom, #510797 , #B092DD )",
      }}
    >
      <div className="flex mx-auto justify-center pt-5 w-28">
        <Icon boxSize={8} color="white" />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-center">{title}</div>
        <p className="text-white text-base text-center">{desc}</p>
      </div>
      <div className="px-6 pt-4 pb-2 text-center">
        <Link href={link}>
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Check
          </button>
        </Link>
      </div>
    </div>
  );
};

const Card = () => {
  return (
    <div className="m-8">
      <h1 className="text-3xl font-bold text-purple-800 text-center m-8">
        User Dashboard
      </h1>
      <div className="md:space-x-6 space-y-2 md:space-y-0 flex flex-col md:flex-row">
        <Template
          title="Add/Remove Liquidity"
          desc="Add or remove(if added) liquidity from the pool"
          Icon={AddIcon}
          link="/ARL"
        />

        <Template
          title="Swap"
          desc="Swap Eth/Token"
          Icon={ArrowUpDownIcon}
          link="Swap"
        />

        <Template
          title="User Account"
          desc="Check your account"
          Icon={SettingsIcon}
          link="Account"
        />
      </div>
    </div>
  );
};

export default Card;
