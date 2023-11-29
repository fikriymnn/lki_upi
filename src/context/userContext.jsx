'use client'
import {createContext,useContext,useState} from 'react'

export const UserContext = createContext()


export function UserProvider({children}){
    const [user,setUser] = useState({login:true,id:"laskdk",name:"asdasd"});

    return(
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )

}

