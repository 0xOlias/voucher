import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

import type { RawToken, Step } from "../reservoirv2";
import { fetchStepsForToken, fetchTokens } from "../reservoirv2";

const TokenCard = ({
  token,
  timestamp,
}: {
  token: RawToken;
  timestamp: number;
}) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSteps = async () => {
    setLoading(true);
    const steps = await fetchStepsForToken({
      contractAddress: token.token.contract,
      tokenId: token.token.tokenId,
    });
    setSteps(steps);
    setLoading(false);
  };

  return (
    <div className="flex flex-col rounded-md bg-gray-200 py-2 px-3 gap-2 w-full sm:w-[calc(50%-9px)] md:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)]">
      <p className="overflow-x-auto whitespace-nowrap w-full">
        {token.token.name}
      </p>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-1">
          <span className="">{token.market.floorAsk.price}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ethereum.org/static/a183661dd70e0e5c70689a0ec95ef0ba/13c43/eth-diamond-purple.png"
            height="10px"
            width="10px"
            alt="ether icon"
          />
        </div>

        <a
          href={token.market.floorAsk.source.url}
          target="_blank"
          rel="noreferrer"
          className="flex flex-row items-center gap-1 hover:text-blue-500 hover:underline text-sm"
        >
          View on
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={token.market.floorAsk.source.icon}
            height="15px"
            width="15px"
            alt={`${token.market.floorAsk.source.name} icon`}
          />
        </a>
      </div>

      {/* <p>
        time until expiration: {token.market.floorAsk.validUntil - timestamp}
      </p> */}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={`${token.token.name} image`}
        src={token.token.image}
        width="100%"
        height="auto"
      />

      <button
        className="px-1.5 py-1 rounded-md bg-gray-400 hover:bg-gray-500"
        onClick={() => fetchSteps()}
      >
        Fetch steps
      </button>
      {steps.map((step, idx) => {
        return (
          <div key={idx} className="rounded-md bg-gray-300 py-2 px-3">
            <p>{step.action}</p>
          </div>
        );
      })}
    </div>
  );
};

const HomePage: NextPage = () => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [contractAddress, setContractAddress] = useState(
    // "0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7" // Loot!
    "0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63" // Blitmap!
  );

  const [tokens, setTokens] = useState<RawToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const tokens = await fetchTokens({ contractAddress });
      setTokens(tokens);
      setLoading(false);
    })();
  }, [contractAddress]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col gap-4 p-8">
        <div className="flex flex-row justify-between w-full">
          <h1 className="text-3xl">Voucher!</h1>
          <ConnectButton />
        </div>

        <div className="flex flex-col w-full">
          <p>NFT contract address</p>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="bg-gray-100 rounded-md px-1.5 py-1 border border-gray-500"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            tokens.map((token) => (
              <TokenCard
                key={token.token.tokenId}
                token={token}
                timestamp={timestamp}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
