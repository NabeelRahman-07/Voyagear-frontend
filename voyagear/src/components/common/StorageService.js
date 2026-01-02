export const saveUser=(user)=>{
    localStorage.setItem("user",JSON.stringify(user));
};

export const getUser = () => {
  const data = localStorage.getItem("user");

  if (!data || data === "undefined") {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Invalid user data in localStorage", error);
    return null;
  }
};


export const removeUser=()=>{
    localStorage.removeItem("user");
};

