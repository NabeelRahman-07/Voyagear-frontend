import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";
import { saveUser } from "../components/common/StorageService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, setUser } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  /* ---------- LOAD CART FROM USER ---------- */
  useEffect( () => {
    if (user?.cart) {
      setCart(user.cart);
    }else{setCart([])}
  }, [user]);

  /* ---------- ADD TO CART ---------- */
  const addToCart = async (product, quantity = 1) => {
    if (!user) return;

    const existingItem = cart.find(
      item => item.productId === product.id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    }

    // Update local state
    setCart(updatedCart);

    // Update user in json-server
    const updatedUser = { ...user, cart: updatedCart };
    await api.put(`/users/${user.id}`, updatedUser);

    // Sync AuthContext user
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  /* ---------- REMOVE FROM CART ---------- */
  const removeFromCart = async (productId) => {
    const updatedCart = cart.filter(
      item => item.productId !== productId
    );

    setCart(updatedCart);

    const updatedUser = { ...user, cart: updatedCart };
    await api.put(`/users/${user.id}`, updatedUser);
    setUser(updatedUser);
  };

  /* ---------- UPDATE QUANTITY ---------- */
  const updateQuantity = async (productId, quantity) => {
    const updatedCart = cart.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );

    setCart(updatedCart);

    const updatedUser = { ...user, cart: updatedCart };
    await api.put(`/users/${user.id}`, updatedUser);
    setUser(updatedUser);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
