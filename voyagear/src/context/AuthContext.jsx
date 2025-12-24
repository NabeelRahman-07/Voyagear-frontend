import { createContext, useState, useEffect} from "react";
import api from "../api/axiosInstance";
import { getUser, removeUser, saveUser } from "../components/common/StorageService";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getUser());

    async function register(name, email, password) {
        const newUser = {
            name,
            email,
            password,
            role: "User",
            isBlock: false,
            cart: [],
            wishlist: [],
            orders: []
        };
        const existingUser = await api.get(`/users?email=${email}`);

        if (existingUser.data.length > 0) {
            throw new Error("User already exist")
        }

        const res = await api.post(`/users`, newUser);

        setUser(res.data);
        saveUser(res.data);
        toast.success("Account created successfully");
    }

    async function login(email, password) {

        const res = await api.get(`/users?email=${email}`);

        if (res.data.length === 0) {
            throw new Error("User not found!")
        }

        const foundUser = res.data[0];

        if (foundUser.password !== password) {
            throw new Error("Password is incorrect")
        }

        setUser(foundUser)
        saveUser(foundUser);
        toast.success("User logged in succesfully.")
    }

    function logout() {
        setUser(null)
        removeUser();
        toast.success("User logged out!")
    }

    useEffect(() => {
  const handleStorageChange = (event) => {
    if (event.key === "user") {
      if (event.newValue) {
        setUser(JSON.parse(event.newValue));
      } else {
        setUser(null); 
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

    return (
        <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}