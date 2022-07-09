import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

interface AskOrder {
  id: string;
  kind: string;
  maker: string;
  taker: string;
  contract?: string;
  tokenSetId: string;
  price: number;
  expiration: number;
}

const fetchAsks = async ({
  contractAddress,
  limit = 50,
  sortBy = "createdAt",
}: {
  contractAddress: string;
  limit?: number;
  sortBy?: string;
}): Promise<AskOrder[]> => {
  const res = await fetch(
    "https://api.reservoir.tools/orders/asks/v2?" +
      new URLSearchParams({
        contracts: contractAddress,
        // sortBy: sortBy,
        limit: `${limit}`,
      })
  );
  const data = await res.json();
  const { orders } = data;
  console.log({ orders });

  return orders as AskOrder[];
};

const HomePage: NextPage = () => {
  const [contractAddress, setContractAddress] = useState(
    "0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7"
  );

  const [asks, setAsks] = useState<AskOrder[]>([]);

  useEffect(() => {
    (async () => {
      const rawAsks = await fetchAsks({ contractAddress });

      setAsks(rawAsks);
    })();
  }, [contractAddress]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col gap-4 p-8">
        <div className="flex flex-row justify-between w-full">
          <h1 className="text-3xl">Voucher!</h1>
          <ConnectButton />
        </div>

        <div className="flex flex-wrap gap-4">
          {asks.map((ask) => (
            <div key={ask.id} className="rounded-md bg-gray-200 py-2 px-3">
              <p>kind: {ask.kind}</p>
              <p>contract: {ask.contract}</p>
              <p>tokenId: {ask.tokenSetId.split(":")[2]}</p>
              <p>expiration: {ask.expiration}</p>
              <p>maker: {ask.maker}</p>
              <p>price: {ask.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
