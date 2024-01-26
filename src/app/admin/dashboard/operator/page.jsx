"use client"
import { Table } from 'flowbite-react';
import { useState,useEffect } from "react"
import axios from "axios"
import ReactPaginate from 'react-paginate';


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

export default function Order_Operator(){
  const [invoice, setInvoice] = useState([])
  const [jenis_pengujian, setJenis_pengujian] = useState('')
  const [year, setYear] = useState(0)
  const [month,setMonth] = useState(0)
  const [page,setPage] = useState(0)

  useEffect(() => {
    async function getInvoice() {
      try {
          const data = await axios.get(`http://localhost:5000/api/invoice?status=sample dikerjakan operator${jenis_pengujian?`&jenis_pengujian=${jenis_pengujian}`:''}${year?`&year=${year}`:''}${month?`&month=${month}`:''}&skip=${page*15}&limit=15`, { withCredentials: true })
          if (data.data.success) {
            setInvoice(data.data.data)
          }
      } catch (err) {
        console.log(err.message)
      }
    }
    getInvoice()
  }, [year,month,page,jenis_pengujian])
    return(
      <>
      <p className='text-center text-4xl font-bold text-gray-800 mt-7'>OPERATOR ORDER</p>
      <div className='flex justify-center'>
        <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
      </div>
      <div className='flex justify-center'>
            <div className='flex items-center'>Tahun : <select className='ml-3' name="year" id="year" onChange={(e) => setYear(e.target.value)}>
              <option value="" defaultChecked>all</option>
              {yearOption.map((v, i) => {
                  return <option value={v} key={i}>{v}</option>
                
              })}
            </select></div>
            <div className='flex items-center ml-3'>Bulan : <select className='ml-3' name="bulan" id="bulan" onChange={(e) => setMonth(e.target.value)}>
              <option value="" defaultChecked>all</option>
              {monthOption.map((v, i) => {
                  return <option value={i} key={i} defaultValue>{v}</option>               
              })}
            </select></div>
            <div className='flex items-center ml-3'>Jenis Pengujian : <select className='ml-3' name="jenis_pengujian" id="jp" onChange={(e) => setJenis_pengujian(e.target.value)}>
              <option value="" defaultChecked>all</option>
              {kode.map((v, i) => {
                return <option value={v.jenis_pengujian} key={i} >{v.jenis_pengujian}</option>
              })}
            </select></div>
          </div>
      <div className="mx-20">
        <Table>
          <Table.Head>
            <Table.HeadCell>No</Table.HeadCell>
            <Table.HeadCell>Tanggal</Table.HeadCell>
            <Table.HeadCell>Invoice</Table.HeadCell>
            <Table.HeadCell>
              status
            </Table.HeadCell>
            <Table.HeadCell>
              detail
            </Table.HeadCell>
            <Table.HeadCell>
              konfirmasi
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              invoice.map((v, i) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {i+1}
                    </Table.Cell>
                    <Table.Cell>{v.date_format}</Table.Cell>
                    <Table.Cell>{v.no_invoice}</Table.Cell>
                    <Table.Cell>
                    <p>{v.status}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <a href={`/admin/dashboard/operator/detail/${v._id}?no_invoice=${v.no_invoice}`} className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                        keterangan
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                      <a href={`/admin/dashboard/operator/${v._id}`} className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                        keterangan
                      </a>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }

          </Table.Body>
        </Table>
      </div>
      <br />
      <ReactPaginate
      className="m-auto text-red-600"
        breakLabel="..."
        nextLabel={<p className="inline mb-2 px-3 py-1 text-white bg-red-600">{"next >"}</p>}
        onPageChange={(e)=>{setPage(e.selected);console.log(e.selected)}}
        pageRangeDisplayed={3}
        pageCount={parseInt(Math.ceil(length/15).toFixed())}
        previousLabel={
          <p className="inline  px-3 py-1 mt-2 text-white bg-red-600">{"< prev"}</p>
   }
        renderOnZeroPageCount={null}
      />
      <br />
      <br />
      <br />
      <br />
    </>
    )
}