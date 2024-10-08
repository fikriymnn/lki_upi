"use client";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Button, Checkbox, Label, input } from "flowbite-react";

export default function Register({ searchParams }) {
  const { prevRoute } = searchParams;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [userForm, setUserForm] = useState({
    nama_lengkap: "",
    jenis_institusi: "",
    nama_institusi: "",
    program_studi: "",
    fakultas: "",
    email: "",
    password: "",
    no_telp: "",
    no_whatsapp: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    async function user() {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/user`,
          {
            withCredentials: true,
          }
        );

        if (data.data.success) {
          if (prevRoute) {
            router.push(prevRoute);
          } else {
            router.push("/");
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    user();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    async function submit() {
      try {
        const data = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/register`,
          userForm,
          {
            withCredentials: true,
          }
        );
        if (data.data.status == 400) {
          alert(data.data.message);
        }

        if (data.data.success == true) {
          localStorage.setItem('access_token', data.data.token);
          if (prevRoute) {
            window.location.replace(prevRoute);
          } else {
            window.location.replace("/");
          }
        }
      } catch (err) {
        alert(err.message);
      }
    }
    submit();
  };

  return (
    <>
      <div className="">
        <div className="flex flex-col justify-center items-center">
          <div className="flex mt-4 gap-5">
            <Image
              src={"/footer.png"}
              width={0}
              height={0}
              sizes="100vw"
              className="w-[123px] h-[34px] my-auto bg-red-700 rounded-full"
            />
            <h1 className="font-medium text-[30px] ">
              Registrasi Layanan <span className="font-bold">LKI UPI</span>
            </h1>
          </div>
          <hr className="text-red-700 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 h-2 mb-8 mt-5 w-96 text-center rounded-full" />
        </div>
        <form onSubmit={handleSubmit} className=" w-10/12 m-auto">
          <div className="grid md:grid-cols-2 gap-4 grid-cols-1   m-auto">
            <div className="flex flex-col gap-4">
              <div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nama_lengkap" value="Nama Lengkap" />
                </div>
                <input
                  name="nama_lengkap"
                  type="text"
                  required
                  onChange={handleChange}
                  placeholder="Masukkan Nama Lengkap"
                  className="input-style-lki"
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="jenis_institusi"
                    value="Jenis Institusi"
                    className="w-96"
                  />
                </div>
                <select
                  name="jenis_institusi"
                  placeholder="Pilih jenis institusi"
                  className="input-style-lki"
                  required
                  onChange={handleChange}
                >
                  <option value="" selected disabled hidden>
                    Pilih Jenis Institusi
                  </option>
                  <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                  <option value="Perusahaan">Perusahaan</option>
                </select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="no_telp" value="No Telepon" />
                </div>
                <input
                  className="input-style-lki"
                  name="no_telp"
                  required
                  type="text"
                  onChange={handleChange}
                  placeholder="Masukkan no Telepon"
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Password" />
                  
                </div>
                <input
                  className="input-style-lki"
                  name="password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  placeholder="Masukkan Password"
                />
                <button className="text-xs text-red-600" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 'hide' : 'show'}
                              </button>
              </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {userForm.jenis_institusi ? (
                <div>
                  <div>
                    {userForm.jenis_institusi == "Perusahaan" ? (
                      <div className="">
                        <div className="mb-2 block">
                          <Label
                            htmlFor="nama_institusi"
                            value="Nama Perusahaan"
                          />
                        </div>
                        <input
                          className="input-style-lki"
                          name="nama_institusi"
                          placeholder="Masukkan nama perusahaan"
                          required
                          type="text"
                          onChange={handleChange}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-4">
                          <div className="">
                            <div className="mb-2 block">
                              <Label
                                htmlFor="nama_institusi"
                                value="Nama Perguruan Tinggi"
                              />
                            </div>
                            <input
                              className="input-style-lki"
                              name="nama_institusi"
                              placeholder="Masukkan nama perguruan tinggi"
                              required
                              type="text"
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <div className="mb-2 block">
                              <Label htmlFor="fakultas" value="Nama Fakultas" />
                            </div>
                            <input
                              className="input-style-lki"
                              name="fakultas"
                              placeholder="Masukkan nama fakultas"
                              required
                              type="text"
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <div className="mb-2 block">
                              <Label
                                htmlFor="program_studi"
                                value="Nama Program Studi"
                              />
                            </div>
                            <input
                              className="input-style-lki"
                              name="program_studi"
                              placeholder="Masukkan nama program studi"
                              required
                              type="text"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
              <div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="no_whatsapp" value="No Whatsapp" />
                </div>
                <input
                  className="input-style-lki"
                  name="no_whatsapp"
                  placeholder="Masukkan No WhatsApp"
                  required
                  type="text"
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Email" />
                </div>
                <input
                  className="input-style-lki"
                  name="email"
                  required
                  type="text"
                  placeholder="Masukkan Email"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          </div>
          <div className=" mx-auto w-full mt-10">
            <Button
              type="submit"
              color=""
              className="mx-auto px-10 py-1 text-2xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-rose-300 text-white"
            >
              Submit
            </Button>
            <br />
          </div>
        </form>
        <div className="w-full flex justify-center items-center mb-10">
          <a
            href={`/login?prevRoute=${prevRoute}`}
            className="text-center text-red-600 mx-auto"
          >
            Login
          </a>
        </div>
      </div>
    </>
  );
}
