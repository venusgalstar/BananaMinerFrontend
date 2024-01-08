import Head from "next/head";
import { WalletSection } from "../components";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { storefront } from "../utils/storefront";
import productHelper from "../utils/productHelper";
import { useSigningClient } from "../contexts/cosmwasm";
import { getWalletOrders, setFinalized, setOrderId } from "../service";
import { SHIRT_SIZE_NAMES } from "../config";

export default function Cart() {
  const [shirt, setShirt] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [shopifyCartURL, setShopifyCartURL] = useState(null);
  const [checked, setChecked] = useState(false);
  const [incopletedOrders, setIncompletedOrders] = useState([]);
  const [sizeNames, setSizeNames] = useState("");
  const { address }: any = useSigningClient();
  const router = useRouter();

  const getShirt = async () => {
    const { body } = await storefront();

    const mappedProducts = body
      ? (body as any).products.edges.map((p) => {
          return productHelper.map(p.node);
        })
      : [];
    const sku = "shirtdrop";
    const shirt = productHelper.getBySKU(sku, mappedProducts);
    setShirt(shirt[0]);
  };

  const getShopify = async () => {
    try {
      let response = await sendToShopify();
      response = await response.json();
      if (response["errors"]) {
        toast.error(response["errors"][0].message);
      } else {
        setShopifyCartURL(response["data"].checkoutCreate.checkout.webUrl);

        console.log(
          "checkout id >>>> ",
          response["data"].checkoutCreate.checkout.id
        );
        const checkoutToken = response["data"].checkoutCreate.checkout.id
          .split("?key")[0]
          .replace("gid://shopify/Checkout/", "");

        console.log("checkout token >>>> ", checkoutToken);

        let idArraysOfOders = [];
        incopletedOrders?.map((item) => {
          idArraysOfOders.push(item["_id"]);
        });
        if (idArraysOfOders?.length > 0) {
          await setOrderId(idArraysOfOders, checkoutToken);
        }
      }
      localStorage.removeItem("step");
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch");
    }
  };

  const sendToShopify = async () => {
    const items = [];
    const variants = shirt?.variants;
    console.log("incompletedOrders   >>>> ", incopletedOrders);
    incopletedOrders.map((item, index) => {
      const sizename = SHIRT_SIZE_NAMES[item.size];
      for (let j = 0; j < variants.length; j++) {
        const variant = variants[j];
        if (variant?.title?.toLowerCase() === sizename?.toLowerCase()) {
          items[index] = `{ variantId: "${variant.id.replace(
            /\//g,
            "\\/"
          )}", quantity: 1 }`;
          break;
        }
      }
    });

    const lineItems = items.join(",");
    const gql = String.raw;
    const query = gql`
			mutation {
				checkoutCreate(input: {
					allowPartialAddresses: true,
					lineItems: [ ${lineItems} ]
				}) {
					checkout {
						id
						webUrl
					}
				}
			}
		`;

    const variables = {};
    const API_URL =
      process.env.NEXT_PUBLIC_SHOPIFY_API_URL + "api/2023-07/graphql.json";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const initWithWalletOrders = async (wallet) => {
    if (!wallet || wallet === "") return;
    const result = await getWalletOrders(wallet);
    if (result.success === true) {
      const orders = result.data || [];
      if (orders?.length <= 0) {
      } else {
        let sizes = [];
        orders.map((item) => {
          sizes.push(item.size);
        });
        let sizeNames = "";
        sizes.map((item, index) => {
          sizeNames +=
            SHIRT_SIZE_NAMES[item] + (index === sizes.length - 1 ? "" : ", ");
        });
        setSizeNames(sizeNames);
      }
      setIncompletedOrders(orders);
    } else {
    }
  };

  useEffect(() => {
    let setting = localStorage.getItem("setting");
    if (setting) {
      setting = JSON.parse(setting);
      setChecked(setting["read"]);
    }
  }, []);

  useEffect(() => {
    getShirt();
    initWithWalletOrders(address);
  }, [address]);

  useEffect(() => {
    if (shirt && incopletedOrders) {
      getShopify();
    }
  }, [shirt, incopletedOrders]);

  const handleCheck = (e) => {
    const value = {
      read: e.target.checked,
    };
    localStorage.setItem("setting", JSON.stringify(value));
    setChecked(e.target.checked);
  };

  const handleOrder = async () => {
    if (!checked) {
      toast.warn(
        <div>
          <span>Please read the privacy policy over on this page:</span>
          <br />
          <a
            href={`${window.location.origin}/privacy`}
            style={{ color: "rgb(59 130 246" }}
            className="text-blue-600"
            target="_blank"
            rel="noreferrer"
          >
            https://suitdrop-shirtdrop.vercel.app/privacy
          </a>
        </div>
      );
      return;
    }
    let idArraysOfOders = [];
    incopletedOrders?.map((item) => {
      idArraysOfOders.push(item["_id"]);
    });
    console.log("idArraysOfOders  >>> ", idArraysOfOders);
    // if (idArraysOfOders?.length > 0) {
    //   await setFinalized(idArraysOfOders);
    // }
    window.location.href = shopifyCartURL;
  };

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
        <h1 className="text-2xl font-bold sm:text-3xl md:text-3xl">MY CART</h1>
      </div>

      <div className="container flex flex-col md:flex-row w-full mt-10 mx-auto">
        <div className="w-full md:w-1/2 flex justify-center text-center items-start">
          {shirt ? (
            <Image
              src={shirt.image.src}
              height={shirt.image.height}
              width={shirt.image.width}
              alt={shirt.title}
              objectFit="contain"
            />
          ) : (
            <div className="flex flex-col gap-4 justify-center items-center h-full min-h-[500px]">
              <ReactLoading type="spin" color="#fff" />
              <span className="text-white text-lg">Loading...</span>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-evenly">
          <div className="flex justify-between">
            <div className="text-xl">Size: {sizeNames}</div>
            <div className="text-xl">
              Total: {incopletedOrders?.length || 0} SHIRT
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mt-4 mb-2">
              <label
                htmlFor="default-checkbox"
                className="text-xl text-gray-900 dark:text-gray-300"
              >
                <a
                  href="https://suitdrop-shirtdrop.vercel.app/privacy"
                  target="_blank"
                  rel="noreferrer"
                >
                  I have read the{" "}
                  <span className="underline">privacy policy</span>
                </a>
              </label>
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={checked}
                onChange={handleCheck}
              />
            </div>
            <span className="text-white text-lg">
              Don&apos;t close the window until you&apos;ve finalized your order
            </span>
          </div>

          <div className="container flex flex-col w-full mt-10 mb-5">
            <button
              className={
                "mt-5 w-full bg-[#e00036] hover:bg-[#ad062e] disabled:opacity-60 transition p-2.5 text-center rounded-md text-xl"
              }
              disabled={incopletedOrders?.length === 0}
              onClick={handleOrder}
            >
              Finalize Order
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center  text-sm text-center bg-transparent mt-5 mb-2 relative min-h-[80px]">
        <a
          href="https://artlink.network/"
          className="absolute bottom-0 right-2 flex gap-2 items-center"
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-white text-lg">Powered by</span>
          <Image src="/artlink.png" width={100} height={18} layout="fixed" />
        </a>
      </div>
    </div>
  );
}
