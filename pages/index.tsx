import { flexbox, styled } from "@mui/system";

import Header from "./components/Header";
import BakeCard from "./components/BakeCard";
import NutritionFacts from "./components/NutritionFacts";
import ReferralLink from "./components/ReferralLink";
import Footer from "./components/Footer";
import { WalletSection } from "../components";

const Wrapper = styled("div")(({ theme }) => ({
  position: 'relative',
  maxWidth: 500,
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const WalletButton = styled("div")(() => ({
  display: 'flex',
  flexDirection: 'row-reverse'
}))


export default function Home() {

  return (
    <div>
      <Wrapper>
        <WalletButton>
          <WalletSection />
        </WalletButton>
        <Header />
        <BakeCard />
        <NutritionFacts />
        <ReferralLink address={undefined} />
        <Footer />
      </Wrapper>
    </div>
  );
}
