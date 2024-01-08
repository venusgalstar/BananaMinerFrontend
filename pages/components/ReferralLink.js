import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import { useNotify } from '../../components/notify';

import { styled } from "@mui/system";

const CardWrapper = styled(Card)({
    background: "transparent",
    border: "5px solid #555",
});

const Input = styled("input")(({ theme }) => ({
    fontSize: 10,
    fontWeight: 300,
    padding: "10px 12px",
    borderRadius: 0,
    border: "1px solid #555",
    background: "white",
    width: "100%",
    outline: "none",
    // color: theme.palette.primary.main,
}));

export default function ReferralLink({ address }) {
    const link = (typeof window !== "undefined" ? window.origin : '') + `?ref=${address}`;
    const notify = useNotify();

    const copyToClipboard = () => {
        notify('success', 'Referral Link Copied to Clipboard');
        navigator.clipboard.writeText(link);
    };

    return (
        <CardWrapper>
            <CardContent style={{ paddingLeft: 8, paddingRight: 8, color: "#17215E" }}>
                <Typography gutterBottom variant="h5" textAlign="center">
                    Referral Link
                </Typography>
                <Input value={address ? link : ""} readOnly />
                <Grid item flexGrow={1} marginTop={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={!address}
                        className="custom-button"
                        onClick={copyToClipboard}
                    >
                        COPY TO CLIPBOARD
                    </Button>
                </Grid>
                <Typography className="css-dir1dn"
                    textAlign="center"
                    variant="body2"
                    marginTop={2}
                    paddingX={3}
                >
                    Earn 12% of the SOL used to compound from anyone who uses your
                    referral link
                </Typography>
            </CardContent>
        </CardWrapper>
    );
}
