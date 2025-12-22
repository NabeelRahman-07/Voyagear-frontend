import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";
import { saveUser } from "../components/common/StorageService";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, setUser } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  useEffect( () => {
    if (user?.cart) {
      setCart(user.cart);
    }else{setCart([])}
  }, [user]);

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
    setCart(updatedCart);
    toast.success("Item added to cart.")

    const updatedUser = { ...user, cart: updatedCart };
    await api.put(`/users/${user.id}`, updatedUser);

    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const removeFromCart = async (productId) => {
    const updatedCart = cart.filter(
      item => item.productId !== productId
    );

    setCart(updatedCart);

    const updatedUser = { ...user, cart: updatedCart };
    await api.put(`/users/${user.id}`, updatedUser);
    toast.success("Item removed from cart.")
    setUser(updatedUser);
  };

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
