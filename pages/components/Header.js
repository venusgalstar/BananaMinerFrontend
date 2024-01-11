import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

const Wrapper = styled("div")(({ theme }) => ({
    textAlign: "center",
    paddingBottom: 24,
    [theme.breakpoints.down("md")]: {
        h5: {
            fontSize: 20,
            margin: 0,
        },
    },
}));

export default function Header() {
    return (
        <Wrapper className="text-black">
            <div className="flex justify-center py-3">
                <img src={"/logo.png"} alt="" width={"70%"} />
            </div>
            <hr className="border-b border-b-black border-[1px] border-gray-100" />
            <div className="mt-4"></div>
            <Typography variant="h7" marginTop={-3} marginX={3} className="header-text"  >
                <b>The SEI reward pool with the richest daily return and lowest dev fee, daily income of up to 8%, and a referral bonus of up to 12% (<a href='https://banana-miner-organization.gitbook.io/banana-miner/' target='_blank' rel="noreferrer">documentation</a>)</b>
            </Typography>
            <Typography variant="inherit" marginX={6} marginTop={3} marginBottom={3} textAlign={"justify"}>
                <b>#1 - BUY BANANA</b>: Start by using your SEI to purchase bananas.<br></br>
                <b>#2 - COMPOUND</b>: To maximize your earnings, click on the &quot;COMPOUND&quot; button. This action will automatically reinvest your rewards back into BANANA.<br></br>
                <b>#3 - CLAIM REWARDS</b>: This will transfer your accumulated SEI rewards directly into your wallet<br></br>
            </Typography>
            <i>The key to maximizing your rewards lies in the quantity of bananas you hold and how frequently you compound them. The more bananas you accumulate and the more often you reinvest your rewards, the greater the potential for earning more rewards</i>
        </Wrapper>
    );
}
