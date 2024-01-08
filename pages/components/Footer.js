import Grid from "@mui/material/Grid";

// import tgIcon from "../assets/telegramIcon.png"
// import twIcon from "../assets/twitterIcon.png"

// const tgIcon: StaticImageData =

export default function Footer() {
    return (
        <Grid container justifyContent="center" spacing={2} marginTop={4}>
            {/* <Grid item>
        <a href="" target="__blank">
          <img src={solIcon} alt="" width={48} height={48} />
        </a>
      </Grid> */}
            <Grid item>
                <a href="https://twitter.com/BananaMiner_" target="__blank">
                    <img src="/asset/twitterIcon.png" alt="" width={48} height={48} />
                </a>
            </Grid>
            <Grid item>
                <a href="https://t.me/BananaMinerPortal" target="__blank">
                    <img src="/asset/telegramIcon.png" alt="" width={48} height={48} />
                </a>
            </Grid>
        </Grid>
    );
}
