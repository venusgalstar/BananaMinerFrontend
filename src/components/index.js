import { useCallback, useEffect, useState } from "react";
import web3ModalSetup from "./../helpers/web3ModalSetup";
import Web3 from "web3";
import getAbi from "../Abi";
import getTokenAbi from "../tokenAbi";
import logo from "./../assets/logo.png";
import logoMobile from "./../assets/logo-mobile.png";
// import music from "./../assets/bg_music.mp3";


const web3Modal = web3ModalSetup();
console.log("web3Modal: ", web3Modal);

const Interface = () => {
    const contractAddress = '0x95460ebd8dE70E49dc9F8daF7DBa0144C9B8DdC0';
    let isMobile = window.matchMedia("only screen and (max-width: 900px)").matches;

    const [Abi, setAbi] = useState();
    const [tokenAbi, setTokenAbi] = useState();
    const [web3, setWeb3] = useState();
    const [isConnected, setIsConnected] = useState(false);
    const [injectedProvider, setInjectedProvider] = useState();
    const [refetch, setRefetch] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [current, setCurrent] = useState(null);
    const [connButtonText, setConnButtonText] = useState("CONNECT");
    const [refLink, setRefLink] = useState(
        "https://deposit.atom-miner.com/?ref=0x0000000000000000000000000000000000000000"
      );
    const [contractBalance, setContractBalance] = useState(0);
    const [userBalance,setUserBalance] = useState(0);
    const [userApprovedAmount,setUserApprovedAmount] = useState(0);
    const [userInvestment,setUserInvestment] = useState(0);
    const [userDailyRoi, setUserDailyRoi] = useState(0);
    const [dailyReward,setDailyReward] = useState(0);
    const [startTime,setClaimStartTime] = useState(0);
    const [deadline,setClaimDeadline] = useState(0);
    const [approvedWithdraw,setApprovedWithdraw] = useState(0);
    const [lastWithdraw,setLastWithdraw] = useState(0);
    const [nextWithdraw, setNextWithdraw] = useState(0);
    const [totalWithdraw,setTotalWithdraw] = useState(0);
    const [referralReward,setReferralReward] = useState(0);
    const [refTotalWithdraw, setRefTotalWithdraw] = useState(0);
    const [jackpotData, setJackpotData] = useState([]);
    const [value, setValue] = useState('');
    const [balance,setBalance] = useState(0);

    const [pendingMessage,setPendingMessage] = useState('');
    const [calculate,setCalculator] = useState('');

    // const [playing, toggle] = useAudio(music);
    
    const queryParams = new URLSearchParams(window.location.search);
    let testLink = queryParams.get("ref");
    
    if (testLink === null) {
      testLink = "0x0f04abd6163482e91bc70ebbaa33fbefd90b82cd";
      // testLink = "0x0f04abd6163482e91bc70ebbaa33fbefd90b82cd";
    }

    const logoutOfWeb3Modal = async () => {
        await web3Modal.clearCachedProvider();
        if (
          injectedProvider &&
          injectedProvider.provider &&
          typeof injectedProvider.provider.disconnect == "function"
        ) {
          await injectedProvider.provider.disconnect();
        }
        setIsConnected(false);
    
        window.location.reload();
      };
      const loadWeb3Modal = useCallback(async () => {
        console.log("Connecting Wallet...");
        const provider = await web3Modal.connect();
        console.log("provider: ", provider);
        setInjectedProvider(new Web3(provider));
        const acc = provider.selectedAddress
          ? provider.selectedAddress
          : provider.accounts[0];

        
        const short = shortenAddr(acc);
    
        setWeb3(new Web3(provider));
        setAbi(await getAbi(new Web3(provider)));
        setTokenAbi(await getTokenAbi(new Web3(provider)));
        setAccounts([acc]);
        setCurrent(acc);
        //     setShorttened(short);
        setIsConnected(true);
        
        setConnButtonText(short);
    
        provider.on("chainChanged", (chainId) => {
          console.log(`chain changed to ${chainId}! updating providers`);
          setInjectedProvider(new Web3(provider));
        });
    
        provider.on("accountsChanged", () => {
          console.log(`account changed!`);
          setInjectedProvider(new Web3(provider));
        });
    
        // Subscribe to session disconnection
        provider.on("disconnect", (code, reason) => {
          console.log(code, reason);
          logoutOfWeb3Modal();
        });
        // eslint-disable-next-line
      }, [setInjectedProvider]);

      useEffect(() => {
        setInterval(() => {
          setRefetch((prevRefetch) => {
            return !prevRefetch;
          });
        }, 10000);
      }, []);
    
      useEffect(() => {
        if (web3Modal.cachedProvider) {
          loadWeb3Modal();
        }

        // eslint-disable-next-line
      }, []);

      const shortenAddr = (addr) => {
        if (!addr) return "";
        const first = addr.substr(0, 3);
        const last = addr.substr(38, 41);
        return first + "..." + last;
      };
    
      useEffect(() => {
        const refData = async () => {
          if (isConnected && web3) {
            // now the referal link not showing
            const balance = await web3.eth.getBalance(current);
    
            const refLink = "https://deposit.atom-miner.com/?ref=" + current;
            setRefLink(refLink);
            setBalance(web3.utils.fromWei(balance));
          }
        };
    
        refData();
      }, [isConnected, current, web3, refetch]);

     
   


      useEffect(() => {
        const AbiContract = async () => {
          if (!isConnected || !web3) return;
          const contractBalance = await Abi.methods.getBalance().call();
         
         setContractBalance(contractBalance / 10e17);
        };
    
        AbiContract();
      }, [isConnected, web3, Abi, refetch]);


      useEffect(() => {
        const Contract = async () => {
          if (isConnected && Abi) {
            console.log(current);

          // let userBalance = await web3.eth.getBalance(current);
          let userBalance = await tokenAbi.methods.balanceOf(current).call();
          setUserBalance(userBalance);

          let approvedAmount = await tokenAbi.methods.allowance(current, contractAddress).call();
          console.log("approvedAmount: ", approvedAmount);
          setUserApprovedAmount(approvedAmount);

          let userInvestment = await Abi.methods.investments(current).call();
          setUserInvestment(userInvestment.invested / 10e17);

          let dailyRoi = await Abi.methods.DailyRoi(userInvestment.invested).call();
          setUserDailyRoi(dailyRoi / 10e17);

          let dailyReward = await Abi.methods.userReward(current).call();
            setDailyReward(dailyReward / 10e17);
          }

          // let owner = await Abi.methods.owner().call();

          // console.log('Owner: ', owner);
        };
    
        Contract();
        // eslint-disable-next-line
      }, [refetch]);

      useEffect(() => {
        const Withdrawlconsole = async () => {
          if(isConnected && Abi) {
          let approvedWithdraw = await Abi.methods.approvedWithdrawal(current).call();
          setApprovedWithdraw(approvedWithdraw.amount / 10e17);

          let totalWithdraw = await Abi.methods.totalWithdraw(current).call();
          setTotalWithdraw(totalWithdraw.amount / 10e17);
        }
        }
        Withdrawlconsole();
        // eslint-disable-next-line
      },[refetch]);

      useEffect(() => {
        const TimeLine = async () => {
          if(isConnected && Abi) {
          let claimTime = await Abi.methods.claimTime(current).call();
          if(claimTime.startTime > 0) {
          let _claimStart = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(claimTime.startTime + "000");
          let _claimEnd = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(claimTime.deadline + "000");
          setClaimStartTime(_claimStart);

          setClaimDeadline(_claimEnd);

          let weekly = await Abi.methods.weekly(current).call();
          let _start = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(weekly.startTime + "000");
          let _end = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(weekly.deadline + "000");

          setLastWithdraw(_start);
          setNextWithdraw(_end);
        }
        }
        }
        TimeLine();
        // eslint-disable-next-line
      },[refetch]);


      useEffect(() => {
        const ContractReward = async () => {
          if (isConnected && Abi) {
        

          let refEarnedWithdraw = await Abi.methods.referral(current).call();
          setReferralReward(refEarnedWithdraw.reward / 10e17);

          let refTotalWithdraw = await Abi.methods.refTotalWithdraw(current).call();
          setRefTotalWithdraw(refTotalWithdraw.totalWithdraw / 10e17);


          }
        };
    
        ContractReward();
        // eslint-disable-next-line
      }, [refetch]);

      useEffect(() => {
        const Jackpot = async () => {
          if (isConnected && Abi) {
        
            let jackpotData = await Abi.methods.jackpot().call();

            const winnerTime = Number(jackpotData[0]);
            const lastAddr = shortenAddr(jackpotData[1]);
            const lastAmount = jackpotData[2] / 10e17;
            const addr = shortenAddr(jackpotData[3]);
            const amount = jackpotData[4] / 10e17;

            const newData = [winnerTime, lastAddr, lastAmount, addr, amount];

            setJackpotData(newData);
          } else {
            const newData = ["0", "0x0...000", "0", "0x0...000", "0"];

            setJackpotData(newData);
          }
        };
    
        Jackpot();
        // eslint-disable-next-line
      }, [refetch]);
      
       // buttons

      const ClaimNow = async (e) => {
        e.preventDefault();
        if (isConnected && Abi) {
           console.log("success")
           setPendingMessage("Claiming Funds")
          await Abi.methods.claimDailyRewards().send({
            from: current,
          });
          setPendingMessage("Claimed Successfully");
         
        } else {
          console.log("connect wallet");
        }
      };

      const withDraw = async (e) => {
        e.preventDefault();
        if (isConnected && Abi) {
           console.log("success")
           setPendingMessage("Withdrawing funds")
          await Abi.methods.withdrawal().send({
            from: current,
          });
          setPendingMessage("Successfully Withdraw");
         
        } else {
          console.log("connect wallet");
        }
      };

      const refWithdraw = async (e) => {
        e.preventDefault();
        if (isConnected && Abi) {
           console.log("success")
           setPendingMessage("Rewards withdrawing")
          await Abi.methods.Ref_Withdraw().send({
            from: current,
          });
          setPendingMessage("Successfully Withdraw");
         
        } else {
          console.log("connect wallet");
        }
      };
      
      const closeBar = async (e) => {
        e.preventDefault();
        setPendingMessage('');
      } 

      const deposit = async (e) => {
        e.preventDefault();
        if (isConnected && Abi) {
          console.log("success")
          setPendingMessage("Deposit Pending...!")
          let _value = web3.utils.toWei(value);
          console.log("testLink: ", testLink);

          await Abi.methods.deposit(testLink, _value).send({
              from: current
          });
          setPendingMessage("Successfully Deposited")
        }
        else {
          console.log("connect wallet");
        }
      };

      const unStake = async (e) => {
        e.preventDefault();
        if(isConnected && Abi) {
          setPendingMessage("Unstaking");
          await Abi.methods.unStake().send({
            from: current,
          });
          setPendingMessage("UnStaked Successfully");
        }
        else {
          console.log("connect Wallet");
        }
      };
     
      const approve = async (e) => {
        e.preventDefault();
        if(isConnected && tokenAbi) {
          setPendingMessage("Approving");
          await tokenAbi.methods.approve(contractAddress,'15000000000000000000000').send({ // 100,000 ETH
            from: current,
          });
          setPendingMessage("Approved Successfully");
        } else {
          console.error("connect Wallet");
        }
      };
      // COUNT DOWN

  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const getCountdown = (deadline) => {
    const now = Date.now() / 1000;
    let total = deadline - now;
    if (total < 0) {
      total = 0;
    }
    const seconds = Math.floor((total) % 60);
    const minutes = Math.floor((total / 60) % 60);
    const hours = Math.floor((total / (60 * 60)) % 24);

    return {
        hours,
        minutes,
        seconds
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
        try {
          console.log(jackpotData[0]);
            const tillTime = 24 * 3600 + Number(jackpotData[0]);
            const data = getCountdown(tillTime);
            setCountdown({
                hours: data.hours,
                minutes: data.minutes,
                seconds: data.seconds
            })
        } catch (err) {
            console.log(err);
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [jackpotData[0]])


// RENDER

return( 
  <>
    <nav className="navbar navbar-expand-sm navbar-dark" style={{marginTop: "50px", marginBottom: "30px"}}>
      <div className="container" style={{justifyContent: isMobile ? 'space-around' : 'space-between'}}>
        <a className="navbar-brand" href="https://atom-miner.com"><img src={ isMobile? logoMobile : logo } alt="logo" className="img-fluid" style={{width:"200px", marginBottom: isMobile? '30px' : '0px'}} /></a>
        <button className="btn btn-primary btn-lg btnd btn-custom" onClick={loadWeb3Modal}><i className="fas fa-wallet"></i> {connButtonText}</button>
      </div>
    </nav>
    <br />
    <div className="container">
      {pendingMessage!==''? 
         <>
           <center><div className="alert alert-warning alert-dismissible">
         <p onClick={closeBar} className="badge bg-dark" style={{float:"right",cursor: "pointer"}}>X</p>
               {pendingMessage}</div></center>
          </> :

          <></>
         }
        
              <div className="row">
                 <div className="col-sm-3">
                   <div className="card">
                     <div className="card-body">
                   <center>  <h3 className="subtitle">CONTRACT BALANCE</h3>
                     
                     <h3 className="value-text">{Number(contractBalance).toFixed(2)} BUSD</h3>
                     
                     </center>
                     </div>
                   </div>
                 </div>

                 <div className="col-sm-3">
                   <div className="card">
                     <div className="card-body">
                   <center>  <h3 className="subtitle">DAILY ROI</h3>
                     
                     <h3 className="value-text">12%</h3>
                     
                     </center>
                     </div>
                   </div>
                 </div>


                 <div className="col-sm-3">
                   <div className="card">
                     <div className="card-body">
                   <center>  <h3 className="subtitle">WITHDRAWAL FEE</h3>
                     
                     <h3 className="value-text">8%</h3>
                     
                     </center>

                     </div>
                   </div>
                 </div>

                 <div className="col-sm-3">
                   <div className="card">
                     <div className="card-body">
                   <center>  <h3 className="subtitle">DEPOSIT FEE</h3>
                  
                  <h4 className="value-text">8%</h4>
                  
                  </center>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        <br /> <div className="container">
           <div className="row">
            

             <div className="col-sm-4">
           <div className="card cardDino">
            
             <div className="card-body">
             <h4 className="subtitle-normal"><b>MINING PORTAL</b></h4>
                <hr />
             <table className="table">
               <tbody>
               <tr>
                 <td><h5 className="content-text"><b>WALLET BALANCE</b></h5></td>
                 <td style={{textAlign:"right"}}><h5 className="value-text">{Number(userBalance / 10e17).toFixed(2)} BUSD</h5></td>
               </tr>

               <tr>
                 <td><h5 className="content-text"><b>DEPOSITED</b></h5></td>
                 <td style={{textAlign:"right"}}><h5 className="value-text">{Number(userInvestment).toFixed(2)} BUSD</h5></td>
               </tr>

               <tr>
                 <td><h5 className="content-text"><b>7x PROFIT</b></h5></td>
                 <td style={{textAlign:"right"}}><h5 className="value-text">{Number(userInvestment * 7).toFixed(2)} BUSD</h5></td>
               </tr>

               <tr>
                 <td><h5 className="content-text"><b>7x REMAINING</b></h5></td>
                 <td style={{textAlign:"right"}}><h5 className="value-text">{Number(userInvestment * 7 - totalWithdraw).toFixed(2)} BUSD</h5></td>
               </tr>

               <tr>
                 <td><h5 className="content-text"><b>DAILY USER ROI</b></h5></td>
                 <td style={{textAlign:"right"}}><h5 className="value-text">{Number(userDailyRoi).toFixed(2)} BUSD</h5></td>
               </tr>
               </tbody>
             </table>
           
            <form onSubmit={ userApprovedAmount > 0 ? deposit : approve}>
              <table className="table">
                <tbody>
                  <tr>
                    <td>  
                      <input
                        type="number"
                        placeholder="10 BUSD"
                        className="form-control input-box"
                        value={value}
                        step={10}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    </td>
                    <td style={{textAlign:"right"}}>
                      <button className="btn btn-primary btn-lg btn-custom"> { userApprovedAmount > 0 ? 'DEPOSIT' : 'APPROVE' }</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
             
            
        
          <center>
      <button className="btn btn-primary btn-lg btn-custom" style={{marginTop:"-10px"}} onClick={unStake}>UNSTAKE</button>
     
</center>
             </div>
             </div>
     
           </div>
           

             <div className="col-sm-4">
             <div className="card cardDino">
               <div className="card-body">
               <h4 className="subtitle-normal"><b>STATISTICS</b></h4>
                <hr />
               <table className="table">
                 <tbody>
               <tr>
                 <td><h6 className="content-text14" style={{lineHeight: "20px"}}><b>DAILY REWARDS</b> <br /> <span className="value-text">{Number(dailyReward).toFixed(3)}/{userDailyRoi} BUSD</span></h6></td>

                 <td style={{textAlign:"right"}}><button className="btn btn-primary btn-lg btn-custom" onClick={ClaimNow}>CLAIM</button></td>
               </tr>
               <tr>
                 <td><h6 className="content-text14" style={{lineHeight: "30px"}}><b>LAST CLAIM</b><br /><span className="value-text-12">{startTime}</span></h6></td>
                 
                 <td style={{textAlign:"right"}}><h6 className="content-text14" style={{lineHeight: "30px"}}><b>NEXT CLAIM</b><br /><span className="value-text-12">{deadline}</span></h6></td>
               </tr>

               <tr>
                 <td><h6 className="content-text14" style={{lineHeight: "20px"}}><b>50% AVAILABLE WITHDRAWAL</b> <br /><span className="value-text">{Number(approvedWithdraw).toFixed(3)} BUSD</span></h6></td>
                 <td style={{textAlign:"right"}}><button className="btn btn-primary btn-lg btn-custom"  onClick={withDraw}>WITHDRAW</button></td>
               </tr>

               <tr>
                 <td><h6 className="content-text14" style={{lineHeight: "30px"}}><b>LAST WITHDRAWAL</b><br /><span className="value-text-12">{lastWithdraw}</span></h6></td>
                 
                 <td style={{textAlign:"right"}} ><h6 className="content-text14" style={{lineHeight: "30px"}}><b>NEXT WITHDRAWAL</b><br /><span className="value-text-12">{nextWithdraw}</span></h6></td>
               </tr>

           
               <tr>
                 <td><h5 className="content-text">TOTAL WITHDRAWN</h5></td>
                 <td style={{textAlign:"right"}}><h5 className="value-text">{Number(totalWithdraw).toFixed(3)} BUSD</h5></td>
               </tr>

            </tbody>
             </table>
               </div>
             </div>
            </div>

            <div className="col-sm-4">
              <div className="card">
                <div className="card-body">
                <h4 className="subtitle-normal"><b>REFERRAL REWARDS  15%</b></h4>
                <hr />
                  <table className="table">
                    <tbody>
                    <tr>
                      <td><h5 className="content-text">BUSD REWARDS</h5></td>
                      <td style={{textAlign:"right"}}><h5 className="value-text">{Number(referralReward).toFixed(2)} BUSD</h5></td>
                    </tr>
                    <tr>
                      <td><h5 className="content-text">TOTAL WITHDRAWN</h5></td>
                      <td style={{textAlign:"right"}}><h5 className="value-text">{Number(refTotalWithdraw).toFixed(2)} BUSD</h5></td>
                    </tr>
                    </tbody>
                  </table>
                 <center> <button className="btn btn-primary btn-lg btn-custom" onClick={refWithdraw}>WITHDRAW REWARDS</button> </center>
                </div>
              </div>
              <br />
              <div className="card">
                <div className="card-body">
                <h4 className="subtitle-normal"><b>REFERRAL LINK</b></h4>
              <hr />
               <form>
                <span className="content-text13">Share your referral link to earn 15% of BUSD </span>
                <br />
                <br />
                 <input type="text" value={refLink} className="form-control input-box" readOnly />
            
               </form>
                 </div>
              </div>
            </div>
        
           </div>
        <br />
           <div className="row">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-header" style={{border: "none"}}>
                    <h3 className="subtitle-normal">10% DAILY JACKPOT</h3>
                    <h5 className="value-text-12" style={{lineHeight: "20px"}}>{`${countdown.hours}H ${countdown.minutes}M ${countdown.seconds}S`}</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-6">

                      <h3 className="subtitle-normal" style={{fontSize: "16px", lineHeight: "20px"}}>CURRENT WINNER</h3>

                        <table className="table">
                          <tbody>
                            <tr style={{border: "hidden"}}>
                              <td><h6 className="content-text14"><b>ADDRESS</b> <br /> <span className="value-text">{jackpotData[3]}</span></h6></td>
                              <td style={{textAlign:"right"}}><h6 className="content-text14"><b>DEPOSIT</b><br /><span className="value-text">{Number(jackpotData[4]).toFixed(2)} BUSD</span></h6></td>
                            </tr>
                          </tbody>
                        </table>

                        {/* <div className="row">
                          <div className="col-sm-6">
                            <h3 className="content-text14">ADDRESS</h3>
                          </div>
                          <div className="col-sm-6">
                            <h3 className="content-text14">DEPOSIT</h3>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm-6">
                            <h3 className="value-text">0x1C...25D</h3>
                          </div>
                          <div className="col-sm-6">
                            <h3 className="value-text">15.88 BUSD</h3>
                          </div>
                        </div> */}

                      </div>
                      <div className="col-sm-6">

                        <h3 className="subtitle-normal" style={{fontSize: "16px", lineHeight: "20px"}}>PREVIOUS WINNER</h3>

                        <table className="table">
                          <tbody>
                            <tr style={{border: "hidden", paddingRight: "10px"}}>
                              <td><h6 className="content-text14"><b>ADDRESS</b> <br /> <span className="value-text">{jackpotData[1]}</span></h6></td>
                              <td style={{textAlign:"right"}}><h6 className="content-text14"><b>DEPOSIT</b><br /><span className="value-text">{Number(jackpotData[2]).toFixed(2)} BUSD</span></h6></td>
                            </tr>
                          </tbody>
                        </table>

                        {/* <div className="row">
                          <div className="col-sm-6">
                            <h3 className="content-text14">ADDRESS</h3>
                          </div>
                          <div className="col-sm-6">
                            <h3 className="content-text14">DEPOSIT</h3>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm-6">
                            <h3 className="value-text">0x1C...25D</h3>
                          </div>
                          <div className="col-sm-6">
                            <h3 className="value-text">15.88 BUSD</h3>
                          </div>
                        </div> */}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
             <div className="col-sm-6">
               <div className="card">
                 <div className="card-header" style={{border: "none"}}>
                  <h3 className="subtitle-normal">RETURN CALCULATOR</h3>
                 </div>
                
                 <div className="card-body" style={{paddingTop: "0.6rem"}}>
                  
                  <div className="row">
                    <div className="col-sm-6">
                      <input
                        type="number"
                        placeholder="10 BUSD"
                        className="form-control input-box"
                        value={calculate}
                        step={10}
                        onChange={(e) => setCalculator(e.target.value)}
                      />
                     <br />
                    <p className="content-text13">Amount of returns calculated on the basis of deposit amount. 
                    <br />
                    <b>Note:</b> Min deposit is 10 BUSD & max deposit is 15,000 BUSD.</p>
                   </div>
                   <div className="col-sm-6" style={{textAlign:"right"}}>
                     <h3 className="subtitle-normal" style={{fontSize: "16px"}}>ROI</h3>
                  <p className="content-text">DAILY RETURN: <span className="value-text">{Number(calculate / 100 * 12).toFixed(3)} BUSD</span> <br /> WEEKLY RETURN: <span className="value-text">{Number(calculate / 100 * 12 * 7).toFixed(3)} BUSD</span>  <br /> MONTHLY RETURN: <span className="value-text">{Number(calculate / 100 * 12 * 30).toFixed(3)} BUSD</span> </p> 
                     </div>
                 </div>
                 </div>
               </div>
             </div>
           </div>
  <br />

           <br />
           <center>
            <h5 className="footer-item-text">
              <a href="https://dev-114.gitbook.io/atom-miner/" target="_blank" rel="noreferrer" style={{color:"#ffffff",textDecoration:"none"}}> DOCS </a>&nbsp;&nbsp;&nbsp;
              <a href="https://twitter.com/atom_busd" target="_blank" rel="noreferrer" style={{color:"#ffffff",textDecoration:"none"}}> TWITTER </a>&nbsp;&nbsp;&nbsp;
              <a href="https://t.me/atom_miner" target="_blank" rel="noreferrer" style={{color:"#ffffff",textDecoration:"none"}}> TELEGRAM </a>&nbsp;&nbsp;&nbsp;
              <a href={"https://bscscan.com/address/" + contractAddress } target="_blank" rel="noreferrer" style={{color:"#ffffff",textDecoration:"none"}}> CONTRACT </a>&nbsp;&nbsp;&nbsp;
              <a href="https://www.encryptosecurity.com/AuditRecord?project=62" target="_blank" rel="noreferrer" style={{color:"#ffffff",textDecoration:"none"}}> AUDIT </a>
            </h5>
            <br />
            <p style={{color: "#ffffff",fontSize: "14px",fontWeight: "200"}}>COPYRIGHT © 2022 Atom Miner Project All rights reserved!</p>
           </center>
           <br />
      </div>
    </> 
  );
}

export default Interface;
