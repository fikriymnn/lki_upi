'use client'
import AdminOrderCard from "@/components/AdminOrderCard"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from 'flowbite-react';
import month_bahasa from "@/utils/month_bahasa";
import { usePathname } from "next/navigation";


export default function DetailOrderAdmin({ params, searchParams }) {
  const { id } = params
  const [edit, setEdit] = useState(false)
  const { no_invoice } = searchParams
  const [order, setOrder] = useState([])
  const [invoice, setInvoice] = useState({ id_user: {} })
  const [hargaSatuan, setHargaSatuan] = useState([
    { keterangan: "", jumlah: "", hargaSatuan: "" },
  ]);
  const path = usePathname()


  const handleHargaSatuan = (index, field, value) => {
    const updatedData = [...hargaSatuan];
    updatedData[index][field] = value;
    setHargaSatuan(updatedData);
  };

  const addHargaSatuan = () => {
    setHargaSatuan([
      ...hargaSatuan,
      { keterangan: "", jumlah: "", hargaSatuan: "" },
    ]);
  };

  const removeHargaSatuan = (index) => {
    if (hargaSatuan.length === 1) return; // Jangan hapus jika hanya 1 form tersisa
    const updatedData = hargaSatuan.filter((_, i) => i !== index);
    setHargaSatuan(updatedData);
  };

  const downloadInvoice = async (e) => {
    try {

      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/generate_invoice?no_invoice=${no_invoice}`, { withCredentials: true, responseType: 'blob' });
      console.log(response.data)

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/octet-stream' });

      // Create a link element and click it to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_invoice.pdf`;
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
      console.log(response.data)

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/octet-stream' });

      // Create a link element and click it to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${invoice?.id_user?.nama_lengkap.replace(" ", "_")}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}_kuitansi.pdf`;
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
      link.download = invoice?.bukti_pembayaran;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleChange = async (e) => {
    const { value, name } = e.target;
    setInvoice((e) => ({ ...e, [name]: value }));
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setEdit((a) => !a);
    let obj = {
      status: invoice?.status,
      estimasi_date: invoice?.estimasi_date,
      catatan: invoice?.catatan,
      harga_satuan: hargaSatuan,
    };
    try {
      function timeNow() {
        var d = new Date(),
          h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
          m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
        return h + ":" + m;
      }
      const date_format = `${timeNow()} ${new Date().getDate()} ${month_bahasa(
        new Date().getMonth()
      )} ${new Date().getFullYear()}`;

      console.log(date_format)
      function selection() {
        switch (invoice?.status) {
          case "Menunggu Form Dikonfirmasi":
            obj.s1_date = date_format;
            obj.success = false;
            return true;
          case "Form Dikonfirmasi":
            obj.s2_date = date_format;
            obj.success = false;
            return true;
          case "Sample Diterima Admin":
            obj.s2_date = date_format
            obj.s3_date = date_format;
            obj.success = false;
            return true;
          case "Sample Dikerjakan Operator":
            obj.s3_date = date_format;
            obj.s4_date = date_format;
            obj.success = false;
            return true;
          case "Menunggu Verifikasi":
            obj.s5_date = date_format;
            obj.success = false;
            return true;
          case "Menunggu Pembayaran":
            obj.success = true;
            obj.s6_date = date_format;
            return true;
          case "Menunggu Konfirmasi Pembayaran":
            obj.success = true;
            obj.s7_date = date_format;
            return true;
          case "Selesai":
            obj.success = true;
            obj.s8_date = date_format;
            return true;
          case "Order Dibatalkan":
            obj.s8_date = date_format;
            return true;
        }
      }
      if (selection() == true) {
        const data = await axios.put(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,
          obj,
          { withCredentials: true }
        );
        alert("update successfully");
        if (data.data.success) {
          window.location.replace(`/notifikasi?url=${path}?no_invoice=${no_invoice}`);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    async function getnvoice() {
      try {
        console.log(process.env.NEXT_PUBLIC_URL)
        const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`, { withCredentials: true })
        const dataOrder = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}&skip=0&limit=20`, { withCredentials: true })

        if (data.data.success) {
          setInvoice(data.data.data)
          setHargaSatuan(data.data.data.harga_satuan)
          console.log(data.data.data)

        }
        if (dataOrder.data.success) {
          setOrder(dataOrder.data.data)
        }

      } catch (err) {
        console.log(err.message)
      }
    }
    getnvoice()
  }, [])

  const convertRupiah = (angka) => {
    // Konversi angka menjadi string
    let angkaString = angka.toString();

    // Bagi angka menjadi array per 3 digit dari belakang
    let bagianAngka = angkaString.split('').reverse().join('').match(/\d{1,3}/g);

    // Gabungkan kembali dengan titik sebagai pemisah
    return bagianAngka.join('.').split('').reverse().join('');
  }

  return (
    <>
      <p className='text-center md:text-4xl sm:text-3xl text-xl font-bold text-gray-800 mt-7'>EDIT ORDER</p>
      <div className='flex justify-center'>
        <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
      </div>
      <div className="md:mx-20 mx-5">
        <div className=" grid md:grid-cols-2 gap-5">
          <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Nama lengkap : {invoice.nama_lengkap}</p> </div>
          <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Email : {invoice.id_user?.email}</p> </div>
          <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">No whatsapp : {invoice.id_user?.no_whatsapp}</p> </div>
          <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">No telepon : {invoice.id_user?.no_telp}</p> </div>
          <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Nama Institusi : {invoice.id_user?.nama_institusi}</p> </div>
          {invoice.id_user?.jenis_institusi == "Perguruan Tinggi" ? <>
            <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Fakultas : {invoice.id_user?.fakultas}</p> </div>
            <div className="flex input-style-lki"><p className="md:text-lg sm:text-lg text-xs ">Program studi : {invoice.id_user?.program_studi}</p> </div>


          </> : ""}

        </div>
        <br />
        {edit ? (
          <div className="flex gap-5 mt-5">
            <button
              onClick={handleConfirm}
              className="grad text-white px-2 py-1 rounded-lg"
            >
              Konfirmasi
            </button>
            <button
              onClick={() => setEdit((a) => !a)}
              className="grad text-white px-2 py-1 rounded-lg"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEdit((a) => !a)}
            className="grad text-white px-2 py-1 rounded-lg w-40"
          >
            Edit
          </button>
        )}
        <br />
        <br />
        {
          !edit ? <div className="flex flex-col gap-4">

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Estimasi selesai </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">: {invoice.estimasi_date ? invoice.estimasi_date : ""}</p></div>
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">No invoice </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">: {invoice.no_invoice ? invoice.no_invoice : ""}</p></div>

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Status </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">: {invoice.status ? invoice.status : ""}</p></div>
            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Total harga </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">: {invoice.total_harga ? `Rp ${convertRupiah(invoice.total_harga)}` : ""}</p></div>

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Catatan </p> <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">: {invoice.catatan ? invoice.catatan : ""}</p></div>

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold">Invoice </p>{invoice.status == "Form Dikonfirmasi" || invoice.status == "Sample Diterima Admin" || invoice.status == "Sample Dikerjakan Operator" || invoice.status == "Menunggu Verifikasi" || invoice.status == "Menunggu Pembayaran" || invoice.status == "Menunggu Konfirmasi Pembayaran" || invoice.status == "Selesai" ? <Button className="ml-5 " color="blue" size={5} onClick={downloadInvoice}>download</Button> : <p className="ml-3 font-semibold text-gray-600 md:text-base sm:text-sm text-xs">-</p>}</div>

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Kuitansi </p>{invoice?.status == "Selesai" ? <Button className="ml-5" color="blue" size={5} onClick={downloadKuitansi}>download</Button> : <p className="ml-5">-</p>}</div>

            <div className="grid grid-cols-2  border-2 rounded-lg p-2 border-b-2"><p className="md:text-xl sm:text-xl text-xs font-semibold ">Bukti pembayaran </p> {invoice?.bukti_pembayaran ? <Button className="ml-5" color="blue" size={5} href={invoice?.bukti_pembayaran}>download</Button> : ""} </div>
          </div> : <div className="m-auto  w-11/12 border-2 rounded-lg">
            <br />
            <br />
            <div className="md:mx-10 mx-5 flex flex-col gap-3 md:w-6/12 ">
              {edit ? (
                <div>
                  <p className="md:text-lg sm:text-xs text-sm grid grid-cols-2 font-semibold">
                    Status
                    <select
                      name="status"
                      className="font-normal md:text-lg sm:text-xs text-xs"
                      onChange={(e) =>
                        setInvoice((a) => ({
                          ...a,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      value={invoice?.status}
                    >
                      <option value="">pilih</option>
                      <option value="Order Dibatalkan">Batalkan Order</option>
                      <option value="Form Dikonfirmasi">
                        Form Dikonfirmasi
                      </option>
                      <option value="sample diterima admin">sample diterima admin</option>
                      <option value="Sample Dikerjakan Operator">
                        Sample Diterima Admin dan Diproses
                      </option>
                      <option value="Menunggu Verifikasi">Menunggu verifikasi</option>
                      <option value="Menunggu Pembayaran">
                        Menunggu Pembayaran
                      </option>
                      <option value="Selesai">
                        Konfirmasi Pembayaran dan Selesai
                      </option>
                    </select>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="md:text-lg sm:text-xs text-sm font-semibold md:grid grid-cols-2 gap-5 flex">
                    Status  <span className="font-normal md:text-lg sm:text-xs text-xs">{invoice?.status}</span>{" "}
                  </p>
                </div>
              )}
              {edit ? (
                <div>
                  <p className="md:text-lg sm:text-xs text-sm grid grid-cols-2 font-semibold">
                    Total harga {" "}
                    <input
                      type="number"
                      name="total_harga"
                      onChange={handleChange}
                      value={invoice?.total_harga}
                    />
                  </p>
                </div>
              ) : (
                <div>
                  <p className="md:text-lg sm:text-xs text-sm font-semibold md:grid grid-cols-2 gap-5 flex">
                    Total harga {" "}
                    <span className="font-normal md:text-lg sm:text-xs text-xs">Rp.{invoice?.total_harga}</span>
                  </p>
                </div>
              )}
              {edit ? (
                <div>
                  <p className="md:text-lg sm:text-xs text-sm grid grid-cols-2 font-semibold">
                    Tanggal estimasi selesai {" "}
                    <input
                      type="text"
                      name="estimasi_date"
                      onChange={handleChange}
                      value={invoice?.estimasi_date}
                    />
                  </p>
                </div>
              ) : (
                <div>
                  <p className="md:text-lg sm:text-xs text-sm font-semibold md:grid grid-cols-2 gap-5 flex">
                    Tanggal estimasi selesai {" "}
                    <span className="font-normal md:text-lg sm:text-xs text-xs">{invoice?.estimasi_date}</span>{" "}
                  </p>
                </div>
              )}
              {edit ? (
                <div>
                  <p className="md:text-lg sm:text-xs text-sm grid grid-cols-2 font-semibold">
                    Catatan {" "}
                    <textarea
                      placeholder="Tuliskan catatan"
                      className=""
                      name="catatan"
                      type="text"
                      onChange={handleChange}
                      value={invoice?.catatan}
                    />
                    {/* <input
                      type="text"
                      name="catatan"
                      onChange={handleChange}
                      value={invoice?.catatan}
                    /> */}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="md:text-lg sm:text-xs text-sm font-semibold md:grid grid-cols-2 gap-5 flex">
                    Catatan {" "}
                    <span className="font-normal md:text-lg sm:text-xs text-xs">{invoice?.catatan}</span>{" "}
                  </p>
                </div>
              )}
              {edit ? <p className="md:text-lg sm:text-xs text-sm font-semibold md:grid grid-cols-2 gap-5 flex">
                Harga Satuan
              </p> : ""}
              {edit ? hargaSatuan.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-4 border p-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="Keterangan"
                    value={item.keterangan}
                    onChange={(e) => handleHargaSatuan(index, "keterangan", e.target.value)}
                    className="flex-1 p-2 border rounded w-full"
                  />
                  <input
                    type="number"
                    placeholder="Jumlah"
                    value={item.jumlah}
                    onChange={(e) => handleHargaSatuan(index, "jumlah", e.target.value)}
                    className="w-28 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Harga Satuan"
                    value={item.hargaSatuan}
                    onChange={(e) => handleHargaSatuan(index, "hargaSatuan", e.target.value)}
                    className="w-32 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeHargaSatuan(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )) : ""}
              {
                edit ? <div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={addHargaSatuan}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      + Tambah Baris
                    </button>
                  </div>
                </div> : ""
              }
            </div>
            <br />
            <br />
          </div>
        }

      </div>

      <br />
      <div className="md:mx-20 mx-5">
        {
          order.map((e, i) => {
            return (<AdminOrderCard no_invoice={invoice.no_invoice} riwayat_pengujian={e.riwayat_pengujian} sample_dikembalikan={e.sample_dikembalikan} uuid={e.uuid} id={e._id} jenis_pengujian={e.jenis_pengujian} kode_pengujian={e.kode_pengujian} nama_sample={e.nama_sample} jumlah_sample={e.jumlah_sample} index={i + 1} wujud_sample={e.wujud_sample} pelarut={e.pelarut} preparasi_khusus={e.preparasi_khusus} target_senyawa={e.target_senyawa} metode_parameter={e.metode_parameter} jurnal_pendukung={e.jurnal_pendukung} foto_sample={e.foto_sample} deskripsi={e.deskripsi_sample} hasil_analisis={e.hasil_analisis} key={i} lama_pengerjaan={e.lama_pengerjaan} nama_pembimbing={e.nama_pembimbing} />)

          })
        }
      </div>
    </>
  )
}