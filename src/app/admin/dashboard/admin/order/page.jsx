'use client'
import AdminInvoiceCard from "@/components/AdminInvoiceCard"
import { useState,useEffect } from "react"
import { Table } from 'flowbite-react';
import axios from "axios"
import ReactPaginate from 'react-paginate';

export default function Order() {

  const [invoice, setInvoice] = useState([])
  const [page,setPage] = useState(0)
  const [length,setLength] = useState(0)

  useEffect(() => {
    async function getInvoice() {
      try {
          const data = await axios.get(`http://localhost:5000/api/invoice?success=false&skip=${page*15}&limit=15`, { withCredentials: true })
          console.log(data.data)
          if (data.data.success) {
            setInvoice(data.data.data)
            setLength(data.data.length_total)
          }
      } catch (err) {
        console.log(err.message)
      }
    }
    getInvoice()
  }, [page])
  return (
    <>
      <p className='text-center text-4xl font-bold text-gray-800 mt-7'>ORDER</p>
      <div className='flex justify-center'>
        <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
      </div>
      <div className="mx-20">
        <Table>
          <Table.Head>
            <Table.HeadCell>No</Table.HeadCell>
            <Table.HeadCell>Tanggal</Table.HeadCell>
            <Table.HeadCell>Invoice</Table.HeadCell>
            <Table.HeadCell>
              Harga
            </Table.HeadCell>
            <Table.HeadCell>
              Keterangan
            </Table.HeadCell>
            <Table.HeadCell>
              Status
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
                    <Table.Cell>{v.date}</Table.Cell>
                    <Table.Cell>{v.no_invoice}</Table.Cell>
                    <Table.Cell>{v.harga}</Table.Cell>
                    <Table.Cell>
                      <a href={`/admin/dashboard/admin/order/${v._id}?no_invoice=${v.no_invoice}`} className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                        keterangan
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                    <p>{v.status}</p>
                    <br/>
                      <a href={`/admin/dashboard/admin/order/tracking/${v._id}`} className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
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
        breakLabel="..."
        nextLabel="next >"
        onPageChange={(e)=>{setPage(e.selected);console.log(e.selected)}}
        pageRangeDisplayed={5}
        pageCount={parseInt(Math.ceil(length/15).toFixed())}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
      <br />
      <br />
      <br />
      <br />
    </>
  )
}

