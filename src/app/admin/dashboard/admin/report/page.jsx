"use client"
import { Table } from 'flowbite-react';
import { Button } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import month_bahasa from '@/utils/month_bahasa'
import { Pagination } from 'flowbite-react';

const kode = [
  {
    jenis_pengujian: "GCFID",
    kode_pengujian: "FID",
  },
  {
    jenis_pengujian: "GCMS",
    kode_pengujian: "MS"
  },
  {
    jenis_pengujian: "NMR",
    kode_pengujian: "NMR"
  },
  {
    jenis_pengujian: "AAS",
    kode_pengujian: "AS"
  },
  {
    jenis_pengujian: "FTIR",
    kode_pengujian: "IR"
  },
  {
    jenis_pengujian: "TG DTA",
    kode_pengujian: "TG"
  },
  {
    jenis_pengujian: "HPLC",
    kode_pengujian: "HP"
  },
  {
    jenis_pengujian: "UV VIS",
    kode_pengujian: "UV"
  },
  {
    jenis_pengujian: "Freezdry",
    kode_pengujian: "FD"
  },
  {
    jenis_pengujian: "LCMSMS",
    kode_pengujian: "LC"
  },

]

const monthOption = [

  "Januari",

  "Februari",

  "Maret",

  "April",

  "Mei",

  "Juni",

  "Juli",

  "Agustus",

  "September",

  "Oktober",

  "November",

  "desember"
]


