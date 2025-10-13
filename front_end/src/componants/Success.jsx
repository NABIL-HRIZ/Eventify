import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { resetCart } from "../slices/CartSlice";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/Success.css";

const Success = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); 

  useEffect(() => {


    dispatch(resetCart());
    
   
  }, [dispatch, user]);

  return (
    <div className="minimal-success">
      <div className="minimal-card">
        <FaCheckCircle className="minimal-checkmark" />
        <h1>Paiement Confirmé !</h1>
        <p>Vos billets ont été ajoutés à votre compte</p>

        <button 
          className="minimal-btn"
          onClick={() => (window.location.href = "/cart")}
        >
          Voir mes billets
        </button>
      </div>
    </div>
  );
};

export default Success;