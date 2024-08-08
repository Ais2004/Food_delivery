import React, { useContext, useEffect, useState } from "react";
import "./myOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } } // Ensure Bearer token is set correctly
      );

      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="parcel" />
            <p>
              {order.items.map((item, index) => (
                index === order.items.length - 1 
                ? `${item.name} x${item.quantity}`
                : `${item.name} x${item.quantity}, `
              ))}
            </p>
            <p>${order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span>&#x25cf;</span>
              <b>{order.status}</b>
            </p>
            <button>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
