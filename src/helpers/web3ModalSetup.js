import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

/**
  Web3 modal helps us "connect" external wallets:
**/
const web3ModalSetup = () =>
  new Web3Modal({
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            // 97: "https://data-seed-prebsc-1-s1.binance.org:8545/", // avax
             56: "https://bsc-dataseed.binance.org",
             //4002: "https://rpc.testnet.fantom.network/",
          },
        },
      },
    },
  });

export default web3ModalSetup;
