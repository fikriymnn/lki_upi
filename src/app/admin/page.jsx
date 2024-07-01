"use client";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Admin() {
  // const [role,setRole] = useState('')
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    async function cek(){
      const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/remember/${token}`, {
        withCredentials: true
    })
  
      if(data.data.data.role=="user"){
        router.replace("/")
      }
      else if(data.data.data.role == "admin"){
        router.replace("/admin/dashboard/admin")
    } else if(data.data.success == "operator"){
        router.replace("/admin/dashboard/operator")
    } else if(data.data.success == "pj"){
        router.replace("/admin/dashboard/pj")
    }else if(data.data.success == "superadmin"){
      router.replace("/admin/dashboard/superadmin")
  }
    }
    cek()
   
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const get_user = async () => {
      try {
        const data = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/login`,
          userForm,
          { withCredentials: true }
        );
        

        if (data.data.success == true) {
          localStorage.setItem('access_token', data.data.token);
          const dataUser = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/api/user/${data.data.token}`,
            { withCredentials: true }
          );
          
          if (dataUser.data.data.role == "admin") {
            window.location.replace("/admin/dashboard/admin");
          } else if (dataUser.data.data.role == "operator") {
            window.location.replace("/admin/dashboard/operator");
          } else if (dataUser.data.data.role == "pj") {
            window.location.replace("/admin/dashboard/pj");
          } else {
            await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/logout`, {
              withCredentials: true,
            });
            window.location.replace("/");
          }
        } else {
          alert(data.data.message);
        }
      } catch (err) {
        alert(err.message);
      }
    };
    get_user();
  };


  return (
    <>
      <div className="md:mt-20 sm:mt-14 mt-8 mb-14">
        <p className="text-center md:text-2xl sm:text-xl text-lg font-bold text-gray-800 mt-10 md:mb-5 sm:mb-5 mb-8">
          LOGIN ADMIN
        </p>
        <div className="flex justify-center"></div>
        <form
          className="flex max-w-md flex-col gap-4 m-auto "
          onSubmit={onSubmit}
        >
          <div className="md:w-full sm:w-full w-10/12 m-auto">
            <div className="mb-2 block ">
              <Label htmlFor="email" value="Your Email" />
            </div>
            <TextInput
              id="email"
              type="text"
              placeholder="email"
              name="email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="md:w-full sm:w-full w-10/12 m-auto">
            <div className="mb-2 block ">
              <Label htmlFor="password" value="Your Password" />
            </div>
            <TextInput
              id="password"
              type="password"
              name="password"
              required
              placeholder="password"
              onChange={handleChange}
            />
          </div>

          <Button type="submit" color="failure" className="md:w-full sm:w-full w-6/12 m-auto">
            Submit
          </Button>
          <br />
          <br />
        </form>
      </div>
    </>
  );
}
