"use client"
import InvoiceCard from "@/components/InvoiceCard"
import { Table } from 'flowbite-react';
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';

export default function My_order() {
  const [invoice, setInvoice] = useState([])
  const [page, setPage] = useState(0)
  const [length, setLength] = useState(0)

  useEffect(() => {
    async function getInvoice() {
      try {
        const dataUser = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`, { withCredentials: true })
        
        if (dataUser.data.success) {
      
          const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/invoice?id_user=${dataUser.data.data._id}&skip=${page * 15}&limit=15&success=false`, { withCredentials: true })
         
          if (data.data.success) {
            setInvoice(data.data.data)
            setLength(data.data.length_total)
          }
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
        <p className='text-center md:text-3xl text-xl text-lg font-bold text-gray-800 mt-7'>MY ORDER</p>
        <div className='flex justify-center'>
          <hr className='text-red-700 grad md:h-2 h-1 md:mb-8 sm:mb-4 mb-2 md:mt-5 sm:mt-3 mt-2 md:w-56 sm:w-32 w-16 text-center' />
        </div>

        <div className="m-auto w-11/12">
          <div className=" overflow-scroll w-full">
            <Table className="">
              <Table.Head>
                <Table.HeadCell className="text-center md:text-lg sm:text-lg text-xs ">No</Table.HeadCell>
                <Table.HeadCell className="text-center md:text-lg sm:text-lg text-xs">Tanggal</Table.HeadCell>
                <Table.HeadCell className="text-center md:text-lg sm:text-lg text-xs">No Invoice</Table.HeadCell>
                <Table.HeadCell className="text-center md:text-lg sm:text-lg text-xs">
                  Harga
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-lg sm:text-lg text-xs">
                  Keterangan
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-lg sm:text-lg text-xs">
                  Status
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {
                  invoice.map((value, i) => {
                    return (
                      <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">

                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center">
                          {i + 1}
                        </Table.Cell>
                        <Table.Cell className="text-center md:text-lg sm:text-lg text-xs">{`${value.date_format}`}</Table.Cell>
                        <Table.Cell className="text-center md:text-lg sm:text-lg text-xs">{value.no_invoice}</Table.Cell>
                        <Table.Cell className="text-center md:text-lg sm:text-lg text-xs">
                          {value.total_harga !== 0 ? value.total_harga : "-"}
                        </Table.Cell>
                        <Table.Cell className="text-center md:text-lg sm:text-lg text-xs">
                          <a href={`/my_order/detail/${value._id}?no_invoice=${value.no_invoice}`} className="font-medium text-white grad rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                            Detail
                          </a>
                        </Table.Cell>
                        <Table.Cell className="text-center gap-2">
                          <p className="text-center">{value.status}</p>
                          <br />
                          <a href={`/my_order/tracking/${value._id}?no_invoice=${value.no_invoice}`} className="font-medium text-white grad rounded-lg py-1 px-2 hover:underline dark:text-cyan-500">
                            Detail
                          </a>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })
                }
              </Table.Body>
            </Table>
          </div>
        </div>
        <br />

    <p className=' text-center mb-2 text-red-600'>page : {page+1}</p>
      <div className='m-auto flex items-center'>

        <ReactPaginate
          className="m-auto text-red-600 flex md:w-56 sm:w-40 w-40 justify-evenly"
          breakLabel="..."
          nextLabel={<p className="inline md:px-3 md:py-1 md:mb-2 px-1 py-1 mb-1 md:text-lg sm:text-base text-xs text-white bg-red-600 rounded">{"next >"}</p>}
          onPageChange={(e) => { setPage(e.selected); console.log(e.selected) }}
          pageRangeDisplayed={3}
          pageCount={parseInt(Math.ceil(length / 15).toFixed())}
          previousLabel={
            <p className="inline md:px-3 md:py-1 md:mt-2 px-1 py-1 mt-1 text-white md:text-lg sm:text-base text-xs bg-red-600 rounded">{"< prev"}</p>
          }
          renderOnZeroPageCount={null}
        />
       </div> 

        <br />
        <br />
        <br />
        <br />
        <br />


        {/* <div>
                <InvoiceCard list_sample={["asa","bbd"]} invoice={"12asndaj23"} tanggal={"17 agustus"} index={1}/>
                <InvoiceCard list_sample={["asa","tt ","aaks"]} invoice={"1se2asndaj2e3"} tanggal={"20 agustus"} index={2}/>

            </div> */}
      </div>
    </>
  )
}