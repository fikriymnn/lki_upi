"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios"
import { Button } from 'flowbite-react';
import { imagefrombuffer } from "imagefrombuffer";

export default function AdminOrderCard({  riwayat_pengujian,sample_dikembalikan,uuid, jenis_pengujian, nama_sample, jumlah_sample, index, wujud_sample, pelarut, preparasi_khusus, target_senyawa, metode_parameter, jurnal_pendukung, deskripsi, hasil_analisis, foto_sample, id, kode_pengujian
}) {
    const [add, setAdd] = useState(false)
    const [file, setFile] = useState('')
    const [foto, setFoto] = useState('')

    const handleConfirm = async (e) => {
        e.preventDefault()
        try {
            if (!file) {
                alert('no file uploaded')
                setAdd(a => !a)
            } else {
                const data = await axios.post(`http://localhost:5000/api/hasil_analisis/${id}`, { hasil_analisis: file }, { withCredentials: true, headers: { "Content-Type": 'multipart/form-data' } })
                if (data.data=='success') {

                    setAdd(a => !a)
                    alert("upload successfully!")
                    window.location.reload()
                }
            }
        } catch (err) {
            alert(err.message)
        }
    }

    const handleDownloadHA = async () => {
        try {
            try {
                const response = await axios.get(`http://localhost:5000/api/download_hasil_analisis/${id}`, {
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
                const response = await axios.get(`http://localhost:5000/api/download_jurnal_pendukung/${uuid}`, {
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

    useEffect(() => {
        if (foto_sample) {
            async function getData() {
                const data = await axios.get(`http://localhost:5000/api/download_foto_sample/${uuid}`)
                const buffer = Buffer.from(data?.data?.data);
                const base64Image = buffer.toString('base64');
                const contentType = foto_sample
                const src = `data:${contentType};base64,${base64Image}`;
                setFoto(src);
               
            }
            getData()
        }
        if(hasil_analisis){
            setFile(hasil_analisis)
        }
    }, [foto_sample])



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
                            <h1 className="text-lg font-semibold text-grey-600">nama sample : </h1>
                            <h1 className="input-style-lki">{nama_sample}</h1>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">jumlah sample : </h1>
                            <h1 className="input-style-lki">{jumlah_sample}</h1>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">wujud sample : </h1>
                            <h1 className="input-style-lki">{wujud_sample}</h1>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">pelarut : </h1>

                            <h1 className="input-style-lki">{pelarut}</h1>


                        </div>
                    </div>
                    <div className="flex flex-col gap-5 mt-5">
                         <div>
                            <h1 className="text-lg font-semibold text-grey-600">sample_dikembalikan : </h1>
                            <h1 className="input-style-lki-box ">{sample_dikembalikan}</h1>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">jenis pengujian sample : </h1>
                            <h1 className="input-style-lki">{jenis_pengujian}</h1>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">kode pengujian sample : </h1>
                            <h1 className="input-style-lki">{kode_pengujian}</h1>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">preparasi khusus : </h1>
                            <h1 className="input-style-lki">{preparasi_khusus ? "ya" : "tidak"}</h1>

                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">target senyawa : </h1>
                            <h1 className="input-style-lki">{target_senyawa}</h1>
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">metode parameter : </h1>
                            <h1 className="input-style-lki">{metode_parameter}</h1>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">deskripsi : </h1>
                            <h1 className="input-style-lki-box ">{deskripsi}</h1>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-grey-600">riwayat pengujian : </h1>
                            <h1 className="input-style-lki-box ">{riwayat_pengujian}</h1>
                        </div>


                        <div className="mt-2">


                            <div className="w-full">

                                <div className="">
                                    <h1 className="text-lg font-semibold text-grey-600">foto sample : </h1>
                                    <div className="input-style-lki-flexible">

                                        {foto_sample ? <img src={foto} alt="foto sample" className="w-96 h-48 " /> : <p>-</p>}
                                    </div>

                                </div>
                                <div className="grid md:grid-cols-2 gap-10 mt-5">

                                    <div cl>
                                        <h1 className="text-lg font-semibold text-grey-600">jurnal pendukung : </h1>
                                        <div className="input-style-lki">

                                            {jurnal_pendukung ? <Button className="grad" color="failure" size={5} onClick={handleDownloadJP}>download</Button> : <p>-</p>}
                                        </div>

                                    </div>

                                    <div>
                                        <div className="md:flex gap-1">
                                            <h1 className="text-lg font-semibold text-grey-600">Hasil analisis : </h1>
                                            {add ? <div className="flex"><button onClick={handleConfirm} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Kirim</button><button onClick={() => setAdd(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Cancel</button></div> : <button onClick={() => setAdd(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">upload file hasil analisis</button>}
                                        </div>

                                        {add ? <input type="file" name="hasil_analisis" onChange={(e) => {
                                            e.preventDefault()
                                            setFile(e.target.files[0])
                                          
                                        }} /> : (hasil_analisis ? <Button color="failure" size={5} onClick={handleDownloadHA}>download</Button> : <p className="input-style-lki">-</p>)}
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