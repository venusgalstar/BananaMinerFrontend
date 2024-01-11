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
import { config, chainName, defaultDenom, minerContract } from "../config";
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from "../utils/utils";
import { toast } from "react-toastify"
import { BigNumber } from "bignumber.js";

const defaultFee = {
  amount: [],
  gas: "1000000",
};

// const AIRDROP_STAGE = 3;
const CosmwasmContext = createContext({});
export const useSigningClient = () => useContext(CosmwasmContext);

const toQueryMsg = (msg: string) => {
  try {
    return JSON.stringify(JSON.parse(msg));
  } catch (error) {
    return "";
  }
};


// const getURL = (contract: any, msg: string, baseUrl = "") => {
//   const lcd = "https://lcd.testnet.osmosis.zone/";
//   const query_msg =
//     typeof msg === "string" ? toQueryMsg(msg) : JSON.stringify(msg);
//   return `${baseUrl || lcd
//     }/cosmwasm/wasm/v1/contract/${contract}/smart/${window.btoa(query_msg)}`;
// };

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
      await connect();
    }
  };


  const startMining = async (sender: string) => {
    try {
      const signingClient = await getSigningCosmWasmClient();
      if (address) {
        setPending(true);
        const result: any = await signingClient.execute(
          sender,
          config.MINER_CONTRACT,
          {
            start_mine: {},
          },
          defaultFee,
        );
        console.log(result?.transactionHash);
        setPending(false);
        updateBalance();
        return result?.transactionHash;
      }
    } catch (err) {
      setPending(false);
      console.error(err);
    }
  }

  // const initialize = async (sender: string) => {
  //   try {
  //     const signingClient = await getSigningCosmWasmClient();
  //     if (address) {
  //       setPending(true);
  //       const result: any = await signingClient.execute(
  //         sender,
  //         config.MINER_CONTRACT,
  //         {
  //           start_mine: {},
  //         },
  //         defaultFee,
  //       );
  //       console.log(result?.transactionHash);
  //       setPending(false);
  //       updateBalance();
  //       return result?.transactionHash;
  //     }
  //   } catch (err) {
  //     setPending(false);
  //     console.error(err);
  //   }
  // }

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
            // address,
            config.MINER_CONTRACT,
            defaultDenom
          );
          // console.log('factory amount is: ', native)
          // console.log('factory amount is: ', factory)
          balanceList[minerContract] = convertMicroDenomToDenom(factory.amount);
        }
        console.log("3333333333: ", balanceList);
        setBalances(balanceList);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const buyBananas = async (sender: string, seiAmount: any) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.MINER_CONTRACT,
        {
          buy_bananas: {
            sei_amount: convertDenomToMicroDenom(seiAmount)
          },
        },
        defaultFee,
        undefined,
        [{ denom: "usei", amount: convertDenomToMicroDenom(seiAmount) }]
      );
      // console.log(result?.transactionHash);
      // setPending(false);
      // updateBalance();
      // console.log('1111111111 :', result)
      if (result.transactionHash) {
        updateBalance();
        toast.success('Buy Banana is successfully');
        // return result?.transactionHash;
      } else {
        toast.error('Buy Banana is failed')
      }
      setPending(false);
    } catch (err) {
      setPending(false);
      console.log(err);
      toast.error('Something went wrong.')
      throw err;
    }
  };

  const sellBananas = async (sender: string) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.MINER_CONTRACT,
        {
          sell_bananas: {},
        },
        defaultFee,
      );
      // console.log(result?.transactionHash);
      if (result.transactionHash) {
        updateBalance();
        toast.success('Claim Rewards is successfully');
        // return result?.transactionHash;
      } else {
        toast.error('Claim Rewards is failed')
      }
      setPending(false);
    } catch (err) {
      setPending(false);
      console.log(err);
      toast.error('Something went wrong.')
      throw err;
    }
  };

  const hatchEggs = async (sender: string, ref: any) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.MINER_CONTRACT,
        {
          hatch_bananas: {
            referrer: ref
          },
        },
        defaultFee,
      );
      console.log('hatchBananas return is: ', result)
      if (result.transactionHash) {
        updateBalance();
        toast.success('Compound Banana is successfully');
        // return result?.transactionHash;
      } else {
        toast.error('Compound Banana is failed')
      }
    } catch (err) {
      setPending(false);
      toast.error('Someting went wrong')
      console.log(err);
      throw err;
    }
  };

  const getGlobalStateData = async () => {
    const client = await getCosmWasmClient();
    // console.log('11111111111', client);
    if (!client) return -1;
    try {
      const response = await client.queryContractSmart(config.MINER_CONTRACT, {
        config: {},
      });
      // console.log("GlobalStateData >>>>: ", response);
      return response;
    } catch (err) {
      console.log(err);
    }
    return -1;
  };

  const getUserData = async () => {
    const client = await getCosmWasmClient();
    // console.log('client is: ', client)
    if (!client)
      return -1;
    try {
      const stateData = await client.queryContractSmart(config.MINER_CONTRACT, {
        staking: {
          address: address
        },
      });
      if (stateData === null) return null;
      // console.log("getUserData >>>>: ", stateData);

      // const globalData = await client.queryContractSmart(config.MINER_CONTRACT, {
      //   config: {},
      // });
      const globalData = await getGlobalStateData()
      if (globalData === null) return null;
      console.log('globalStateData Cosmwasm File >>> ', globalData);
      
      // getOrangesSinceLastHatch
      let secondsPassed = Math.min(Number(globalData.bananas_per_miner), Date.now() / 1000 - Number(stateData.last_hatch_time));
      // console.log('secondsPassed =', secondsPassed);
      // console.log('Number(stateData.claimed_bananas) =', Number(stateData.claimed_bananas));
      // console.log('stateData =', stateData);
      // console.log('stateData.user =', address);
      // console.log('stateData.miners =', stateData.miners);
      // console.log('Number(secondsPassed) * Number(stateData.miners)  = ', Number(secondsPassed) * Number(stateData.miners) );
      let myBananas = Number(stateData.claimed_bananas) + Number(secondsPassed) * Number(stateData.miners);
      // console.log('myBananas is: ', myBananas);
      // console.log('globalData.marketOranges =', Number(globalData.market_bananas));
      const factory: JsonObject = await client?.getBalance(
        address,
        config.MINER_CONTRACT,
      );
      // console.log('factory amount is: ', factory)
      const vaultBal = factory.amount;
      // updateBalance()
      // const vaultBal = balances[minerContract];
      // console.log('aaaaaaaaaa', vaultBal);
      // console.log('new BN(vaultBal) =', new BigNumber(vaultBal));
      let beanRewards = calculateTrade(myBananas, globalData.market_bananas, new BigNumber(vaultBal), globalData.psn, globalData.psnh);

      return {
        miners: stateData.miners,
        beanRewards: beanRewards.toString()
        // referrer: stateData.referrer
      }
    } catch (err) {
      console.log(err);
    }
    return false;
  };

  function calculateTrade(rt, rs, bs, PSN, PSNH) {
    if (Number(rt) === 0) return 0;
    // console.log('calcTrade');
    // console.log(rt.toString());
    // console.log(rs.toString());
    // console.log(bs.toString());
    // console.log(PSN.toString());
    // console.log(PSNH.toString());
    let x = new BigNumber(PSN).multipliedBy(bs);
    let y = new BigNumber(PSNH).plus(new BigNumber(PSN).multipliedBy(rs)).plus(new BigNumber(PSNH).multipliedBy(rt).dividedBy(rt));
    // console.log('calcTrade');
    // console.log(x.toString());
    // console.log(y.toString());
    return x.dividedBy(y);
  }

  useEffect(() => {
    if (address) {
      let localAddress = localStorage.getItem("address");
      if (address !== localAddress) connectWallet();
    }
  }, [address]);

  useEffect(() => {
    localStorage.setItem("address", "");
  }, [])

  return (
    <CosmwasmContext.Provider
      value={{
        pending,
        address,
        balances,
        // wallet,
        connectWallet,
        updateBalance,
        buyBananas,
        sellBananas,
        hatchEggs,
        startMining,
        getGlobalStateData,
        getUserData,
        // initialize
      }}
    >
      {children}
    </CosmwasmContext.Provider>
  );
};
