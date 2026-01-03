import { createContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { getUser, removeUser, saveUser } from "../components/common/StorageService";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());

  useEffect(()=>{
    const chekUSer=async ()=>{
      try{
        const res=await api.get(`/users/${user.id}`);
        const freshUser=res.data;

        if(freshUser.isBlock){
          logout();
          toast.error("Your account has been blocked by Admin");
        }
      }catch(err){
        console.log("User status check failed",err); 
      }
    };
    chekUSer();

    const interval = setInterval(chekUSer, 5000);

  return () => clearInterval(interval);
  },[user])

  async function register(name, email, password) {
    const newUser = {
      name,
      email,
      password,
      role: "User",
      isBlock: false,
      createdAt: new Date().toISOString(),
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

    if(foundUser.isBlock==true){
      throw new Error("Your account has been blocked")
    }
    const freshUser=await api.get(`/users/${foundUser.id}`);

    setUser(freshUser.data)
    saveUser(freshUser.data);
    if(freshUser.data.role==="Admin"){
      toast.success("Admin logged in succesfully.")
      return;
    }else{toast.success("User logged in succesfully.")}
    
  }

  function logout() {
    setUser(null)
    removeUser();
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