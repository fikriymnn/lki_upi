"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios"
import { Button } from 'flowbite-react';
import { imagefrombuffer } from "imagefrombuffer";
import { ref, deleteObject,getStorage, getDownloadURL, uploadBytesResumable,getMetadata } from "firebase/storage"
import {storage} from '../firebase/firebase'

export default function AdminOrderCard({  riwayat_pengujian,sample_dikembalikan,uuid, jenis_pengujian, nama_sample, jumlah_sample, index, wujud_sample, pelarut, preparasi_khusus, target_senyawa, metode_parameter, jurnal_pendukung, deskripsi, hasil_analisis, foto_sample, id, kode_pengujian,nama_pembimbing,lama_pengerjaan,no_invoice,status,invoice_id
}) {
    const [add, setAdd] = useState(false)
    const [file, setFile] = useState('')
    const [foto, setFoto] = useState('')

    useEffect(()=>{
        console.log(status)
    },[])
    const handleConfirm = async (e) => {
        e.preventDefault()
        try{
        const directory = 'hasilanalisis/'
        const fileName = `${file.name}`
    
        const storageRef = ref(storage, directory + fileName);
    
        // Create file metadata including the content type
        const metadata = {
          contentType: file.type,
        };
    
        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, file, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
    
        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);
            if (!file) {
                alert('no file uploaded')
                setAdd(a => !a)
            } else {
                const data = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/hasil_analisis/${id}?invoice_id=${invoice_id}${status=="Sample Dikerjakan Operator"?"&task=operator":""}`, { hasil_analisis: downloadURL }, { withCredentials: true } )
                if (data.data=='success') {

                    setAdd(a => !a)
                    alert("upload successfully!")
                    window.location.reload()
                }
            }
        } catch (err) {
        console.log(err)
            alert(err.message)
        }
    }

    const handleDownloadHA = async () => {
        try {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/download_hasil_analisis/${id}`, {
                    responseType: 'arraybuffer', withCredentials: true // Important for receiving binary data
                });

                const blob = new Blob([response.data], { type: 'application/octet-stream' });

                // Create a link element and click it to trigger the download

                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = hasil_analisis;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error downloading file:', error);
            }
        } catch (err) {
            alert(err.message)
        }
    }

    const handleDownloadJP = async () => {
        try {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/download_jurnal_pendukung/${uuid}`, {
                    responseType: 'arraybuffer', withCredentials: true  // Important for receiving binary data
                });

                const blob = new Blob([response.data], { type: 'application/octet-stream' });

                // Create a link element and click it to trigger the download

                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = jurnal_pendukung;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error downloading file:', error);
            }
        } catch (err) {
            alert(err.message)
        }
    }

 
    const handleDownloadFS = async () => {
        try {


            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/download_foto_sample/${uuid}`, {

                responseType: 'arraybuffer', withCredentials: true  // Important for receiving binary data
            });

            const blob = new Blob([response.data], { type: 'application/octet-stream' });

            // Create a link element and click it to trigger the download

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = foto_sample;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }

    }

    // const download_foto = async ()=>{

    // }
    // const download_jurnal_pendukung = async ()=>{

    // }
    // const download_hasil_analisis = async ()=>{

    // }

    return (
        <>
            <div className="border my-10">

                <div>

                    <h1 className="grad rounded p-2 text-white">{index}</h1>
                    <br />
                </div>
                <div className="px-5 pb-5 ">

                    <div className="border-1 rounded grid md:grid-cols-2 md:gap-10 gap-5">

                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">nama sample : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{nama_sample?nama_sample:"-"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">jumlah sample : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{jumlah_sample?jumlah_sample:"-"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">wujud sample : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{wujud_sample?wujud_sample:"-"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">pelarut : </h1>

                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{pelarut?pelarut:"-"}</h1>


                        </div>
                    </div>
                    <div className="flex flex-col gap-5 mt-5">
                         <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">sample_dikembalikan : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki-box ">{sample_dikembalikan?sample_dikembalikan:"tidak"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">jenis pengujian sample : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{jenis_pengujian?jenis_pengujian:"-"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">kode pengujian sample : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{kode_pengujian?kode_pengujian:"-"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">lama pengerjaan : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{lama_pengerjaan?lama_pengerjaan:"-"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">nama pembimbing : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{nama_pembimbing?nama_pembimbing:"-"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">preparasi khusus : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{preparasi_khusus ? "ya" : "tidak"}</h1>

                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">target senyawa : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{target_senyawa?target_senyawa:"-"}</h1>
                        </div>

                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">metode parameter : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki">{metode_parameter?metode_parameter:"-"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">deskripsi : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki-box ">{deskripsi?deskripsi:"-"}</h1>
                        </div>
                        <div>
                            <h1 className="md:text-lg text-xs font-semibold text-grey-600">riwayat pengujian : </h1>
                            <h1 className="md:text-lg sm:text-lg text-xs input-style-lki-box ">{riwayat_pengujian?riwayat_pengujian:"-"}</h1>
                        </div>


                        <div className="mt-2">


                            <div className="w-full">

                                <div className="">
                                    <h1 className="md:text-lg text-xs font-semibold text-grey-600">foto sample (*format file berupa png, jpg dan jpeg) : </h1>
                                    <div className="md:text-lg sm:text-lg text-xs ">

                                      
                                    {foto_sample ? <Button className="grad" color="failure" size={5} href={foto_sample}>download</Button> : <p>-</p>}
                                    </div>

                                </div>
                                <div className="grid md:grid-cols-2 gap-10 mt-5">

                                    <div className="md:w-full sm:w-full w-8/12">
                                        <h1 className="md:text-lg text-xs font-semibold text-grey-600">jurnal pendukung (*format file berupa docx atau pdf) : </h1>
                                        <div className="md:text-lg sm:text-lg text-xs">

                                            {jurnal_pendukung ? <Button className="grad" color="failure" size={5} href={jurnal_pendukung}>download</Button> : <p>-</p>}
                                        </div>

                                    </div>

                                    <div>
                                        <div className="md:flex gap-1">
                                            <h1 className="md:text-sm text-xs font-semibold text-grey-600 md:w-full sm:w-full w-8/12">Hasil analisis (*format file berupa pdf dan jika ingin mengirimkan lebih dari satu file, kirimkan dalam format zip/rar. Ukuran file dibawah 5mb) : </h1>
                                            {add ? <div className="flex"><button onClick={handleConfirm} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Kirim</button><button onClick={() => setAdd(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Cancel</button></div> : <button onClick={() => setAdd(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">upload file hasil analisis</button>}
                                        </div>

                                        {add ? <input type="file" name="hasil_analisis" onChange={(e) => {
                                            e.preventDefault()
                                            setFile(e.target.files[0])
                                
                                          
                                        }} /> : (hasil_analisis ?<Button color="failure" size={5} href={hasil_analisis}>download</Button> : <p className="md:text-lg sm:text-lg text-xs ">-</p>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>



            </div>
        </>
    )
}
