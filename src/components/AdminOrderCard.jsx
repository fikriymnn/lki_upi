"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios"
import { Button } from 'flowbite-react';
import { imagefrombuffer } from "imagefrombuffer";

export default function AdminOrderCard({ jenis_pengujian, nama_sample, jumlah_sample, index, wujud_sample, pelarut, preparasi_khusus, target_senyawa, metode_parameter, jurnal_pendukung, deskripsi, hasil_analisis, foto_sample, id,kode_pengujian
}) {
    const [add, setAdd] = useState(false)
    const [file, setFile] = useState(null)
    const [foto, setFoto] = useState('')
    
    const handleConfirm = async (e) => {
        e.preventDefault()
        try {
            if(!file){
                alert('no file uploaded')
                setAdd(a => !a)
            }else{
                const data = await axios.post(`http://localhost:5000/api/hasil_analisis/${id}`,{hasil_analisis:file},{withCredentials:true,headers: {"Content-Type": 'multipart/form-data'}})
          
               
                    setAdd(a => !a)
                    alert("upload successfully!")
                    window.location.reload()
                
            }
        } catch (err) {
            alert(err.message)
        }
    }

    const handleDownloadHA = async ()=>{
        try{
            try {
                const response = await axios.get(`http://localhost:5000/api/download_hasil_analisis/${id}`, {
                  responseType: 'arraybuffer',withCredentials:true // Important for receiving binary data
                });

                const blob = new Blob([response.data], { type: 'application/octet-stream' });
          
                // Create a link element and click it to trigger the download
                const str = response.headers["Content-Type"]
                const type = str?.split("/")
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = hasil_analisis?.originalName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } catch (error) {
                console.error('Error downloading file:', error);
              }   
        }catch(err){
            alert(err.message)
        }
    }

    const handleDownloadJP = async ()=>{
        try{
            try {
                const response = await axios.get(`http://localhost:5000/api/download_jurnal_pendukung/${id}`, {
                  responseType: 'arraybuffer',withCredentials:true  // Important for receiving binary data
                });

                const blob = new Blob([response.data], { type: 'application/octet-stream' });
          
                // Create a link element and click it to trigger the download
        
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = jenis_pengujian?.originalName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } catch (error) {
                console.error('Error downloading file:', error);
              }   
        }catch(err){
            alert(err.message)
        }
    }

    useEffect(()=>{
        async function getData(){   
              if(foto_sample.data) {      
                  const buffer = Buffer.from(foto_sample.data);
                  const base64Image = buffer.toString('base64');
                  const contentType = foto_sample.contentType
                  const src = `data:${contentType};base64,${base64Image}`;
                 setFoto(src);
                 setFile(hasil_analisis)
              }
        }
        
      getData()
    },[foto_sample.data])

    

    // const download_foto = async ()=>{
        
    // }
    // const download_jurnal_pendukung = async ()=>{
        
    // }
    // const download_hasil_analisis = async ()=>{
        
    // }

    return (
        <>  <h1 className="bg-red-600 rounded p-2 text-white">{index}</h1>
            <br />
            <div className="border-1 rounded grid grid-cols-2">
            <div>
                    <h1 className="text-lg font-semibold text-grey-600">kode pengujian : </h1>
                    <h1>{kode_pengujian}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">nama sample : </h1>
                    <h1>{nama_sample}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">jumlah sample : </h1>
                    <h1>{jumlah_sample}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">jenis pengujian sample : </h1>
                    <h1>{jenis_pengujian}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">wujud sample : </h1>
                    <h1>{wujud_sample}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">pelarut : </h1>
                    <h1>{pelarut}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">preparasi khusus : </h1>
                    <h1>{preparasi_khusus?"ya":"tidal"}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">target senyawa : </h1>
                    <h1>{target_senyawa}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">metode parameter : </h1>
                    <h1>{metode_parameter}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">deskripsi : </h1>
                    <h1>{deskripsi}</h1>
                </div>

            </div>
            <br />
            <div>

                <div>
                    <h1 className="text-lg font-semibold text-grey-600">foto sample : </h1>
                    {foto_sample?<img src={foto} alt="foto sample" className="w-96 h-48"/>:<p>-</p>}
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-grey-600">jurnal pendukung : </h1>
                    {jurnal_pendukung ? <Button color="failure" size={5} onClick={handleDownloadJP}>download</Button> : <p>-</p>}
                </div>

                <div>
                    <div className="flex">
                    <h1 className="text-lg font-semibold text-grey-600">Hasil analisis : </h1>
                    {add ? <div className="flex"><button onClick={handleConfirm} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Kirim</button><button onClick={() => setAdd(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">Cancel</button></div> : <button onClick={() => setAdd(a => !a)} className="bg-blue-400 text-white px-2 py-1 rounded-lg">upload file hasil analisis</button>}
                    </div>
                    
                    {add ? <input type="file" name="file" onChange={(e)=>{setFile(e.target.files[0])
                         console.log(e.target.files[0])}}  /> : (hasil_analisis?<Button color="failure" size={5} onClick={handleDownloadHA}>download</Button>:<p>-</p>)}
                </div>

            </div>
        </>
    )
}