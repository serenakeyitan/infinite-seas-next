"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getFaucetHost, requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { useAuthCallback, useEnokiFlow } from "@mysten/enoki/react";
import toast from "react-hot-toast";

import CreatePlayerForm from "@/components/form/CreatePlayerForm";
import { getCurrentPlayerId } from "@/actions/player.action";
import { useGlobalContext } from "@/context/GlobalContext";
import { GOOGLE_OAUTH_CLIENT_ID, REDIRECT_URL } from "@/constant";

export default function ZkLoginForm() {
  const [newPlayerFlag, setNewPlayerFlag] = useState<boolean>(false);

  const router = useRouter();

  const enokiFlow = useEnokiFlow();
  const { handled } = useAuthCallback();

  const { currentPlayerId, refetchPlayer, refetchEnergy } = useGlobalContext();

  useEffect(() => {
    if (!location.hash) return;

    const hash = location.hash.substring(1);
    const newUrl = location.origin + location.pathname + "?" + hash;
    history.replaceState(null, "", newUrl);
  }, []);

  useEffect(() => {
    async function handleZkStatus() {
      if (!handled || !enokiFlow.$zkLoginState.value?.address || currentPlayerId) return;

      toast.loading("Checking zero-knowledge proof status...");

      history.replaceState(null, "", location.origin + location.pathname);

      // Sui coin faucet, only sui testnet
      await requestSuiFromFaucetV0({
        host: getFaucetHost("testnet"),
        recipient: enokiFlow.$zkLoginState.value.address,
      });

      const playerId = await getCurrentPlayerId({ owner: enokiFlow.$zkLoginState.value.address });
      if (!playerId) return setNewPlayerFlag(true);

      await refetchPlayer();
      await refetchEnergy();

      toast.success("Logged in Successfully!");
    }

    handleZkStatus();
  }, [handled, enokiFlow.$zkLoginState, currentPlayerId, refetchPlayer, refetchEnergy]);

  async function handleUserStatusAction() {
    if (currentPlayerId) {
      await enokiFlow.logout();
      toast.success("Logged out Successfully!");

      return location.reload();
    }

    toast.loading("Using your Google account to act a zero-knowledge login...");

    try {
      // Init OAuth and get its login url
      const oAuthLoginUrl = await enokiFlow.createAuthorizationURL({
        provider: "google",
        network: "testnet",
        clientId: GOOGLE_OAUTH_CLIENT_ID,
        redirectUrl: REDIRECT_URL, // For prod mode
        // redirectUrl: "https://localhost:3000", // For dev mode
        extraParams: { scope: ["openid", "email", "profile"] },
      });

      router.push(oAuthLoginUrl);
    } catch (error: any) {
      toast.error(`Failed to login: ${error.message}!`);
    }
  }

  return (
    <>
      {newPlayerFlag && <CreatePlayerForm handleCloseModal={() => setNewPlayerFlag(false)} />}

      <Image
        className="cursor-pointer"
        src="/image/home/wallet.png"
        alt="wallet-button"
        width={50}
        height={50}
        priority
        onClick={handleUserStatusAction}
      />
    </>
  );
}
