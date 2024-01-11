/**
 * remark: This is an example config file for a terra testnet chain and it should be deleted before merging.
 */
import type { Chain, AssetList } from "@chain-registry/types";
const testnet = true;
// const testnet = process.env.NEXT_PUBLIC_TESTNET;

export const seiNetwork: Chain = {

  chain_name: testnet ? "seitestnet" : "sei",
  status: "live",
  network_type: testnet ? "testnet" : "mainnet",
  pretty_name: testnet ? "Sei Atlantic" : "Sei",
  chain_id: testnet ? "atlantic-2" : "pacific-1",
  bech32_prefix: "sei",
  daemon_name: "seid",
  node_home: "$HOME/.sei",
  slip44: 118,
  fees: testnet ? {
    fee_tokens: [
      {
        denom: "usei",
        fixed_min_gas_price: 0,
        low_gas_price: 0.15,
        average_gas_price: 0.15,
        high_gas_price: 0.15,
      },
    ],
  } : {
    fee_tokens: [
      {
        denom: "usei",
        fixed_min_gas_price: 0.1,
        low_gas_price: 0.25,
        average_gas_price: 0.25,
        high_gas_price: 0.25,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: "usei",
      },
    ],
  },
  apis: testnet ? {
    rpc: [
      {
        address: "https://rpc.atlantic-2.seinetwork.io/",
      },
    ],
    rest: [
      {
        address: "https://rpc.atlantic-2.seinetwork.io/",
      },
    ],
    grpc: [
      {
        address: "",
      },
    ],
  } : {
    rpc: [
      {
        address: "https://sei-rpc.brocha.in/",
      },
    ],
    rest: [
      {
        address: "https://sei-rest.brocha.in/",
      },
    ],
    grpc: [
      {
        address: "https://sei-grpc.lavenderfive.com/"
      },
    ],
  },
  keywords: ["dex", "testnet"],
};

export const seiNetworkAssets: AssetList = {
  chain_name: testnet ? "seitestnet" : "sei",
  assets: [
    {
      description: "The native token of Sei",
      denom_units: [
        {
          denom: "usei",
          exponent: 0,
          aliases: [],
        },
      ],
      base: "usei",
      name: "Sei",
      display: "SEI",
      symbol: "SEI",
      keywords: ["staking"],
    },
  ],
};