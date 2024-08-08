import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { getTotal, token, food_list, cartItems, url, setToken, refreshAuthToken } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const stripePromise = loadStripe("pk_test_51PV73rRtia1waaQkA17qHfSqj7Z5dhNr3Jfvy0If0jbIGi1vsubAc6QGRZezsyBTsAE5BtcSVwybUc3RAnwY47oP00rP0rTlwm");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (!storedToken || !storedUserId) {
      toast.warn("Please login to continue.");
      navigate("/login");
    }
  }, [navigate]);

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User ID is not found in local storage.');
      return;
    }

    let orderData = {
      userId,
      address: {
        firstName: data.firstName,
        lastName: data.lastName,
        street: data.street,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        country: data.country,
        phone: data.phone
      },
      items: orderItems,
      amount: getTotal() + 50,
    };

    console.log("Sending order data:", orderData);

    const sendOrderRequest = async (token) => {
      try {
        let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { Authorization: `Bearer ${token}` } });
        console.log("Received response:", response);

        if (response.data.success) {
          const { sessionId } = response.data;

          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({ sessionId });

          if (error) {
            console.error("Error redirecting to Checkout:", error);
            alert("Error: Unable to redirect to payment page.");
          } else {
            // Redirect to orders page upon successful payment
            navigate("/myorders");
          }
        } else {
          console.error("Error response data:", response.data);
          alert("Error: " + response.data.message);
        }
      } catch (error) {
        console.error("Error placing order:", error);
        if (error.response) {
          console.error("Error response:", error.response);
          if (error.response.data.message === 'Token Expired. Please Login again.') {
            const newToken = await refreshAuthToken();
            if (newToken) {
              sendOrderRequest(newToken); // Retry the order request with the new token
            } else {
              setToken('');
              localStorage.removeItem('token');
              navigate('/login');
            }
          } else {
            alert("Error: " + error.response.data.message);
          }
        } else if (error.request) {
          console.error("Error request:", error.request);
          alert("Error: No response from server.");
        } else {
          console.error("Error message:", error.message);
          alert("Error: " + error.message);
        }
      }
    };

    sendOrderRequest(token); // Initial attempt to send the order request
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <h2 className='title'>Delivery Information</h2>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder='First name' />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder='Last Name' />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} placeholder='Email' />
        <input required name="street" onChange={onChangeHandler} value={data.street} placeholder='Street' />
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} placeholder='City' />
          <input required name="state" onChange={onChangeHandler} value={data.state} placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' />
          <input required name="country" onChange={onChangeHandler} value={data.country} placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{getTotal()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>{50}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <p>{getTotal() + 50}</p>
          </div>
          <hr />
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
