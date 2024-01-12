import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as compassWallet } from "@cosmos-kit/compass";
import { Chain } from "@chain-registry/types";
import { GasPrice } from "@cosmjs/stargate";
import { Decimal } from "@cosmjs/math";

import { TailwindModal } from "../components";
import { ThemeProvider } from "../contexts/theme";
import { SigningCosmWasmProvider } from "../contexts/cosmwasm";

import { SignerOptions } from "@cosmos-kit/core";
import { chains, assets } from "chain-registry";
import { ToastContainer } from "react-toastify";
import { seiNetwork, seiNetworkAssets } from "../config/seiconfig";
import "react-toastify/dist/ReactToastify.css";

const testnet = true;
// const testnet = process.env.NEXT_PUBLIC_TESTNET;

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  const signerOptions: SignerOptions = {
    signingCosmwasm: (chain: Chain) => {
      // console.log("chain >>> ", chain);
      switch (chain.chain_name) {
        case "seitestnet":
          return {
            gasPrice: new GasPrice(Decimal.zero(1), "usei"),
          };
        case "sei":
          return {
            gasPrice: new GasPrice(Decimal.zero(1), "usei"),
          };
        default:
          return void 0;
      }
    },
  };

  return (
    <ChainProvider
      chains={[...chains, seiNetwork]}
      assetLists={[...assets, seiNetworkAssets]}
      wallets={[...keplrWallets, ...compassWallet as any, ...cosmostationWallets, ...leapWallets]}
      walletConnectOptions={{
        signClient: {
          projectId: "a8510432ebb71e6948cfd6cde54b70f7",
          relayUrl: "wss://relay.walletconnect.org",
          metadata: {
            name: "CosmosKit Template",
            description: "CosmosKit dapp template",
            url: "https://docs.cosmoskit.com/",
            icons: [],
          },
        },
      }}
      endpointOptions={{
        endpoints: testnet ? {
          seitestnet: {
            rpc: ["https://rpc.atlantic-2.seinetwork.io/"],
            rest: ["https://sei-testnet-rest.brocha.in/"],
          }
        } : {
          sei: {
            rpc: ["https://sei-rpc.brocha.in/"],
            rest: ["https://sei-rest.brocha.in/"],
          }
        }
      }}
      signerOptions={signerOptions}
      walletModal={TailwindModal}
    >
      <SigningCosmWasmProvider>
        <ThemeProvider>
          <div className="min-h-screen text-black bg-white dark:bg-gray-bg dark:text-white py-10 "
            style={{
              backgroundImage: `url("/background.svg")`,
              width: '100%',
              height: '100%',
            }}
          >
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
        <ToastContainer pauseOnFocusLoss={true} position="bottom-left" autoClose={3000} toastClassName={'toast-theme'} />
      </SigningCosmWasmProvider>
    </ChainProvider>
  );
}

export default CreateCosmosApp;
