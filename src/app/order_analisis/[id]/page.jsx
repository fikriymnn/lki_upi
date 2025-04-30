"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Resizer from "react-image-file-resizer";
import {
    ref,
    deleteObject,
    getStorage,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../firebase/firebase";

export default function Order_analisis_next({ params }) {
    const { id } = params;
    const router = useRouter();
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [jurnal_pendukung, setJurnal_pendukung] = useState([]);
    const [foto_sample, setFoto_sample] = useState([]);
    const [verifikasi, setVerifikasi] = useState(false);

    const handleFS = (event) => {
        let reader = new FileReader();
        const imageFile = event.target.files[0];
        const imageFilname = event.target.files[0].name;
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                //------------- Resize img code ----------------------------------
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 700;
                var MAX_HEIGHT = 700;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                ctx.canvas.toBlob(
                    (blob) => {
                        const file = new File([blob], imageFilname, {
                            type: imageFile.type,
                            lastModified: Date.now(),
                        });

                        foto_sample[0] = file;
                    },
                    imageFile.type,
                    1
                );
            };
            img.onerror = () => {
                alert("invalid image content");
            };
            //debugger
            img.src = e.target.result;
        };

        reader.readAsDataURL(imageFile);
    };

    const onUploadJurnal = async (e) => {
        e.preventDefault();
        jurnal_pendukung[0] = e.target.files[0];
        if (jurnal_pendukung) {
            async function cek() {
                setLoading2(true)
                try {
                    const directory = "jurnalpendukung/";
                    const fileName = `${jurnal_pendukung[0].name}`;

                    const storageRef = ref(storage, directory + fileName);

                    // Create file metadata including the content type
                    const metadata = {
                        contentType: jurnal_pendukung[0].type,
                    };

                    // Upload the file in the bucket storage
                    const snapshot = await uploadBytesResumable(
                        storageRef,
                        jurnal_pendukung[0],
                        metadata
                    );
                    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

                    // Grab the public url
                    const downloadURL = await getDownloadURL(snapshot.ref);

                    if (downloadURL) {
                        console.log(downloadURL)
                        await axios.post(
                            `${process.env.NEXT_PUBLIC_URL}/api/jurnal_pendukung/${id}`,
                            { jurnal_pendukung: downloadURL },
                            {
                                withCredentials: true,
                            }
                        );
                        setLoading2(false)
                    }
                } catch (err) {
                    console.log(err.message);
                }
            }
            cek();
        }
    }

    const onUploadFS = async (e) => {
        handleFS(e);
        if (foto_sample[0]) {
            async function cek2() {
                setLoading(true)
                try {
                    const directory = "fotosample/";
                    const fileName = `${foto_sample[0].name}`;

                    const storageRef = ref(storage, directory + fileName);

                    // Create file metadata including the content type
                    const metadata = {
                        contentType: foto_sample[0].type,
                    };

                    // Upload the file in the bucket storage
                    const snapshot = await uploadBytesResumable(
                        storageRef,
                        foto_sample[0],
                        metadata
                    );
                    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

                    // Grab the public url
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    if (downloadURL) {
                        await axios.post(
                            `${process.env.NEXT_PUBLIC_URL}/api/foto_sample/${id}`,
                            { foto_sample: downloadURL },
                            {
                                withCredentials: true,
                            }
                        );
                        setLoading(false)

                    }
                } catch (err) {
                    console.log(err.message);
                }
            }
            cek2();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        window.location.href = "/success"
    }

    useEffect(() => {
        async function getData() {
            try {
                const token = localStorage.getItem("access_token");
                const data = await axios(
                    `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
                    { withCredentials: true }
                );

                if (data.data.success == true) {
                    setUser(data.data.data);
                }
            } catch (err) {
                console.log(err.message)
            }
        }

        getData()
    })


    return (
        <>

            <div>
                {/* <button onClick={() => { console.log(jenis_pengujian); console.log(nama_sample) }}>asd</button> */}
                <p className="md:mt-14 sm:mt-14 mt-10 text-center md:text-3xl sm:text-2xl text-sm font-bold text-gray-800">
                    Layanan Analisis Laboratorium Kimia Instrumen &#40;LKI&#41; UPI
                </p>
                <div className="flex justify-center">
                    <hr className="grad h-2 mb-8 mt-5 w-56 text-center" />
                </div>
                <form onSubmit={handleSubmit}>

                    <div className=" border-2 rounded-lg md:mx-20 md:mx-20 mx-2">
                        {/* <p className='text-xl font-semibold text-xl text-white bg-red-600 rounded-lg p-3'>{i + 1}</p> */}
                        <div className="w-full flex justify-items-center items-center h-10 grad rounded-[5px]">
                            <p className="my-auto text-lg font-bold text-white text-center m-auto p-2">LAMPIRAN FILE</p>
                        </div>
                        <div className="md:px-10 md:px-10 px-5 py-5 flex flex-col gap-3">
                            <h2 className="md:text-lg sm:text-lg text-sm font-semibold">
                                Foto Sample (*format file yang diupload berupa png, jpg atau
                                jpeg)
                            </h2>
                            {
                                loading ? (
                                    <center className="pt-2">
                                        <div className=" md:p-5 sm:p-5 p-2 w-full bg-white rounded-lg">
                                            <div className="inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white">
                                                <div className="w-16 h-16 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
                                            </div>
                                        </div>
                                    </center>
                                ) : ""
                            }
                            <div>

                                <input
                                    className={loading2 ? "hidden" : ""}
                                    name="foto_sample"
                                    type="file"
                                    onChange={onUploadFS}
                                />
                            </div>

                        </div>
                        <div className="md:px-10 md:px-10 px-5 py-5 flex flex-col gap-3">
                            <div>
                                <div>
                                    <h2 className="md:text-lg sm:text-lg text-sm font-semibold">
                                        Jurnal Pendukung (*format file yang diupload berupa docx atau
                                        pdf, ukuran file dibawah 10mb)
                                    </h2>
                                    {
                                        loading2 ? (
                                            <center className="pt-2">
                                                <div className=" md:p-5 sm:p-5 p-2 w-full bg-white rounded-lg">
                                                    <div className="inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white">
                                                        <div className="w-16 h-16 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
                                                    </div>
                                                </div>
                                            </center>
                                        ) : ""

                                    }
                                    <div>
                                        <input
                                            className={loading2 ? "hidden" : ""}
                                            name="jurnal_pendukung"
                                            type="file"
                                            onChange={onUploadJurnal}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="flex md:mx-20 sm:mx-20 mx-4 gap-2">
                        <input
                            className="my-auto"
                            type="checkbox"
                            id="verifikasi"
                            name="verifikasi"
                            required
                            onChange={(e) => setVerifikasi(true)}
                        />
                        <h2 htmlFor="verifikasi" className="md:text-xl sm:text-lg text-xs">
                            Saya telah memahami proses pengujian yang akan dilakukan dan
                            memahami syarat dan ketentuan yang telah dijelaskan oleh
                            staff/pengelola laboratorium
                        </h2>
                        <br />
                    </div>
                    <br />
                    <div className="w-full flex justify-center mb-20">
                        <button
                            type="submit"
                            className="grad  text-white rounded-lg m-auto text-[24px] font-bold px-6 py-3"
                        >
                            Kirim
                        </button>
                    </div>
                </form>
            </div>

        </>
    );
}
