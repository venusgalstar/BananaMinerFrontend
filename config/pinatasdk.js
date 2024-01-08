import axios from "axios";
import { PINATA_JWT } from "./index";
const JWT = "Bearer " + PINATA_JWT;

export const pinFileToIPFS = async (file) => {
  let ipfsCid = "";
  try {
    const formData = new FormData();
    //   const src = "path/to/file.png";

    // const file = fs.createReadStream(src);
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "Shidrtdrop NFT",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT,
        },
      }
    );
    console.log(res.data);
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    console.log(error);
    ipfsCid = null;
  }
  return ipfsCid;
};

export const pinURLToIPFS = async (url) => {
  let ipfsCid = "";
  try {
    const formData = new FormData();
    const resp = await fetch(url);
    console.log(">>>>", resp);
    const fileBlob = await resp.blob();
    const fileObj = new File([fileBlob], "ShirtNFT")
    formData.append("file", fileObj);

    const metadata = JSON.stringify({
      name: "Shirtdrop",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT,
        },
      }
    );
    console.log(res.data);
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    console.log(error);
    ipfsCid = null;
  }
  return ipfsCid;
};

export const pinJSONToIPFS = async (jsonObj) => {
  let ipfsCid = "";
  try {
    let res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      { ...jsonObj },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: JWT,
        },
      }
    );
    console.log("res => ", res.data);
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    ipfsCid = null;
  }
  return ipfsCid;
};
