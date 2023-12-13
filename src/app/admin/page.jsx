"use client"
import { useRouter } from "next/navigation"
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

export default function admin(){
    const router = useRouter()

    const onSubmit = (e)=>{
        router.push('/admin/dashboard')
    }
    return(
        <>
        <div className="">
        <p className="text-2xl text-center font-bold">Login Admin</p>
                <br/>
                <br/>
                <form className="flex max-w-md flex-col gap-4 m-auto ">
                    <div >
                        <div className="mb-2 block ">
                            <Label htmlFor="email1" value="Your email" />
                        </div>
                        <TextInput id="email1" type="text" placeholder="email" required />
                    </div>
                    <div>
                        <div className="mb-2 block ">
                            <Label htmlFor="password" value="Your password" />
                        </div>
                        <TextInput id="password" type="password" required placeholder="password" />
                    </div>
                   
                    <Button onClick={onSubmit}>Submit</Button>
                    <br />
                <br />
               
                </form>
                
            </div>
        </>
    )
}