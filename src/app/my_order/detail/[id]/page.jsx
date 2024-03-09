"use client"

import { useEffect, useState } from "react"
import OrderCard from "@/components/OrderCard"
import { Button } from 'flowbite-react';
import axios from 'axios'
import month_bahasa from '@/utils/month_bahasa'
import Navigasi from '@/components/Navigasi'


export default function Detail({ params, searchParams }) {
  const { id } = params
  const { no_invoice } = searchParams
  const [order, setOrder] = useState([])
  const [invoice, setInvoice] = useState({})
  const [buktiPembayaran, setBuktiPembayaran] = useState('')

  function timeNow() {
    var d = new Date(),
      h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
      m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    return h + ':' + m;
  }

  const handleBukti = async (e) => {
    e.preventDefault()
    try {
      const data = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/bukti_pembayaran/${id}`, {bukti_pembayaran: buktiPembayaran}, { withCredentials: true, headers: { "Content-Type": 'multipart/form-data' }  })
      if (data.data=='success') {
        alert('sukses dikirim')
        window.location.reload()
      }

    } catch (err) {
      alert(err.message)
    }
  }

  const downloadInvoice = async (e) => {
    try {

      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/generate_invoice?no_invoice=${no_invoice}`, { withCredentials: true, responseType: 'blob' });
 

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/octet-stream' });

      // Create a link element and click it to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_invoice.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.message)
    }
  }

  const downloadKuitansi = async (e) => {
    try {

      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/generate_kuitansi?no_invoice=${no_invoice}`, { withCredentials: true, responseType: 'blob' });
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/octet-stream' });

      // Create a link element and click it to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_kuitansi.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.message)
    }
  }




  const downloadBuktiTransfer = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/download_bukti_pembayaran/${id}`, { withCredentials: true, responseType: 'arraybuffer', withCredentials: true });
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/octet-stream' });

      // Create a link element and click it to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = invoice?.bukti_pembayaran
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const resizeImage = (file, maxWidth, maxHeight, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                callback(blob);
            }, file.type);
        };
    };
};

const handleBuktiPembayaran = (e)=>{
  const file = e.target.files[0];
        if (file) {
            resizeImage(file, 300, 300, (resizedBlob) => {
                setBuktiPembayaran(URL.createObjectURL(resizedBlob));
            });
        }
}

  useEffect(() => {
    async function getInvoice() {
      try {


        const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`, { withCredentials: true })
        const dataOrder = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}&skip=0&limit=20`, { withCredentials: true })


        console.log(data)
        if (data.data.success) {
          setInvoice(data.data.data)


        }
        if (dataOrder.data.success) {
          setOrder(dataOrder.data.data)
        }

      } catch (err) {
        console.log(err.message)
      }
    }
    getInvoice()
  }, [])

  



  return (
    <>
      <div>
      <Navigasi text1={"user"} text2={'detail order'}/>

        <div className="md:mx-20 mx-5">
          <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-2">
            <div className="">
              <div className="border-2 rounded-lg p-2 border-b-2 grid grid-cols-2  "><p className="md:text-xl sm:text-xl text-lg font-semibold">status : </p><p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs my-auto">{invoice?.status}</p>
            </div>
              {invoice?.status == "form dikonfirmasi" ? <p >*kirim sample ke (Laboratorium Kimia Instrumen Universitas Pendidikan Indonesia Gedung
            JICA &#40; FPMIPA-A &#41; Lt. 5 Jl. Dr. Setiabudhi No. 229 Bandung
            40154)</p> : ""}
            </div>

            <div >
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-lg font-semibold">total harga  : </p><p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">Rp.{invoice?.total_harga}</p></div>
            {invoice?.status == "form dikonfirmasi" ? <p ></p> : ""}
            </div>
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-lg font-semibold ">estimasi selesai : </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">{invoice.estimasi_date ? invoice.estimasi_date : ""}</p></div>

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-lg font-semibold">invoice : </p>{invoice.status == "form dikonfirmasi" || invoice.status == "sample diterima admin" || invoice.status == "sample dikerjakan operator" || invoice.status == "menunggu verifikasi" || invoice.status == "menunggu pembayaran" || invoice.status == "menunggu konfirmasi pembayaran" || invoice.status == "selesai" ? <Button className="ml-5 " color="blue" size={5} onClick={downloadInvoice}>download invoice</Button> : <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">-</p>}</div>


            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-lg font-semibold ">kuitansi : </p>{ invoice?.status == "selesai" ? <Button className="ml-5" color="blue" size={5} onClick={downloadKuitansi}>download kuitansi</Button> : <p className="ml-5">-</p>}</div>



            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-lg font-semibold ">bukti pembayaran : </p> {invoice?.status == "menunggu pembayaran" || invoice?.status == "menunggu konfirmasi pembayaran" || invoice?.status == "selesai" ? invoice.bukti_pembayaran?<Button className="ml-5" color="blue" size={5} onClick={downloadBuktiTransfer}>download bukti pembayaran</Button> :<div className="flex"><input className="ml-5 w-10/12 h-10/12" type="file" name="bukti_pembayaran" onChange={handleBuktiPembayaran} /><Button className="ml-5" color="blue" size={5} onClick={handleBukti}>kirim</Button></div> : <p className="ml-5">-</p>} </div>

          </div>
        </div>
        <div className="md:mx-20 mx-5">
          {order.map((e, i) => {
           
            return <OrderCard key={i} riwayat_pengujian={e.riwayat_pengujian} sample_dikembalikan={e.sample_dikembalikan} uuid={e.uuid} id={e._id} status={invoice?.status} jenis_pengujian={e.jenis_pengujian} nama_sample={e.nama_sample} kode_pengujian={e.kode_pengujian} jumlah_sample={e.jumlah_sample} index={i + 1} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_khusus={e.preparasi_khusus} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} deskripsi={e.deskripsi_sample} hasil_analisis={e.hasil_analisis} foto_sample={e.foto_sample} />
          })}
        </div>
      </div>
    </>
  )

}