/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { ERC721Voucher, ERC721VoucherInterface } from "../ERC721Voucher";

const _abi = [
  {
    inputs: [],
    name: "PaymentFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "VoucherAlreadyRedeemed",
    type: "error",
  },
  {
    inputs: [],
    name: "VoucherAlreadyRevoked",
    type: "error",
  },
  {
    inputs: [],
    name: "VoucherNotOwned",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "voucherId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "VoucherCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "voucherId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "spent",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "VoucherRedeemed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "voucherId",
        type: "uint256",
      },
    ],
    name: "VoucherRevoked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "createVoucher",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_voucherId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "redeemVoucher",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_voucherId",
        type: "uint256",
      },
    ],
    name: "revokeVoucher",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600060015534801561001557600080fd5b5060016000556105308061002a6000396000f3fe6080604052600436106100345760003560e01c8063255510671461003957806379a5fea91461005b578063a40356c21461007b575b600080fd5b34801561004557600080fd5b50610059610054366004610472565b61008e565b005b34801561006757600080fd5b50610059610076366004610494565b610193565b6100596100893660046104c9565b610357565b6000828152600260205260409020600101546001600160a01b031633146100c85760405163b643ca7b60e01b815260040160405180910390fd5b60008281526002602052604090206004015460ff16156100fb576040516320e051b160e11b815260040160405180910390fd5b600082815260026020526040902060040154610100900460ff161561013357604051633c2c4dd160e01b815260040160405180910390fd5b604080516000808252602082018490529184917f06a34b85ea121af9f8ea46810c1d9183473c64d091c63c67d0e74c71fbeabef8910160405180910390a250506000908152600260205260409020600401805461ff001916610100179055565b6002600054036101e95760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640160405180910390fd5b6002600081815582815260209190915260409020546001600160a01b031633146102265760405163b643ca7b60e01b815260040160405180910390fd5b60008181526002602052604090206004015460ff1615610259576040516320e051b160e11b815260040160405180910390fd5b600081815260026020526040902060040154610100900460ff161561029157604051633c2c4dd160e01b815260040160405180910390fd5b6000818152600260205260408082206003015490513391908381818185875af1925050503d80600081146102e1576040519150601f19603f3d011682016040523d82523d6000602084013e6102e6565b606091505b5050905080610308576040516307a4ced160e51b815260040160405180910390fd5b60405182907faf7583fc53c710c886c2d2092e3c5531e16142a4ca1e89c557f30ca3ed93c0f890600090a2506000908152600260205260408120600401805460ff191660019081179091559055565b6040805160c081018252338082526001600160a01b0385811660208085018281528784168688018181523460608901818152600060808b0181815260a08c018281526001805484526002808b52938f90209d518e54908d166001600160a01b0319918216178f5598518e82018054918e16918b169190911790559551928d01805493909b1692909716919091179098555160038a0155955160049098018054935115156101000261ff00199915159990991661ffff199094169390931797909717909155945486519586529085019290925293919290917f1080878d736b23d90037c882a67e83d2f39a3327bef9393126d07f12ff3e1a12910160405180910390a460018054906000610469836104fc565b91905055505050565b6000806040838503121561048557600080fd5b50508035926020909101359150565b6000602082840312156104a657600080fd5b5035919050565b80356001600160a01b03811681146104c457600080fd5b919050565b600080604083850312156104dc57600080fd5b6104e5836104ad565b91506104f3602084016104ad565b90509250929050565b60006001820161051c57634e487b7160e01b600052601160045260246000fd5b506001019056fea164736f6c634300080d000a";

type ERC721VoucherConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721VoucherConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721Voucher__factory extends ContractFactory {
  constructor(...args: ERC721VoucherConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC721Voucher> {
    return super.deploy(overrides || {}) as Promise<ERC721Voucher>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERC721Voucher {
    return super.attach(address) as ERC721Voucher;
  }
  override connect(signer: Signer): ERC721Voucher__factory {
    return super.connect(signer) as ERC721Voucher__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721VoucherInterface {
    return new utils.Interface(_abi) as ERC721VoucherInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC721Voucher {
    return new Contract(address, _abi, signerOrProvider) as ERC721Voucher;
  }
}
