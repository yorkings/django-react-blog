import { create } from "zustand";

export const userStore=create((set)=>({
    customUser:null,
    isloading:true,
    setcustomUser:(user)=>set({customUser:user,isloading:false}),
    

}))