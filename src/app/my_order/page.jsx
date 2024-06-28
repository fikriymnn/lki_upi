"use client";
import InvoiceCard from "@/components/InvoiceCard";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Pagination } from "flowbite-react";
import Navigasi from "@/components/Navigasi";

export default function My_order() {
  const [invoice, setInvoice] = useState([]);
  const [page, setPage] = useState(0);
  const [length, setLength] = useState(0);

  useEffect(() => {
    async function getInvoice() {
      try {
        const token = localStorage.getItem('access_token')
        const dataUser = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
          { withCredentials: true }
        );

        if (dataUser.data.success) {
          const data = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/api/invoice?id_user=${
              dataUser.data.data._id
            }&skip=${page * 15}&limit=15&success=false`,
            { withCredentials: true }
          );

          if (data.data.success) {
            setInvoice(data.data.data);
            setLength(data.data.length_total);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getInvoice();
  }, [page]);
  return (
    <>
      <div>
        <Navigasi text1={"user"} text2={"my order"} />

        <div className="m-auto w-11/12">
          <div className=" overflow-x-scroll w-full">
            <Table className="">
              <Table.Head>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs ">
                  No
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Tanggal
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  No Invoice
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Jenis Pengujian
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Harga
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Keterangan
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                  Status
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {invoice.map((value, i) => {
                  return (
                    <Table.Row
                      key={i}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center md:text-[11px] sm:text-[11px] text-xs">
                        {(i + 1)+(page*15)}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">{`${value.date_format}`}</Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                        {value.no_invoice}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                        {value.jenis_pengujian}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                        {value.total_harga !== 0 ? value.total_harga : "-"}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-xs">
                        <a
                          href={`/my_order/detail/${value._id}?no_invoice=${value.no_invoice}`}
                          className="font-medium text-white grad rounded-lg py-1 px-2 hover:underline dark:text-cyan-500 md:text-[11px] sm:text-[11px] text-xs"
                        >
                          Detail
                        </a>
                      </Table.Cell>
                      <Table.Cell className="text-center gap-2">
                        <p className="text-center">{value.status}</p>
                        <br />
                        <a
                          href={`/my_order/tracking/${value._id}?no_invoice=${value.no_invoice}`}
                          className="font-medium text-white grad rounded-lg py-1 px-2 hover:underline dark:text-cyan-500 md:text-[11px] sm:text-[11px] text-xs"
                        >
                          Detail
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </div>
        <br />

        <p className=" text-center mb-2 text-red-600">page : {page + 1}</p>
        <div className="flex justify-center">
          <div className="m-auto flex items-center">
            <div className="flex overflow-x-auto sm:justify-center">
              <Pagination
                currentPage={page}
                totalPages={parseInt(Math.ceil(length / 15).toFixed())}
                onPageChange={(a) => {
                  console.log(a);
                  setPage(a - 1);
                }}
              />
            </div>
          </div>
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
  );
}
