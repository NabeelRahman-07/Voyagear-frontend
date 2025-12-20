import { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";
import { saveUser } from "../components/common/StorageService";

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const { user, setUser } = useContext(AuthContext);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  /* ---------- CALCULATE TOTAL ---------- */
  const calculateTotal = (items = []) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /* ---------- PLACE ORDER ---------- */
  const placeOrder = async (items, paymentMethod = "COD", address = {}) => {
    if (!user || !items || items.length === 0) {
      throw new Error("No items to place order");
    }

    try {
      setPaymentLoading(true);
      setPaymentError(null);

      const totalAmount = calculateTotal(items);

      const newOrder = {
        orderId: `ORD_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase()}`,
        items: [...items],
        totalAmount,
        paymentMethod,
        paymentStatus: "SUCCESS",
        shippingAddress: address,
        orderStatus: "Placed",
        createdAt: new Date().toISOString(),
      };

      const updatedUser = {
        ...user,
        orders: [...(user.orders || []), newOrder],
        cart: [], // clear cart after payment
      };

      await api.put(`/users/${user.id}`, updatedUser);

      setUser(updatedUser);
      saveUser(updatedUser);

      return newOrder;
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      setPaymentError("Payment failed. Try again.");
      throw err;
    } finally {
      setPaymentLoading(false);
    }
  };

  /* ---------- GET ORDER HISTORY ---------- */
  const getOrderHistory = () => user?.orders || [];

  /* ---------- GET ORDER BY ID ---------- */
  const getOrderById = (orderId) =>
    user?.orders?.find(o => o.orderId === orderId) || null;

  /* ---------- CLEAR ERROR ---------- */
  const clearError = () => setPaymentError(null);

  return (
    <PaymentContext.Provider
      value={{
        placeOrder,
        calculateTotal,
        getOrderHistory,
        getOrderById,
        paymentLoading,
        paymentError,
        clearError,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext);
