import { useContext, useEffect, useState } from "react";
import CartContext from "../../store/cart-context";
import CartIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css";

const HeaderCartButton = (props) => {
  const cartCtx = useContext(CartContext);
  const [isCartAnimated, setIsCartAnimated] = useState(false);

  const numCartItems = cartCtx.items.reduce((itemCount, item) => {
    return itemCount + item.amount;
  }, 0);

  const btnClasses = `${classes.button} ${isCartAnimated ? classes.bump : ""}`;
  useEffect(() => {
    if (cartCtx.items.length === 0) {
      return;
    }
    setIsCartAnimated(true);
    const timer = setTimeout(() => {
      setIsCartAnimated(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [cartCtx.items]);
  return (
    <button className={btnClasses} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;
