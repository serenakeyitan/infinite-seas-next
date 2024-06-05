"use client";

import Image from "next/image";

import EnergyFaucetForm from "@/components/form/EnergyFaucetForm";
import ConnectWalletBtn from "@/components/wallet/ConnectWalletBtn";

export default function NavItems({
  getIslandClicked,
  getShipsClicked,
}: {
  getIslandClicked: () => void;
  getShipsClicked: () => void;
}) {
  function handleSettingButton() {
    console.log("Here is setting button");
  }

  function handlePointsButton() {
    console.log("Here is points button");
  }

  function handleEnergyBar() {
    console.log("Here is energy bar");
  }

  return (
    <>
      {/* Top-left buttons */}
      <div className="fixed top-6 left-6 flex flex-col gap-3">
        <Image
          className="cursor-pointer"
          src="/image/home/Setting_Button.png"
          alt="setting-button"
          width={50}
          height={50}
          priority
          onClick={handleSettingButton}
        />
        <ConnectWalletBtn />
        <Image
          className="cursor-pointer"
          src="/image/home/Points-Button.png"
          alt="points-button"
          width={50}
          height={50}
          priority
          onClick={handlePointsButton}
        />
      </div>

      {/* Energy bar */}
      <Image
        className="fixed top-4 right-4 cursor-pointer"
        src="/image/home/Energy_Bar.png"
        alt="energy-bar"
        width={240}
        height={120}
        priority
        onClick={handleEnergyBar}
      />

      {/* Faucet */}
      <EnergyFaucetForm />

      {/* Bottom-right buttons */}
      <div className="flex items-center fixed bottom-2 right-6 gap-1">
        <Image
          className="cursor-pointer"
          src="/image/home/Island_Button.png"
          alt="island-button"
          width={110}
          height={160}
          priority
          onClick={getIslandClicked}
        />
        <Image
          className="cursor-pointer"
          src="/image/home/Ships_Button.png"
          alt="ship-button"
          width={110}
          height={160}
          priority
          onClick={getShipsClicked}
        />
      </div>
    </>
  );
}