export default function Report() {
  const [order, setOrder] = useState([])
  const tableRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0)
  const [length, setLength] = useState(0)
  const [yearOption, setYearOption] = useState([])
  const [year, setYear] = useState(0)
  const [month, setMonth] = useState('')
  const [jenis_pengujian, setJenis_pengujian] = useState('')





  useEffect(() => {

    let arr = []
    const yearMax = (new Date().getFullYear() - 2023)
    for (let i = 0; i < yearMax; i++) {
      arr.push(2024 + i)
      setYearOption(arr)
    }
    async function getInvoice() {
      try {

        console.log('S')

        setLoading(true)
        const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order?report=true&skip=${page * 50}&limit=50${month ? `&month=${month}` : ""}${year ? `&year=${year}` : ""}${jenis_pengujian ? `&jenis_pengujian=${jenis_pengujian}` : ""}`, { withCredentials: true })
        // const dataReport = await axios.get(`http://localhost:5000/api/order?${month?`&month=${month}`:""}${year?`&year=${year}`:""}${jenis_pengujian?`&jenis_pengujian=${jenis_pengujian}`:""}`, { withCredentials: true })
        console.log(data.data)
        if (data.data.success) {
          setOrder(data.data.data)
          setLength(data.data.length_total)
          setLoading(false)
          console.log(Math.ceil(length / 50))
          console.log(parseInt(Math.ceil(length / 50).toFixed()))

        }
      } catch (err) {
        console.log(err.message)
      }
    }
    getInvoice()
  }, [year, jenis_pengujian, month, page])
  return (
    <>
      <p className='text-center text-4xl font-bold text-gray-800 mt-7'>REPORT</p>
      <div className='flex justify-center'>
        <hr className='grad rounded-lg h-2 mb-8 mt-5 w-56 text-center' />
      </div>


      <br />
      <div>
        <div>
          <DownloadTableExcel
            filename={`report_${new Date().toISOString()}`}
            sheet={`${month_bahasa(new Date().getMonth())} ${new Date().getFullYear()}`}
            currentTableRef={tableRef.current}
          >
            <Button color="failure" size={5} className='ml-10 p-2  grad'>download report excel</Button>
          </DownloadTableExcel>
          <div className='flex mt-10 md:justify-center sm:justify-center md:justify-items-center  sm:flex flex-wrap  ml-2 md:w-full sm:w-full gap-1 justify-center'>
            <div className='flex p-1 mt-2  justify-between grad rounded-lg '>
              <p className='md:text-lg sm:text-base text-xs font-semibold text-white p-2'>Tahun : </p> <select className='p-2 ml-3 w-20 h-10' name="year" id="year" onChange={(e) => setYear(e.target.value)}>
                <option value="" className='input-style-lki' defaultChecked>all</option>
                {yearOption.map((v, i) => {
                  return <option value={v} key={i}>{v}</option>

                })}
              </select></div>

            <div className=' flex mt-2 p-1  justify-between grad rounded-lg md:ml-3 sm:ml-3 '>
              <p className='md:text-lg sm:text-base text-xs font-semibold text-white p-2'>Bulan : </p><select className='p-2 ml-3' name="bulan" id="bulan" onChange={(e) => setMonth(e.target.value)}>
                <option value="" className='input-style-lki' defaultChecked>all</option>
                {monthOption.map((v, i) => {
                  return <option value={i} key={i} defaultValue>{v}</option>
                })}
              </select></div>
            <div className='flex p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3'><p className='md:text-lg sm:text-base text-xs font-semibold text-white p-2'>Jenis Pengujian : </p> <select className='p-1 ' name="jenis_pengujian" id="jp" onChange={(e) => setJenis_pengujian(e.target.value)}>
              <option value="" className='input-style-lki' defaultChecked>all</option>
              {kode.map((v, i) => {
                return <option value={v.jenis_pengujian} key={i} >{v.jenis_pengujian}</option>
              })}
            </select></div>
          </div>
          <br />
          <div className='w-full overflow-scroll md:h-96 h-56' >
            <table ref={tableRef} className='m-auto table-auto'>
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
                  <th className='px-10 text-sm'>Sample dikembalikan</th>
                  <th className='px-10 text-sm'>Deskripsi</th>
                  <th className='px-10 text-sm'>Riwayat pengujian</th>
                </tr>
                {loading ? <p className='text-center mt-10'>loading</p> : order.map((a, i) => {
                  return (

                    <tr key={i} >
                      <td className='text-center text-xs'>{i + 1}</td>
                      <td className='text-center text-xs'>{a.date_format}</td>
                      <td className='text-center text-xs'>{a.no_invoice}</td>
                      <td className='text-center text-xs'>{a.kode_pengujian}</td>
                      <td className='text-center text-xs'>{a.id_user[0].nama_lengkap}</td>
                      <td className='text-center text-xs'>{a.id_user[0].jenis_institusi}</td>
                      <td className='text-center text-xs'>{a.id_user[0].nama_institusi}</td>
                      <td className='text-center text-xs'>{a.id_user[0].fakultas}</td>
                      <td className='text-center text-xs'>{a.id_user[0].program_studi}</td>
                      <td className='text-center text-xs'>{a.id_user[0].email}</td>
                      <td className='text-center text-xs'>{a.id_user[0].no_telp}</td>
                      <td className='text-center text-xs'>{a.id_user[0].no_whatsapp}</td>
                      <td className='text-center text-xs'>{a.nama_sample}</td>
                      <td className='text-center text-xs'>{a.jenis_pengujian}</td>
                      <td className='text-center text-xs'>{a.jumlah_sample}</td>
                      <td className='text-center text-xs'>{a.wujud_sample}</td>
                      <td className='text-center text-xs'>{a.pelarut}</td>
                      <td className='text-center text-xs'>{a.preparasi_khusus ? "ya" : "tidak"}</td>
                      <td className='text-center text-xs'>{a.target_senyawa}</td>
                      <td className='text-center text-xs'>{a.metode_parameter}</td>
                      <td className='text-center text-xs'>{a.sample_dikembalikan}</td>
                      <td className='text-center text-xs'>{a.deskripsi_sample}</td>
                      <td className='text-center text-xs'>{a.riwayat_pengujian}</td>

                    </tr>)
                })}
              </tbody>
            </table>
            {order ? "" : <p className='text-center'>loading</p>}
          </div>

        </div>
      </div>
      <br />
      <p className=' text-center mb-2 text-red-600'>page : {page + 1}</p>
      <div className='m-auto flex items-center justify-center'>
      <div className="flex overflow-x-auto sm:justify-center">
      <Pagination currentPage={page} totalPages={parseInt(Math.ceil(length / 50).toFixed())} onPageChange={(a)=>{console.log(a); setPage(a-1)}} />
    </div>
    </div>


      <br />
      <br />
      <br />

    </>
  )
}