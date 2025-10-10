import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { setPurchasedEvents }from "../slices/UserSlice";
const Cart = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const purchasedEvents = useSelector((state) => state.user.purchasedEvents);



  useEffect(() => {
  if (user) {
    axios.get(`http://127.0.0.1:8000/api/user/${user.id}/tickets`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => {
      dispatch(setPurchasedEvents(res.data));
    });
  }
}, [user]);


  if (!user) return <p>Connectez-vous pour voir vos tickets.</p>;

  return (
    <div>
      <h2>Mes Tickets</h2>
      {purchasedEvents.length === 0 ? (
        <p>Vous n'avez acheté aucun ticket.</p>
      ) : (
        <ul>
          {purchasedEvents.map(ticket => (
            <li key={ticket.id}>
              {ticket.evenement.title} - {ticket.quantity} billet(s) - {ticket.amount * ticket.quantity} MAD
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
