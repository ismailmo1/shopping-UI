import { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const totalAmount = `${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setisSubmitted] = useState(false);
  const cartItemRemoverHandler = (item) => {
    cartCtx.removeItem(item.id);
  };
  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderhandler = async (userData) => {
    setIsSubmitting(true);
    await fetch(
      "https://react-meals-eb2bc-default-rtdb.europe-west1.firebasedatabase.app/orders.json",
      {
        method: "POST",
        body: JSON.stringify({ user: userData, orderedItems: cartCtx.items }),
      }
    );
    setIsSubmitting(false);
    setisSubmitted(true);
    cartCtx.clearCart();
  };
  const modalButtons = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onHide}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );
  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => {
        return (
          <CartItem
            key={item.id}
            name={item.name}
            amount={item.amount}
            price={item.price}
            onRemove={cartItemRemoverHandler.bind(null, item)}
            onAdd={cartItemAddHandler.bind(null, item)}
          />
        );
      })}
    </ul>
  );
  const isSubmittingModalContent = <p>Sending Order Data</p>;
  const isSubmittedModalContent = (
    <>
      <p>Thanks for ordering!</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onHide}>
          Close
        </button>
      </div>
    </>
  );
  const cartModalContent = (
    <>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span> {totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onCancel={props.onHide} onConfirm={submitOrderhandler} />
      )}
      {!isCheckout && modalButtons}
    </>
  );

  return (
    <Modal onClose={props.onHide}>
      {!isSubmitting && !isSubmitted && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {isSubmitted && isSubmittedModalContent}
    </Modal>
  );
};

export default Cart;
