interface RawAskOrder {
  id: string;
  kind: string;
  maker: string;
  taker: string;
  contract?: string;
  tokenSetId: string;
  price: number;
  expiration: number;
  metadata: {
    kind: string;
    data: {
      collectionName: string;
      image: string;
      tokenName: string;
    };
  };
}

interface AskOrder extends RawAskOrder {
  tokenId: number;
}

const apiKey = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY!;

const fetchAsks = async ({
  contractAddress,
  limit = 100,
}: {
  contractAddress: string;
  limit?: number;
}): Promise<RawAskOrder[]> => {
  const rawAsks: RawAskOrder[] = [];

  const res = await fetch(
    "https://api.reservoir.tools/orders/asks/v2?" +
      new URLSearchParams({
        contracts: contractAddress,
        limit: `${limit}`,
      }),
    { headers: new Headers({ "x-api-key": apiKey }) }
  );
  const { orders, continuation } = (await res.json()) as {
    orders: RawAskOrder[];
    continuation: string;
  };

  let prevLength: number = orders.length;
  let continuationToken: string = continuation;
  console.log("got:", { prevLength, continuationToken });
  rawAsks.push(...orders);

  while (continuationToken) {
    const res = await fetch(
      "https://api.reservoir.tools/orders/asks/v2?" +
        new URLSearchParams({
          contracts: contractAddress,
          limit: `${limit}`,
          continuation: continuationToken,
        })
    );
    const { orders, continuation } = (await res.json()) as {
      orders: RawAskOrder[];
      continuation: string;
    };

    prevLength = orders.length;
    continuationToken = continuation;
    console.log("got:", { prevLength, continuationToken });
    rawAsks.push(...orders);
  }

  return rawAsks as RawAskOrder[];
};

const processRawAsks = (rawAsks: RawAskOrder[]): AskOrder[] => {
  const asks: AskOrder[] = rawAsks
    .map((ask) => ({
      ...ask,
      tokenId: parseInt(ask.tokenSetId.split(":")[2]),
    }))
    .filter((ask) => ask.kind === "seaport"); // for old opensea listings, "wyvern-v2.3"

  const bestAsksByTokenId: Record<number, AskOrder> = {};

  asks.forEach((ask) => {
    if (!bestAsksByTokenId[ask.tokenId]) {
      bestAsksByTokenId[ask.tokenId] = ask;
    } else if (
      bestAsksByTokenId[ask.tokenId] &&
      ask.price <= bestAsksByTokenId[ask.tokenId].price &&
      ask.expiration > bestAsksByTokenId[ask.tokenId].expiration
    ) {
      bestAsksByTokenId[ask.tokenId] = ask;
    }
  });

  const sortedAsks = Object.values(bestAsksByTokenId).sort(
    (a, b) => a.price - b.price
  );

  return sortedAsks;
};

export { fetchAsks, processRawAsks };
export type { AskOrder, RawAskOrder };
