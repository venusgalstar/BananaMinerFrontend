import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { GasPrice } from "@cosmjs/stargate";
import { JsonObject } from "@cosmjs/cosmwasm-stargate";
import { useChain, useWalletClient } from "@cosmos-kit/react";
import axios from "axios";
import { config, chainName, defaultDenom } from "../config";
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from "../utils/utils";
import {
  pinURLToIPFS,
  pinFileToIPFS,
  pinJSONToIPFS,
} from "../config/pinatasdk";

const defaultFee = {
  amount: [],
  gas: "1000000",
};

const CW20_DECIMAL = 10 ** 6;
const AIRDROP_STAGE = 3;
const CosmwasmContext = createContext({});
export const useSigningClient = () => useContext(CosmwasmContext);

const toQueryMsg = (msg) => {
  try {
    return JSON.stringify(JSON.parse(msg));
  } catch (error) {
    return "";
  }
};

const getURL = (contract, msg, baseUrl = "") => {
  const lcd = "https://lcd.testnet.osmosis.zone/";
  const query_msg =
    typeof msg === "string" ? toQueryMsg(msg) : JSON.stringify(msg);
  return `${baseUrl || lcd
    }/cosmwasm/wasm/v1/contract/${contract}/smart/${window.btoa(query_msg)}`;
};

export const SigningCosmWasmProvider = ({ children }: any) => {
  const [pending, setPending] = useState(false);
  const [balances, setBalances] = useState({});

  const {
    getSigningCosmWasmClient,
    getCosmWasmClient,
    address,
    status,
    wallet,
    connect,
    disconnect,
    username,
    getRpcEndpoint,
  } = useChain(chainName);
  const { client } = useWalletClient();

  const connectWallet = async () => {
    if (address) {
      const signingClient = await getSigningCosmWasmClient();
      let rpcEndpoint = ""; //await getRpcEndpoint();

      if (!rpcEndpoint) {
        console.info("no rpc endpoint — using a fallback");
        rpcEndpoint = `https://rpc.testnet.osmosis.zone/`;
      }

      updateBalance();
    } else {
      // await connect();
    }
  };

  const updateBalance = async () => {
    try {
      const signingClient = await getSigningCosmWasmClient();
      if (address) {
        const balanceList = {};
        const native: JsonObject = await signingClient?.getBalance(
          address,
          defaultDenom
        );

        if (native) {
          balanceList[native.denom] = convertMicroDenomToDenom(native.amount);
        }
        if (signingClient) {
          const factory: JsonObject = await signingClient?.getBalance(
            address,
            config.FACTORY_TOKEN
          );
          balanceList[config.FACTORY_TOKEN] = convertMicroDenomToDenom(factory.amount, 0);
        }
        console.log(">>>>", balanceList);
        setBalances(balanceList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const buyToken = async (sender, osmoAmount) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.BONDING_CONTRACT,
        {
          buy: {},
        },
        defaultFee,
        undefined,
        [{ denom: "uosmo", amount: osmoAmount }]
      );
      console.log(result?.transactionHash);
      setPending(false);
      return result?.transactionHash;
    } catch (err) {
      setPending(false);
      console.log(err);
      throw err;
    }
  };

  const burnToken = async (sender, amount) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.FACTORY_TOKEN,
        {
          burn: {
            amount: amount.toString(),
            refund: false,
          },
        },
        defaultFee
      );
      console.log(result?.transactionHash);
      setPending(false);
      return result?.transactionHash;
    } catch (err) {
      setPending(false);
      console.log(err);
      throw err;
    }
  };

  const getMerkleRoot = async () => {
    const client = await getCosmWasmClient();
    if (!client) return null;
    try {
      const response = await client.queryContractSmart(config.AIRDROP_CONTRACT, {
        merkle_root: { stage: AIRDROP_STAGE },
      });

      return response;
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  const isClaimed = async (address: string) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    try {
      const response = await signingClient.queryContractSmart(
        config.AIRDROP_CONTRACT,
        {
          is_claimed: { stage: AIRDROP_STAGE, address },
        }
      );

      return response;
    } catch (err) {
      console.log(err);
    }
    return null;
  };
  
  const getClaimInfo = async (address: string) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    try {
      const response = await signingClient.queryContractSmart(
        config.AIRDROP_CONTRACT,
        {
          claim_info: { address },
        }
      );

      return response;
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  const getTokenCurveInfo = async () => {
    const client = await getCosmWasmClient();
    if (!client) return null;
    try {
      const response = await client.queryContractSmart(config.BONDING_CONTRACT, {
        curve_info: {},
      });

      return response;
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  const getNFTStock = async () => {
    const client = await getCosmWasmClient();
    if (!client) return -1;
    try {
      const response = await client.queryContractSmart(config.CW721_CONTRACT, {
        num_tokens: {},
      });
      console.log(">>>", response);
      return response.count;
    } catch (err) {
      console.log(err);
    }
    return -1;
  };

  const claimAirdrop = async (sender, proof) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.AIRDROP_CONTRACT,
        {
          claim: {
            stage: AIRDROP_STAGE,
            amount: "1",
            proof,
          },
        },
        defaultFee
      );
      console.log(result?.transactionHash);
      setPending(false);
      return result?.transactionHash;
    } catch (err) {
      setPending(false);
      throw err;
    }
  };

  const mintNFT = async (path, size, sender) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    console.log(path, size, sender);
    let uriHash = "";
    try {
      const fileHash = await pinURLToIPFS(path);
      console.log(">>> File Hash >>>", fileHash);
      if (!fileHash) {
        setPending(false);
        return;
      }
      const metadata = {
        name: "Shirtdrop",
        description: "Suitdrop NFT for Shirtdrop",
        image: `ipfs://${fileHash}`,
        size,
      };
      uriHash = await pinJSONToIPFS(metadata);
      console.log(">>> URI Hash >>>", uriHash);
    } catch (err) {
      setPending(false);
      throw err;
    }

    try {
      const result: any = await signingClient.execute(
        sender,
        config.REDEEM_CONTRACT,
        {
          mint: {
            uri: uriHash,
          },
        },
        defaultFee
      );
      console.log(result?.transactionHash);
      setPending(false);
      return result?.transactionHash;
    } catch (err) {
      console.log(err);
      setPending(false);
      throw err;
    }
  };

  const redeem = async (sender) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.REDEEM_CONTRACT,
        {
          redeem: {
            proof: "redeem/" + sender,
          },
        },
        defaultFee,
        undefined,
        [{ denom: config.FACTORY_TOKEN, amount: "1" }]
      );
      console.log(result?.transactionHash);
      setPending(false);
      return result?.transactionHash;
    } catch (err) {
      console.log(err);
      setPending(false);
      throw err;
    }
  }

  useEffect(() => {
    connectWallet();
  }, [address]);

  return (
    <CosmwasmContext.Provider
      value={{
        pending,
        address,
        balances,
        connectWallet,
        updateBalance,
        buyToken,
        burnToken,
        claimAirdrop,
        mintNFT,
        redeem,
        isClaimed,

        getMerkleRoot,
        getTokenCurveInfo,
        getClaimInfo,
        getNFTStock,
      }}
    >
      {children}
    </CosmwasmContext.Provider>
  );
};
