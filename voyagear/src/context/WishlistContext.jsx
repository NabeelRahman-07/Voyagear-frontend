import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";
import { saveUser } from "../components/common/StorageService";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, setUser } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist);
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user) return;

    const exists = wishlist.some(
      item => item.productId === product.id
    );

    if (exists) return;

    const updatedWishlist = [
      ...wishlist,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
    ];

    await updateWishlist(updatedWishlist);
    toast.success("Item added to the wishlist.");
  };

  const removeFromWishlist = async (productId) => {
    const updatedWishlist = wishlist.filter(
      item => item.productId !== productId
      
    );

    await updateWishlist(updatedWishlist);
    toast.success("Item removed from wishlist.");
  };

  const toggleWishlist = async (product) => {
    const exists = wishlist.some(
      item => item.productId === product.id
    );

    if (exists) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  const updateWishlist = async (updatedWishlist) => {
    setWishlist(updatedWishlist);

    const updatedUser = {
      ...user,
      wishlist: updatedWishlist,
    };

    await api.put(`/users/${user.id}`, updatedUser);
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
