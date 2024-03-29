import Head from "next/head";
import { WalletSection } from "../components";
import Link from "next/link";
import Image from "next/image";

export default function Privacy() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-10 min-h-[100vh] flex flex-col justify-between">
      <Head>
        <title>Suitdrop | Redeem</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex flex-row justify-end items-center mb-2 gap-5">
        <Link
          className="inline-flex items-center justify-center w-12 h-12 text-black border rounded-lg dark:text-white hover:bg-black/10 dark:hover:bg-white/10 border-black/10 dark:border-white/10 mr-2"
          href="/"
        >
          <div className="hover:underline hover:underline-offset-1 text-[#e0e0e0] hover:text-white mr-2 text-lg cursor-pointer">
            Redeem
          </div>
        </Link>
        <WalletSection />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold sm:text-3xl md:text-3xl">
          PRIVACY POLICY
        </h1>
      </div>

      <div className="container flex flex-col md:flex-row w-full mt-10 mx-auto">
        <div className="w-full md:w-1/2 flex flex-col justify-center mx-auto">
          <div className="flex flex-col gap-4">
            <span>suitdrop.zone (hereinafter referred to as the &quot;Platform&ldquo;) respects the privacy of its users and is committed to protecting their personal information. This Privacy Policy describes how we collect, use, disclose, and retain personal information in accordance with applicable data protection laws and regulations. By using the Platform or engaging in activities related to the Platform, you agree to the practices described in this Privacy Policy.</span>
            <span>1. Scope of the Privacy Policy</span>
            <span>This Privacy Policy applies to the users of the Osmosis blockchain, Osmosis Decentralized exchange, receivers, holders, and redeemers of the SHIRT token, and other tokens created on the suitdrop platform. It covers the personal information collected, used, and disclosed by suitdrop.zone and its owners/creators.</span>
            <span>2. Data Collection</span>
            <div>
              <span>The Platform may collect the following types of personal information from users:</span>
              <ol className="ml-5" type="a" style={{ listStyle: "lower-alpha" }}>
                <li>Personal identifiers, such as name and email address.</li>
                <li>Crypto wallet addresses used on the Platform.</li>
                <li>Transaction information related to the use of tokens on the Platform.</li>
                <li>Physical addresses for the purpose of redeeming tokenized vouchers for physical products.</li>
              </ol>
            </div>
            <span>However, the Platform does NOT associate or store users&apos; crypto wallet addresses with their physical addresses. Physical addresses are stored ephemerally for the single purpose of fulfilling the order then permanently deleted.</span>
            <span>3. Cookies and Tracking Technologies</span>
            <span>The Platform may use cookies and other tracking technologies to enhance user experience, analyze Platform usage, and deliver relevant content. Users can manage their preferences and opt-out of such tracking technologies by adjusting their browser settings.</span>
            <span>4. Data Usage</span>
            <div>
              <span>The personal information collected may be used for:</span>
              <ol className="ml-5" type="a" style={{ listStyle: "lower-alpha" }}>
                <li> Facilitating the delivery of suitdrops to the Platform&apos;s users.</li>
              </ol>
            </div>
            <span>5. Data Sharing</span>
            <span>The Platform may share personal information with third-party service providers only to the extent necessary for the performance of their services. Such service providers are required to maintain the confidentiality of users&apos; personal information and may not use it for any other purpose.</span>
            <span>6. Data Retention</span>
            <span>The Platform retains personal information only for as long as necessary to fulfill the purposes described in this Privacy Policy. </span>
            <span>7. Security Measures</span>
            <span>The Platform employs reasonable and appropriate technical and organizational measures to protect users&apos; personal information from unauthorized access, disclosure, alteration, or destruction. However, users are responsible for maintaining the confidentiality of their login credentials and should not share them with anyone.</span>
            <span>8. User Rights</span>
            <span>Users may have certain rights under applicable data protection laws, including the right to access, correct, or delete their personal information, or object to its processing. To exercise these rights, users can contact the Platform using the contact information provided in this Privacy Policy.</span>
            <span>9. Updates and Changes to the Privacy Policy</span>
            <span>The Platform reserves the right to update or modify this Privacy Policy at any time. Users will be notified of any material changes, and continued use of the Platform following the notification of changes will constitute acceptance of those changes.</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center  text-sm text-center bg-transparent mt-5 mb-2 relative min-h-[80px]">
        <a href="https://artlink.network/" className="absolute bottom-0 right-2 flex gap-2 items-center" target="_blank" rel="noreferrer">
          <span className="text-white text-lg">Powered by</span>
          <Image src="/artlink.png" width={100} height={18} layout="fixed" />
        </a>
      </div>
    </div>
  );
}
