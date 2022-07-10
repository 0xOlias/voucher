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
    };
  };
}

const apiKey = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY!;

const fetchTokens = async ({
  contractAddress,
  limit = 50,
  sortBy = "floorAskPrice",
}: {
  contractAddress: string;
  limit?: number;
  sortBy?: string;
}): Promise<RawToken[]> => {
  const res = await fetch(
    "https://api.reservoir.tools/tokens/details/v4?" +
      new URLSearchParams({
        contract: contractAddress,
        limit: `${limit}`,
        sortBy: sortBy,
      }),
    { headers: new Headers({ "x-api-key": apiKey }) }
  );
  const response = await res.json();
  if (response.error) throw new Error(response.error as string);
  const { tokens, continuation } = response as {
    tokens: RawToken[];
    continuation: string;
  };

  const asks = tokens
    .map((token) => token.market.floorAsk)
    .filter((x) => !!x.id);
  console.log({ asks });

  return tokens as RawToken[];
};

export { fetchTokens };
export type { RawToken };
