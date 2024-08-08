import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:8080";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || "");
  const [food_list, setFoodList] = useState([]);

  const saveTokens = (newToken, newRefreshToken) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${url}/api/auth/refresh`, { token: refreshToken });
      saveTokens(response.data.token, response.data.refreshToken);
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setToken("");
      setRefreshToken("");
    }
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    const userId = localStorage.getItem("userId");

    if (token && userId) {
      try {
        await axios.post(url + "/api/cart/add", { userId, itemId }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      console.error("Token or userId not found");
    }
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", { userId: localStorage.getItem("userId") }, { headers: { Authorization: `Bearer ${token}` } });
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  const removeCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    const userId = localStorage.getItem("userId");

    if (token && userId) {
      try {
        await axios.post(url + "/api/cart/remove", { userId, itemId }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    } else {
      console.error("Token or userId not found");
    }
  };

  const getTotal = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  }, [token, refreshToken]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeCart,
    getTotal,
    url,
    token,
    refreshToken,
    setToken,
    setRefreshToken,
    refreshAccessToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
