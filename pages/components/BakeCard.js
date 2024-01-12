/* eslint-disable react-hooks/exhaustive-deps */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { isEmpty } from "../../utils/utils";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/router';
import PriceInput from "../../components/PriceInput";
import axios from "axios";
import { useSigningClient } from "../../contexts/cosmwasm";
import { config, chainName, owner_contract, defaultDenom, minerContract } from "../../config";

const CardWrapper = styled(Card)({
    background: "transparent",
    marginBottom: 24,
    border: "5px solid #555",
});
const address1 = owner_contract;
const ButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        "> div": {
            marginLeft: 0,
            marginRight: 0,
        },
    },
}));

const UnderlinedGrid = styled(Grid)(() => ({
    borderBottom: "1px solid black",
}));

export default function BakeCard() {
    const {
        pending,
        getGlobalStateData,
        getUserData,
        buy,
        hatch,
        // initialize,
        startMining,
        sell,
        balances,
        address,
    } = useSigningClient();

    const searchParams = useRouter();
    const [bakeSOL, setBakeSOL] = useState(0);
    const [loading, setLoading] = useState(false);

    const [minersCount, setMinersCount] = useState("0");
    const [beanRewards, setBeanRewards] = useState("0");
    const [walletSolBalance, setWalletSolBalance] = useState("0");
    // const [contractSolBalance, setContractSolBalance] = useState("0");
    const [TVLBalance, setTVLBalance] = useState("0");
    const [dataUpdate, setDataUpdate] = useState(false);
    const [adminKey, setAdminKey] = useState(null);
    const [isStarted, setIsStarted] = useState(false);
    const [treasuryWallet, setTreasuryWallet] = useState("");

    let cachedPrice = 0;
    let lastFetchTime = 0;

    const isAdminConnected = () => {
        if (address && adminKey) {
            return address.toString() == adminKey.toString()
        }
        return false;
    }

    const canShowStartMine = useMemo(() => {
        return !isStarted && isAdminConnected()
    }, [isStarted, address])

    async function getSolanaPriceInUSD() {

        const now = Date.now();
        // Vérifier si le prix est déjà en cache et si le dernier fetch est récent
        if (cachedPrice !== 0 && now - lastFetchTime < 600000) { // 10 minutes
            return Promise.resolve(cachedPrice);
        }

        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=sei-network&vs_currencies=usd');
            cachedPrice = response.data['sei-network'].usd;
            lastFetchTime = Date.now();
            // console.log('cachedPrice', cachedPrice);
        } catch (error) {
            console.error('Error fetching SEI price:', error);
            return null;
        }
    }

    useEffect(() => {
        setWalletSolBalance(balances.usei);
        getUserData().then((data) => {
            if (data !== false) {
                // console.log('userdata is: >>>>>', data)
                if (data.refAddress) {
                    const currentParams = new URLSearchParams(window.location.search);
                    const currentRef = currentParams.get('ref');

                    if (data.refAddress !== Constants.TREASURY.toBase58() && currentRef !== data.refAddress) {
                        const newUrl = `${window.location.origin}?ref=${data.refAddress}`;
                        window.location.href = newUrl;
                    }
                }
                // console.log("getUserData() data in BakeCard: >> ", data);
                // console.log('beanRewards is: ', beanRewards);
                setBeanRewards(data.beanRewards.toFixed(6).toString());
                setMinersCount(data.miners);
            } else {
                setBeanRewards("0");
                setMinersCount("0");
            }
        }).catch(err => {
            console.log(err);
        });
        getGlobalStateData().then((data) => {
            if (data != null) {
                setAdminKey(data.authority);
                setTreasuryWallet(data.treasury);
                if (data.is_mining_started === 0)
                    setIsStarted(false);
                if (data.is_mining_started === 1)
                    setIsStarted(true);
            }
        }).catch(err => {
            console.log(err);
        });
    }, [address, dataUpdate]);

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useEffect(() => {
        getSolanaPriceInUSD().then((price) => {
            let calculatedTVL = 0;
            // if (isEmpty(balances.minerContract))
            if (isEmpty(balances[minerContract]))
                calculatedTVL = cachedPrice * 0;
            else
                calculatedTVL = cachedPrice * balances[minerContract]
            // calculatedTVL = cachedPrice * balances.minerContract
            setTVLBalance(numberWithCommas(calculatedTVL.toFixed(2)));
            // console.log(cachedPrice, balances, numberWithCommas(calculatedTVL.toFixed(2)))
        });
    }, [address, dataUpdate, balances]);

    useEffect(() => {
        setTimeout(() => {
            // if (address.publicKey) toggleDataUpdate();
            if (address) toggleDataUpdate();
        }, 60000);
    });

    const toggleDataUpdate = () => {
        setDataUpdate(!dataUpdate);
    };

    const onUpdateBakeSOL = (value) => {
        setBakeSOL(value);
    };

    const getRef = () => {
        const { ref } = searchParams.query;
        return address1;
    };

    // const initializeProgram = async () => {
    //     setLoading(true);
    //     try {
    //         await initialize(address);
    //     } catch (err) {
    //         console.error(err);
    //     }
    //     setLoading(false);
    //     toggleDataUpdate();
    // };

    const startMine = async () => {

        setLoading(true);
        try {
            await startMining(address);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
        toggleDataUpdate();
    };

    const bake = async () => {
        setLoading(true);

        let ref = getRef();
        if (ref === undefined) ref = address1;
        try {
            await buy(address, bakeSOL, ref);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
        toggleDataUpdate();
    };

    const reBake = async () => {
        setLoading(true);

        let ref = getRef();
        if (ref === undefined) ref = address1;

        try {
            await hatch(address, ref);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
        toggleDataUpdate();
    };

    const eatBeans = async () => {
        setLoading(true);
        // console.log('balances is: ', balances);
        try {
            await sell(address);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
        toggleDataUpdate();
    };

    return (
        <CardWrapper>
            {loading && <LinearProgress color="secondary" />}
            <CardContent style={{ color: "#17215E" }}>
                <UnderlinedGrid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                >
                    <Typography variant="body1">TVL</Typography>
                    <Typography variant="h5">{TVLBalance} $</Typography>
                </UnderlinedGrid>
                <UnderlinedGrid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                >
                    <Typography variant="body1">Contract</Typography>
                    <Typography variant="h5">{!balances.minerContract ? 0 : balances.minerContract} SEI</Typography>
                </UnderlinedGrid>
                <UnderlinedGrid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                >
                    <Typography variant="body1">Wallet</Typography>
                    <Typography variant="h5">{!address ? 0 : balances.usei} SEI</Typography>
                    {/* <Typography variant="h5">{isEmpty(balances.usei) ? 0 : balances.usei} SEI</Typography> */}
                </UnderlinedGrid>
                <UnderlinedGrid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                >
                    <Typography variant="body1">Your Bananas</Typography>
                    <Typography variant="h5">{minersCount} BANANAS</Typography>
                </UnderlinedGrid>
                <Box paddingTop={4} paddingBottom={3}>
                    <Box>
                        <PriceInput
                            max={+walletSolBalance}
                            value={bakeSOL}
                            onChange={(value) => onUpdateBakeSOL(value)}
                        />
                    </Box>

                    {/* <Box marginTop={3} marginBottom={3} hidden={!isAdminConnected()}> */}
                    <Box marginTop={3} marginBottom={3} hidden={!canShowStartMine}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={startMine}
                            hidden={!canShowStartMine}
                            className="custom-button"
                        >
                            Start Mine
                        </Button>
                    </Box>

                    <Box marginTop={3} marginBottom={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            disabled={!address || +bakeSOL === 0 || loading}
                            onClick={bake}
                            className="custom-button"
                        >
                            BUY BANANA
                        </Button>
                    </Box>
                    <Divider />
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        mt={3}
                    >
                        <Typography variant="body1" fontWeight="bolder">
                            Your Rewards
                        </Typography>
                        <Typography variant="h5" fontWeight="bolder">
                            {beanRewards} SEI
                        </Typography>
                    </Grid>
                    <ButtonContainer container spacing={1}>
                        <Grid item flexGrow={1} marginTop={3}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                disabled={!address || loading}
                                onClick={reBake}
                                className="custom-button"
                            >
                                COMPOUND
                            </Button>
                        </Grid>
                        <Grid item flexGrow={1} marginTop={3}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                disabled={!address || loading}
                                onClick={eatBeans}
                                className="custom-button"
                            >
                                CLAIM REWARDS
                            </Button>
                        </Grid>
                    </ButtonContainer>
                </Box>
            </CardContent>
        </CardWrapper>
    );
}
