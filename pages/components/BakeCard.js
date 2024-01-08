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

// import { useWallet } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PriceInput from "../../components/PriceInput";
// import { buyEggs, hatchEggs, initialize, sellEggs } from "../../contracts/bean";
import axios from "axios";

// import {
//     getGlobalStateData,
//     getUserData,
//     getVaultSolBalance,
//     getWalletSolBalance,
// } from "../../contracts/bean";

const CardWrapper = styled(Card)({
    background: "transparent",
    marginBottom: 24,
    border: "5px solid #555",
});

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
    const searchParams = useRouter();
    /*const { address, chainId } = useAuthContext();*/
    // const { publicKey: address } = useWallet();
    const [bakeSOL, setBakeSOL] = useState(0);
    const [loading, setLoading] = useState(false);
    // const wallet = useWallet();

    const [minersCount, setMinersCount] = useState("0");
    const [beanRewards, setBeanRewards] = useState("0");
    const [walletSolBalance, setWalletSolBalance] = useState("0");
    const [contractSolBalance, setContractSolBalance] = useState("0");
    const [TVLBalance, setTVLBalance] = useState("0");
    const [dataUpdate, setDataUpdate] = useState(false);
    const [adminKey, setAdminKey] = useState(null);

    let cachedPrice = 0;
    let lastFetchTime = 0;

    async function getSolanaPriceInUSD() {

        const now = Date.now();
        // Vérifier si le prix est déjà en cache et si le dernier fetch est récent
        if (cachedPrice !== 0 && now - lastFetchTime < 600000) { // 10 minutes
            return Promise.resolve(cachedPrice);
        }

        try {
            const response = await axios.get('https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112');
            cachedPrice = response.data['pairs'][0].priceUsd;
            // console.log('cachedPrice', cachedPrice);
        } catch (error) {
            console.error('Error fetching SOL price:', error);
            return null;
        }
    }

    useEffect(() => {
        // getWalletSolBalance(wallet).then((bal) => {
        //     // console.log("getWalletSolBalance bal=", bal);
        //     setWalletSolBalance(bal);
        // });

        // getUserData(wallet).then((data) => {
        //     if (data !== null) {
        //         if (data.refAddress) {
        //             const currentParams = new URLSearchParams(window.location.search);
        //             const currentRef = currentParams.get('ref');

        //             // console.log('data.refAddress', data.refAddress);

        //             //Constants.TREASURY

        //             // console.log('Constants.TREASURY', Constants.TREASURY.toBase58());

        //             if (data.refAddress !== Constants.TREASURY.toBase58() && currentRef !== data.refAddress) {
        //                 const newUrl = `${window.location.origin}?ref=${data.refAddress}`;
        //                 window.location.href = newUrl;
        //             }
        //         }
        //         setBeanRewards(data.beanRewards);
        //         setMinersCount(data.miners);
        //     } else {
        //         setBeanRewards("0");
        //         setMinersCount("0");
        //     }
        // });
        // getGlobalStateData(wallet).then((data) => {
        //     if (data != null) {
        //         setAdminKey(data.authority);
        //     }
        // });
        // }, [wallet, dataUpdate]);
    }, [dataUpdate]);

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useEffect(() => {
        // getVaultSolBalance(wallet).then((bal) => {
        //     getSolanaPriceInUSD().then((price) => {
        //         const calculatedTVL = +cachedPrice * bal
        //         setTVLBalance(numberWithCommas(calculatedTVL.toFixed(2)));
        //     });
        //     setContractSolBalance(bal);
        // });
        // }, [wallet, dataUpdate]);
    }, [dataUpdate]);

    useEffect(() => {
        setTimeout(() => {
            // if (wallet.publicKey) toggleDataUpdate();
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
        return ref;
    };

    const initializeProgram = async () => {
        setLoading(true);
        try {
            // await initialize(wallet);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
        toggleDataUpdate();
    };

    const bake = async () => {
        setLoading(true);

        let ref = getRef();

        // console.log('ref bake', ref);

        // if (ref === null) ref = wallet.publicKey;

        // ref = new PublicKey(ref);
        try {
            // await buyEggs(wallet, ref, bakeSOL);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
        toggleDataUpdate();
    };

    const reBake = async () => {
        setLoading(true);

        let ref = getRef();

        // if (ref === null) ref = wallet.publicKey;

        // ref = new PublicKey(ref);
        try {
            // await hatchEggs(wallet, ref);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
        toggleDataUpdate();
    };

    const eatBeans = async () => {
        setLoading(true);

        try {
            // await sellEggs(wallet);
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
                    <Typography variant="h5">{contractSolBalance} SOL</Typography>
                </UnderlinedGrid>
                <UnderlinedGrid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                >
                    <Typography variant="body1">Wallet</Typography>
                    <Typography variant="h5">{walletSolBalance} SOL</Typography>
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

                    {/* <Box marginTop={3} marginBottom={3}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={initializeProgram}
                            hidden
                            className="custom-button"
                        >
                            Init
                        </Button>
                    </Box> */}

                    <Box marginTop={3} marginBottom={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            // disabled={!address || +bakeSOL === 0 || loading}

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
                            {beanRewards} SOL
                        </Typography>
                    </Grid>
                    <ButtonContainer container spacing={1}>
                        <Grid item flexGrow={1} marginTop={3}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                // disabled={!address || loading}
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
                                // disabled={!address || loading}
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
