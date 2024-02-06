"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from 'flowbite-react';
import axios from "axios";

export default function OrderCard({ uuid, jenis_pengujian, nama_sample, jumlah_sample, index, wujud_sample, pelarut, preparasi_khusus, target_senyawa, metode_parameter, jurnal_pendukung, hasil_analisis, id, deskripsi, foto_sample, kode_pengujian, status

}) {

    const [foto, setFoto] = useState('')



    const handleDownloadHA = async () => {
        try {


            const response = await axios.get(`http://localhost:5000/api/download_hasil_analisis/${uuid}`, {

                responseType: 'arraybuffer', withCredentials: true // Important for receiving binary data
            });

            const blob = new Blob([response.data], { type: 'application/octet-stream' });

            // Create a link element and click it to trigger the download

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = hasil_analisis
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }

    }

    const handleDownloadJP = async () => {
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

    }

    useEffect(() => {
        if (foto_sample) {
            async function getData() {
                const data = await axios.get(`http://localhost:5000/api/download_foto_sample/${uuid}`)
                    const base64Image = data?.data?.foto_sample?.data.toString('base64');
                    const contentType = data?.data?.foto_sample?.contentType
                    const src = `data:${contentType};base64,${base64Image}`;
                    setFoto(src);
            }

            getData()
        }
    }, [foto_sample])

    return (
        <><div>
            <br />
            <h1 className="bg-red-600 rounded p-2 text-white">{index}</h1>
            <br />
        </div>

            <div className="border-1 rounded grid grid-cols-2">

                <div>
                    <h1 className="text-lg font-semibold text-grey-600">nama sample : </h1>
                    <h1 className="input-style-lki">{nama_sample}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">jumlah sample : </h1>
                    <h1 className="input-style-lki">{jumlah_sample}</h1>
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
                    <h1 className="text-lg font-semibold text-grey-600">wujud sample : </h1>
                    <h1 className="input-style-lki">{wujud_sample}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">pelarut : </h1>

                    <h1 className="input-style-lki">{pelarut}</h1>


                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">preparasi khusus : </h1>
                    <h1>{preparasi_khusus ? "ya" : "tidak"}</h1>

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
                    <h1 className="text-lg font-semibold text-grey-600">preparasi khusus : </h1>
                    <h1 className="input-style-lki-box">{preparasi_khusus ? "ya" : "tidal"}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">deskripsi : </h1>
                    <h1 className="input-style-lki-box ">{deskripsi}</h1>
                </div>
                <div className="mt-2">


                    <div className="w-full">

                        <div className="">
                            <h1 className="text-lg font-semibold text-grey-600">foto sample : </h1>
                            <div className="input-style-lki-flexible">

                                {foto_sample ? <img src={foto} alt="foto sample" className="w-96 h-48 " /> : <p>-</p>}
                            </div>

                        </div>
                        <div className="">

                            <div cl>
                                <h1 className="text-lg font-semibold text-grey-600">jurnal pendukung : </h1>
                                <div className="input-style-lki">

                                    {jurnal_pendukung ? <Button className="grad" color="failure" size={5} onClick={handleDownloadJP}>download</Button> : <p>-</p>}
                                </div>

                            </div>

                            <div>
                                <h1 className="text-lg font-semibold text-grey-600">Hasil analisis : </h1>
                                <div className="input-style-lki">

                                    {status == "selesai" ? <h1 className="input-style-lki"><Button className="grad" color="failure" size={5} onClick={handleDownloadHA}>download</Button></h1> : <p>-</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}