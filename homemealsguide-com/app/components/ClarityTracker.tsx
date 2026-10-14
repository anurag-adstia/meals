'use client';
import { LOCAL_STORAGE_USER_ID, LOCAL_STORAGE_SESSION_ID } from "@/app/lib/constants";
import { useEffect } from "react";


const ClarityTracker = () => {
    useEffect(() => {
        setTimeout(() => {
            window.clarity?.("identify",
                localStorage.getItem(LOCAL_STORAGE_USER_ID),
                sessionStorage.getItem(LOCAL_STORAGE_SESSION_ID)
            );
        }, 300)
    }, []);
    return null;
}

export default ClarityTracker