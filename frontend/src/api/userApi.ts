import { LoginFormData } from "../pages/Login";
import { SignUpFormData } from "../pages/SignUp";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

export const signup = async (formData: SignUpFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/signup`, {
        method: "POST",
        credentials: "include",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(formData),
        
    })

    const responseBody = await response.json();
    const statusCode = response.status;

    return { statusCode, responseBody };
}

export const verifyCode = async (otp: string) => {
    const response = await fetch(`${API_BASE_URL}/api/user/verify-code`, {
        method: "POST",
        credentials: "include",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify({otp}),
        
    })

    const responseBody = await response.json();
    const statusCode = response.status;

    return { statusCode, responseBody };
}

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include",
        
    })
    const statusCode = response.status;

    return { statusCode };
}

export const login = async (formData: LoginFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        credentials: "include",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(formData),
        
    })

    const responseBody = await response.json();
    const statusCode = response.status;

    return { statusCode, responseBody };
}