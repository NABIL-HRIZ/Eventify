// src/pages/Success.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementCart } from "../slices/CartSlice";
import { addPurchasedEvent } from "../slices/UserSlice";
import { useLocation } from "react-router-dom";

const Success = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

useEffect(() => {
  if (user) {
    axios.get(`http://127.0.0.1:8000/api/user/${user.id}/tickets`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => dispatch(setPurchasedEvents(res.data)))
      .catch(err => console.error(err));
  }
}, [user]);

  return (
    <div>
      <h2>Paiement réussi ! </h2>
      {user ? (
        <p>Votre billet a été ajouté à vos événements.</p>
      ) : (
        <p>Connectez-vous pour voir vos événements payés.</p>
      )}
    </div>
  );
};

export default Success;
