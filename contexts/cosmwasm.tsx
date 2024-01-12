import {
  useState,
  useEffect,
  // useCallback,
  createContext,
  useContext,
} from "react";
// import { GasPrice } from "@cosmjs/stargate";
import { JsonObject } from "@cosmjs/cosmwasm-stargate";
import { useChain, useWalletClient } from "@cosmos-kit/react";
// import axios from "axios";
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

// const toQueryMsg = (msg: string) => {
//   try {
//     return JSON.stringify(JSON.parse(msg));
//   } catch (error) {
//     return "";
//   }
// };

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
    connect,
    // status,
    // wallet,
    // disconnect,
    // username,
    // getRpcEndpoint,
  } = useChain(chainName);
  // const { client } = useWalletClient();

  const connectWallet = async () => {
    if (address) {
      // const signingClient = await getSigningCosmWasmClient();
      // let rpcEndpoint = ""; //await getRpcEndpoint();

      // if (!rpcEndpoint) {
      //   console.info("no rpc endpoint — using a fallback");
      //   rpcEndpoint = `https://rpc.testnet.osmosis.zone/`;
      // }
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
        // console.log(result?.transactionHash);
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
        // console.log("3333333333: ", balanceList);
        setBalances(balanceList);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const buy = async (sender: string, Amount: any, ref: any) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.MINER_CONTRACT,
        {
          buy: {
            amount: convertDenomToMicroDenom(Amount)
          },
        },
        defaultFee,
        undefined,
        [{ denom: "usei", amount: convertDenomToMicroDenom(Amount) }]
      );

      const Result1: any = await signingClient.execute(
        sender,
        config.MINER_CONTRACT,
        {
          hatch: {
            referrer: ref
          },
        },
        defaultFee,
      );
      // console.log(result?.transactionHash);
      // setPending(false);
      // updateBalance();
      // console.log('1111111111 :', result)
      if (result.transactionHash && Result1.transactionHash) {
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

  const sell = async (sender: string) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.MINER_CONTRACT,
        {
          sell: {},
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

  const hatch = async (sender: string, ref: any) => {
    const signingClient = await getSigningCosmWasmClient();
    if (!signingClient) return null;
    setPending(true);
    try {
      const result: any = await signingClient.execute(
        sender,
        config.MINER_CONTRACT,
        {
          hatch: {
            referrer: ref
          },
        },
        defaultFee,
      );
      // console.log('hatch return is: ', result)
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
    if (!client)
      return -1;
    try {
      const stateData = await client.queryContractSmart(config.MINER_CONTRACT, {
        staking: {
          address: address
        },
      });
      if (stateData === null) return null;
      // console.log("getUserData in Web3>>>>: ", stateData);

      const globalData = await getGlobalStateData()
      if (globalData === null) return null;
      // console.log('globalStateData Cosmwasm File >>> ', globalData);
      
      // getOrangesSinceLastHatch
      // console.log('Date.now() is: ', Date.now() / 1000);
      // console.log('Number(stateData.last_hatch_time) is: ', Number(stateData.last_hatch_time));
      let secondsPassed = Math.min(Number(globalData.per_miner), Date.now() / 1000 - Number(stateData.last_hatch_time));
      // console.log('secondsPassed =', secondsPassed);
      // console.log('Number(stateData.claimed) =', Number(stateData.claimed));
      // console.log('stateData =', stateData);
      // console.log('stateData.user =', address);
      // console.log('stateData.miners =', stateData.miners);
      // console.log('new BigNumber(secondsPassed) * Number(stateData.miners)  = ', new BigNumber(secondsPassed).multipliedBy(stateData.miners).toString());
      // let myBananas = Number(stateData.claimed) + Number(secondsPassed) * Number(stateData.miners);
      let myBananas = new BigNumber(stateData.claimed).plus(new BigNumber(secondsPassed).multipliedBy(new BigNumber(stateData.miners)));
      // console.log('myBananas is: ', myBananas?.toString());
      // console.log('globalData.marketOranges =', Number(globalData.market));
      const factory: JsonObject = await client?.getBalance(
        config.MINER_CONTRACT,
        defaultDenom
      );
      // console.log('factory amount is: ', factory)
      const vaultBal = factory.amount;
      // updateBalance()
      // const vaultBal = balances[minerContract];

      // console.log('vaultBal is: ', vaultBal);
      
      let beanRewards = calculateTrade(myBananas, globalData.market, new BigNumber(vaultBal), globalData.psn, globalData.psnh);

      return {
        miners: stateData.miners,
        beanRewards: convertMicroDenomToDenom(beanRewards)
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
    let PSN2 = new BigNumber(PSN);
    let PSNH2 = new BigNumber(PSNH);
    let rs2 = new BigNumber(rs);
    let rt2 = new BigNumber(rt);
    let y = PSN2.plus(PSN2.multipliedBy(rs2).plus(PSNH2.multipliedBy(rt2))).dividedBy(rt2);
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
        buy,
        sell,
        hatch,
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
