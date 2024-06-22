import React, { useContext } from 'react'
import './Carts.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Carts = () => {

  const { cartItems, food_list, removeCart,getTotal,url } = useContext(StoreContext);
  const navigate=useNavigate(); //
  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{getTotal()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>DeliveryFee</p>
            <p>{2}</p> 
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <p>{getTotal()+2}</p>
          </div>
          <hr />  
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECK OUT(order in app.jsx)</button>
        </div>
        <div className="promo-code">
          <div>
            <p>If you have promocode,enter it here</p>
            <div className="pc">
              <input type="text" placeholder='promocode' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carts