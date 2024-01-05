import { useEffect, useState } from "react"

export default function layout({children}){
    const [role,setRole] = useState("")

useEffect(()=>{
        async function user(){
            try{
                const data = await axios.get("http://localhost:5000/api/user",{
                    withCredentials: true
                })
                console.log(data)
                if (data.data.success) {
                    setRole(data.data.role)
                    if (role=="admin") {
                        router.replace('/admin/dashboard/admin')
                      } else if(role=="operator") {
                          router.replace('/admin/dashboard/operator')
                      }else if(role=="pj") {
                          router.replace('/admin/dashboard/pj')
                      }else{
                          router.replace('/')
                      }
                }else{
                    router.replace("/")
                }  
            }catch(err){
               console.log(err.message)
            }
                    
        }
        user()
    },[])
    return (
        
        <>
        {role=="admin"||role=="operator"||role=="pj"?children:router.replace("/")}
        </>
    )
}