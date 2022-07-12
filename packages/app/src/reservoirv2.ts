interface RawToken {
  token: {
    contract: string;
    tokenId: number;
    name: string;
    description: string;
    image: string;
    kind: string;
  };
  market: {
    floorAsk: {
      id: string;
      price: number;
      maker: string;
      validUntil: number;
      source: {
        icon: string;
        id: string;
        name: string;
        url: string;
      };
    };
  };
}

const apiKey = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY!;
const testTaker = "0xd17d1BcDe2A28AaDe2b3B5012f93b8B079d0E86B";

const fetchTokens = async ({
  contractAddress,
  limit = 50,
}: {
  contractAddress: string;
  limit?: number;
  sortBy?: string;
}): Promise<RawToken[]> => {
  const res = await fetch(
    "https://api.reservoir.tools/tokens/details/v4?" +
      new URLSearchParams({
        collection: contractAddress,
        limit: `${limit}`,
      }),
    { headers: new Headers({ "x-api-key": apiKey }) }
  );
  const response = await res.json();
  if (response.error) throw new Error(response.error as string);
  const { tokens, continuation } = response as {
    tokens: RawToken[];
    continuation: string;
  };

  return tokens as RawToken[];
};

interface Step {
  action: string;
  description: string;
  kind: string;
  status: string;
  data: {
    data: string;
    from: string;
    to: string;
    value: string;
  };
}

const fetchStepsForToken = async ({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: number;
}): Promise<Step[]> => {
  const res = await fetch(
    "https://api.reservoir.tools/execute/buy/v2?" +
      new URLSearchParams({
        token: `${contractAddress}:${tokenId}`,
        taker: testTaker,
        skipBalanceCheck: "true",
      }),
    { headers: new Headers({ "x-api-key": apiKey }) }
  );
  const response = await res.json();
  console.log({ response });

  if (response.error) throw new Error(response.error as string);
  const { quote, steps } = response as {
    quote: number;
    steps: Step[];
  };

  return steps as Step[];
};

export { fetchStepsForToken, fetchTokens };
export type { RawToken, Step };
