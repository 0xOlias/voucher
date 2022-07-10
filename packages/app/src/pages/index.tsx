import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

import type { RawToken } from "../reservoirv2";
// import { fetchAsks, processRawAsks } from "../reservoir";
import { fetchTokens } from "../reservoirv2";

const TokenCard = ({
  token,
  timestamp,
}: {
  token: RawToken;
  timestamp: number;
}) => {
  return (
    <div className="rounded-md bg-gray-200 py-2 px-3">
      <p className="text-lg">{token.token.name}</p>
      <p>tokenId: {token.token.tokenId}</p>
      <p>
        time until expiration: {token.market.floorAsk.validUntil - timestamp}
      </p>
      {/* <p>maker: {ask.maker}</p> */}
      <p>price: {token.market.floorAsk.price}</p>
      <img
        alt={`${token.token.name} image`}
        src={token.token.image}
        width="300px"
        height="auto"
      />
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
    "0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7" // Loot!
  );

  const [tokens, setTokens] = useState<RawToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const tokens = await fetchTokens({ contractAddress });
      console.log({ tokens });

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
