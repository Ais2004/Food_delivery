import React, { useEffect, useState,useContext } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOMAIN } from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const Verify=()=> {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const {url} =useContext(StoreContext);
  //const [loading, setLoading] = useState(false);
  console.log(success,orderId);
  const verifyPayment = async () => {
    const response = await axios.post(url+"/api/order/verify", {
      success,
      orderId,
    });
    if (response.data.success) {
      navigate("/myorders");
      toast.success(response.data.message)
    } else {
      navigate("/");
      toast.error(response.data.message)
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <>
      <div className="verify">
        <div className="spinner"></div>
      </div>
    </>
  );
}

export default Verify;
