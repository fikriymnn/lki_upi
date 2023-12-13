"use client"
import { UserContext } from '@/context/userContext';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';

export default function layout({children}){
    const router = useRouter()
    const {user} = useContext(UserContext)
    const {login} = user
    return(
        <>
        {children}
        </>
        
    )
}