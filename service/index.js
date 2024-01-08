import axios from "axios";
import { SHIRT_SIZES } from "../config";

export const saveOrder = async (wallet, size, minted = true) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_ORDERS_BACKEND_API_URL}create?wallet=${wallet}&size=${SHIRT_SIZES[size]}&minted=${minted}`
    );
    if (response?.data?.code === 0) {
      return {
        success: true,
        data: null,
      };
    } else {
      return {
        success: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
    };
  }
};

export const getWalletOrders = async (wallet) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_ORDERS_BACKEND_API_URL}getOrdersOfWallets?wallet=${wallet}`
    );
    if (response?.data?.code === 0) {
      return {
        success: true,
        data: response?.data?.data,
      };
    } else {
      return {
        success: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
    };
  }
};

export const setFinalized = async (idArray) => {
  try {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_ORDERS_BACKEND_API_URL
      }finalize?ids=${JSON.stringify(idArray)}`
    );
    if (response?.data?.code === 0) {
      return {
        success: true,
        data: response?.data?.data,
      };
    } else {
      return {
        success: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
    };
  }
};

export const setOrderId = async (idArray, orderId) => {
  try {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_ORDERS_BACKEND_API_URL
      }updateWithOrderId?ids=${JSON.stringify(idArray)}&orderId=${orderId}`
    );
    if (response?.data?.code === 0) {
      return {
        success: true,
        data: response?.data?.data,
      };
    } else {
      return {
        success: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
    };
  }
};
