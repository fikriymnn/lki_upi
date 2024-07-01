"use client";
import InvoiceCard from "@/components/InvoiceCard";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Pagination } from "flowbite-react";
import Navigasi from "@/components/Navigasi";
import { useRouter } from "next/navigation";

const kode = [
  {
    jenis_pengujian: "GCFID",
    kode_pengujian: "FID",
  },
  {
    jenis_pengujian: "GCMS",
    kode_pengujian: "MS",
  },
  {
    jenis_pengujian: "NMR",
    kode_pengujian: "NMR",
  },
  {
    jenis_pengujian: "AAS",
    kode_pengujian: "AS",
  },
  {
    jenis_pengujian: "FTIR",
    kode_pengujian: "IR",
  },
  {
    jenis_pengujian: "TG DTA",
    kode_pengujian: "TG",
  },
  {
    jenis_pengujian: "HPLC",
    kode_pengujian: "HP",
  },
  {
    jenis_pengujian: "UV VIS",
    kode_pengujian: "UV",
  },
  {
    jenis_pengujian: "Freezdry",
    kode_pengujian: "FD",
  },
  {
    jenis_pengujian: "LCMSMS",
    kode_pengujian: "LC",
  },
  {
    jenis_pengujian: "XRD",
    kode_pengujian: "XRD",
  },
];

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

  "Desember",
];

export default function HHistory_order() {
  const router = useRouter()
  const [invoice, setInvoice] = useState([]);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [page, setPage] = useState(0);
  const [jenis_pengujian, setJenis_pengujian] = useState("");
  const [length, setLength] = useState(0);
  const [yearOption, setYearOption] = useState([]);

  useEffect(() => {
    let arr = [];
    const yearMax = new Date().getFullYear() - 2023;
    for (let i = 0; i < yearMax; i++) {
      arr.push(2024 + i);
      setYearOption(arr);
    }

     async function handleDelete(id){
      async function deleteHistory(){
         try{
            const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,{
              status: 'Sembunyikan'
            },{ withCredentials:true })
            if(data){
              alert('Data telah dihapus!')
              router.refresh()
            }
         }catch(err){
            alert(err.message)
         }
      }
      deleteHistory()
    }

    async function getInvoice() {
      try {
          const data = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/api/invoice?status=Selesai&success=true&skip=${
              page * 15
            }&limit=15${year ? `&year=${year}` : ""}${
              month ? `&month=${month}` : ""
            }${jenis_pengujian ? `&jenis_pengujian=${jenis_pengujian}` : ""}`,
            { withCredentials: true }
          );
          if (data.data.success) {
            setInvoice(data.data.data);
            setLength(data.data.length_total);
          }
        
      } catch (err) {
        console.log(err.message);
      }
    }
    getInvoice();
  }, [year, month, jenis_pengujian, page]);
  return (
    <>
      <div>
        <Navigasi text1={"admin"} text2={"history order"} />
        <div className="flex flex-wrap justify-center mb-10">
          <div className="flex p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 ml-3">
            <p className="md:text-sm sm:text-base text-xs font-semibold text-white p-2">
              Tahun :
            </p>{" "}
            <select
              className="ml-3"
              name="year"
              id="year"
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" defaultChecked className="input-style-lki">
                All
              </option>
              {yearOption.map((v, i) => {
                return (
                  <option value={v} key={i}>
                    {v}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 ml-3 ">
            <p className="md:text-sm sm:text-base text-xs font-semibold text-white p-2">
              Bulan :
            </p>{" "}
            <select
              className="ml-3"
              name="bulan"
              id="bulan"
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="" defaultChecked className="input-style-lki">
                All
              </option>
              {monthOption.map((v, i) => {
                return (
                  <option value={i} key={i} defaultValue>
                    {v}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="md:flex grid grid-cols-2 p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 md:w-72 sm:w-64 w-52">
            <p className="md:text-sm sm:text-base text-xs font-semibold text-white p-2 ">
              Jenis Pengujian :{" "}
            </p>{" "}
            <select
              className="p-1 "
              name="jenis_pengujian"
              id="jp"
              onChange={(e) => setJenis_pengujian(e.target.value)}
            >
              <option value="" className="input-style-lki" defaultChecked>
                All
              </option>
              {kode.map((v, i) => {
                return (
                  <option value={v.jenis_pengujian} key={i}>
                    {v.jenis_pengujian}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="m-auto w-11/12">
          <div className=" overflow-x-scroll w-full">
            <Table border={1}>
              <Table.Head>
                <Table.HeadCell className="text-center md:text-sm sm:text-sm text-xs">
                  No
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-sm sm:text-sm text-xs">
                  Tanggal
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-sm sm:text-sm text-xs">
                  No Invoice
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-sm sm:text-sm text-xs">
                  Nama Customer
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-sm sm:text-sm text-xs">
                  Jenis Pengujian
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-sm sm:text-sm text-xs">
                  Harga
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-sm sm:text-sm text-xs">
                  Status
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-sm sm:text-sm text-xs">
                  Keterangan
                </Table.HeadCell>
                <Table.HeadCell className="text-center md:text-sm sm:text-sm text-xs">
                  Action
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {invoice.map((value, i) => {
                  return (
                    <Table.Row
                      key={i}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {(i + 1)+(page*15)}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-sm sm:text-sm text-xs">{`${value.date_format}`}</Table.Cell>
                      <Table.Cell className="text-center md:text-sm sm:text-sm text-xs">
                        {value.no_invoice}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-sm sm:text-sm text-xs">
                        {value.id_user[0].nama_lengkap}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-sm sm:text-sm text-xs">
                        {value.jenis_pengujian}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-sm sm:text-sm text-xs">
                        {value.total_harga !== 0 ? value.total_harga : "-"}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-sm sm:text-sm text-xs">
                        {value.status}
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-sm sm:text-sm text-xs">
                        <a
                          href={`/admin/dashboard/admin/history_order/detail/${value._id}?no_invoice=${value.no_invoice}`}
                          className="font-medium text-white bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500"
                        >
                          Detail
                        </a>
                      </Table.Cell>
                      <Table.Cell className="text-center md:text-sm sm:text-sm text-xs">
                        <a
                          onClick={(e)=>{
                            async function deleteHistory(id){
                              try{
                                console.log(id)
                                 const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/invoice/${id}`,{
                                   status: 'Sembunyikan'
                                 },{ withCredentials:true })
                                 if(data){
                                   alert('Data telah dihapus!')
                                   router.refresh()
                                 }
                              }catch(err){
                                 alert(err.message)
                              }
                           }
                            deleteHistory(value._id)
                          }}
                          className="font-medium text-white bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500"
                        >
                          Delete
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
        <div className="m-auto flex items-center justify-center">
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
