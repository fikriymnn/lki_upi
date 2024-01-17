"use client"
import { Table } from 'flowbite-react';
import { Button } from 'flowbite-react';
import {useEffect, useRef,useState} from 'react';
import { useDownloadExcel } from 'react-export-table-to-excel';
import axios from 'axios'
export default function Report() {
  const [order,setOrder] = useState([])
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
      filename: `report${new Date().getFullYear()}`,
      sheet: `${new Date().getFullYear()}`,
      currentTableRef: tableRef.current,
  })

  useEffect(()=>{
    async function getInvoice() {
      try {
          const data = await axios.get(`http://localhost:5000/api/order`, { withCredentials: true })

          if (data.data.success) {
            setOrder(data.data.data)

          }
      } catch (err) {
        console.log(err.message)
      }
    }
    getInvoice()
  },[])
    return (
        <>
             <p className='text-center text-4xl font-bold text-gray-800 mt-7'>REPORT</p>
                      <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>
   
           
            <br/>
        <div>
        <div>
        <Button color="failure" size={5} className='ml-10' onClick={onDownload}>download report excel</Button>
               <div className='w-full overflow-scroll'>
               <table  ref={tableRef} className='m-auto table-auto'>
                  <tbody>
                  <tr>
                        <th className='px-10 text-sm'>No</th>
                        <th className='px-10 text-sm'>Tanggal</th>
                        <th className='px-10 text-sm'>No invoice</th>
                        <th className='px-10 text-sm'>Kode Pengujian</th>
                        <th className='px-10 text-sm'>Nama</th>
                        <th className='px-10 text-sm'>Jenis Institusi</th>
                        <th className='px-10 text-sm'>Nama Institusi</th>
                        <th className='px-10 text-sm'>Fakultas</th>
                        <th className='px-10 text-sm'>Program Studi</th>
                        <th className='px-10 text-sm'>Email</th>
                        <th className='px-10 text-sm'>No telepon</th>
                        <th className='px-10 text-sm'>No Whatsapp</th>
                        <th className='px-10 text-sm'>Nama Sample</th>
                        <th className='px-10 text-sm'>Jenis Pengujian</th>  
                        <th className='px-10 text-sm'>Jumlah Sample</th>
                        <th className='px-10 text-sm'>Wujud Sample</th>
                        <th className='px-10 text-sm'>Pelarut</th>
                        <th className='px-10 text-sm'>Preparasi Khusus</th>
                        <th className='px-10 text-sm'>Target Senyawa</th>
                        <th className='px-10 text-sm'>Metode Parameter</th>
                    </tr>
                    {order.map((a,i)=>{
                      return ( 
                      <tr>
                        <td className='text-center text-xs'>{i+1}</td>
                        <td className='text-center text-xs'>{a.date_format}</td>
                        <td className='text-center text-xs'>{a.no_invoice}</td>
                        <td className='text-center text-xs'>{a.kode_pengujian}</td>
                        <td className='text-center text-xs'>{a.id_user.nama_lengkap}</td>
                        <td className='text-center text-xs'>{a.id_user.jenis_institusi}</td>
                        <td className='text-center text-xs'>{a.id_user.nama_institusi}</td>
                        <td className='text-center text-xs'>{a.id_user.fakultas}</td>
                        <td className='text-center text-xs'>{a.id_user.program_studi}</td>
                        <td className='text-center text-xs'>{a.id_user.email}</td>
                        <td className='text-center text-xs'>{a.id_user.no_telp}</td>
                        <td className='text-center text-xs'>{a.id_user.no_whatsapp}</td>
                        <td className='text-center text-xs'>{a.nama_sample}</td>
                        <td className='text-center text-xs'>{a.jenis_pengujian}</td>
                        <td className='text-center text-xs'>{a.jumlah_sample}</td>
                        <td className='text-center text-xs'>{a.wujud_sample}</td>
                        <td className='text-center text-xs'>{a.pelarut}</td>
                        <td className='text-center text-xs'>{a.preparasi_khusus?"ya":"tidak"}</td>
                        <td className='text-center text-xs'>{a.target_senyawa}</td>
                        <td className='text-center text-xs'>{a.metode_parameter}</td>
                        
                    </tr>)
                    })}
                  </tbody>
                </table>
               </div>
                 
            </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      
        </>
    )
}