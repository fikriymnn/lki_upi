"use client";
import AdminInvoiceCard from "@/components/AdminInvoiceCard";
import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Pagination } from "flowbite-react";
import Navigasi from "@/components/Navigasi";

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

const stats = [
  {
    status: "menunggu form dikonfirmasi",
  },
  {
    status: "Sample Dikerjakan Operator",
  },
  {
    status: "Menunggu Verifikasi",
  },
  {
    status: "Menunggu Pembayaran",
  },
  {
    status: "Menunggu Konfirmasi Pembayaran",
  },
  {
    status: "Selesai",
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

export default function Order() {
  const [invoice, setInvoice] = useState([]);
  const [page, setPage] = useState(0);
  const [length, setLength] = useState(0);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [jenis_pengujian, setJenis_pengujian] = useState("");
  const [status, setStatus] = useState("");
  const [yearOption, setYearOption] = useState([]);
  const [search, setSearch] = useState("")

  const handleSearch = async () => {
    try {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/invoice?skip=${page * 15
        }&limit=15${year ? `&year=${year}` : ""}${month ? `&month=${month}` : ""
        }${jenis_pengujian ? `&jenis_pengujian=${jenis_pengujian}` : ""}${status ? `&status=${status}` : "status=menunggu form dikonfirmasi&status=Sample Dikerjakan Operator&status=Menunggu Verifikasi&status=Menunggu Pembayaran&status=Menunggu Konfirmasi Pembayaran&status=Selesai"
        }${search ? `&nama_lengkap=${search}` : ""}`,
        { withCredentials: true }
      );
      if (data.data.success) {
        setInvoice(data.data.data);
        setLength(data.data.length_total);
      }
    } catch (err) {
      alert("user tidak ditemukan")
    }
  }


  const handleDelete = async (no_invoice) => {
    try {
      const data = await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/api/invoice?no_invoice=${no_invoice}`,
        { withCredentials: true }
      );
      if (data.data.success) {
        alert("Delete successfully!");
        window.location.reload();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    let arr = [];
    const yearMax = new Date().getFullYear() - 2023;
    for (let i = 0; i < yearMax; i++) {
      arr.push(2024 + i);
      setYearOption(arr);
    }
    async function getInvoice() {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/invoice?&skip=${page * 15
          }&limit=15${year ? `&year=${year}` : ""}${month ? `&month=${month}` : ""
          }${jenis_pengujian ? `&jenis_pengujian=${jenis_pengujian}` : ""}${status ? `&status=${status}` : "status=menunggu form dikonfirmasi&status=Sample Dikerjakan Operator&status=Menunggu Verifikasi&status=Menunggu Pembayaran&status=Menunggu Konfirmasi Pembayaran&status=Selesai"
          }${search ? `&nama_lengkap=${search}` : ""}`,
          { withCredentials: true }
        );
        if (data.data.success) {
          setInvoice(data.data.data);
          setLength(data.data.length_total);
        }
      } catch (err) {
        alert(err.message);
      }
    }
    getInvoice();
  }, [page, month, year, jenis_pengujian, status]);
  return (
    <>
      <Navigasi text1={"admin"} text2={"order"} />
      <div className="flex flex-wrap justify-center gap-1 mb-10">
        <div className="md:flex grid grid-cols-3 p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 md:w-80 sm:w-64 w-52">
          <p className="md:text-sm sm:text-base text-xs font-semibold text-white pt-2">
            Search :
          </p>{" "}
          <input
            placeholder="cari nama..."
            type="text"
            name="nama_lengkap"
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            value={search}
          />
          <button onClick={(a) => handleSearch()} className="bg-red-700 md:text-base sm:text-sm text-xs text-white rounded-lg md:p-2 md:ml-1 sm:p-2">Cari</button>
        </div>

        <div className="md:flex grid grid-cols-2 p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 md:w-72 sm:w-64 w-52 ">
          <p className="md:text-sm sm:text-base text-xs font-semibold text-white p-2 ">
            Tahun :
          </p>{" "}
          <select
            className="ml-3"
            name="year"
            id="year"
            onChange={(e) => setYear(e.target.value)}
          >
            <option
              value=""
              defaultChecked
              className="input-style-lki text-black"
            >
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
        <div className="md:flex grid grid-cols-2 p-1 mt-2  justify-between grad rounded-lg md:ml-3 sm:ml-3 md:w-72 sm:w-64 w-52">
          {" "}
          <p className="md:text-sm sm:text-base text-xs font-semibold text-white p-2 ">
            Bulan :
          </p>{" "}
          <select
            className="ml-3"
            name="bulan"
            id="bulan"
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="" className="input-style-lki " defaultChecked>
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
        <div className="md:flex grid grid-cols-1 p-1 mt-2  justify-between grad rounded-lg sm:ml-3 md:w-[400px] sm:w-64 w-52">
          <p className="md:text-sm sm:text-base text-xs font-semibold text-white p-1 ">
            Status:{" "}
          </p>{" "}
          <select
            className="p-1"
            name="status"
            id="status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" className="input-style-lki" defaultChecked>
              All
            </option>
            {stats.map((v, i) => {
              return (
                <option value={v.status} key={i}>
                  {v.status}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="m-auto  w-11/12">
        <div className=" overflow-x-scroll w-full">
          <Table>
            <Table.Head>
              <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                No
              </Table.HeadCell>
              <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                Tanggal
              </Table.HeadCell>
              <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                Invoice
              </Table.HeadCell>
              <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                Nama Customer
              </Table.HeadCell>
              <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                Jenis Pengujian
              </Table.HeadCell>

              <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                Harga
              </Table.HeadCell>
              <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                Keterangan
              </Table.HeadCell>
              <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                Status
              </Table.HeadCell>
              <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                Edit
              </Table.HeadCell>
              {/* <Table.HeadCell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                Hapus
              </Table.HeadCell> */}
            </Table.Head>
            <Table.Body className="divide-y">
              {invoice.map((v, i) => {
                console.log(v);
                return (
                  <Table.Row
                    key={i}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white md:text-[11px] sm:text-[11px] text-[10px]">
                      {(i + 1) + (page * 15)}
                    </Table.Cell>
                    <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                      {v.date_format}
                    </Table.Cell>
                    <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                      {v.no_invoice}
                    </Table.Cell>
                    <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                      {v.nama_lengkap}
                    </Table.Cell>
                    <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                      {v.jenis_pengujian}
                    </Table.Cell>

                    <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                      {v.total_harga}
                    </Table.Cell>
                    <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                      <a
                        href={`/admin/dashboard/admin/order/${v._id}?no_invoice=${v.no_invoice}`}
                        className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500 md:text-[11px] sm:text-[11px] text-[10px]"
                      >
                        Keterangan
                      </a>
                    </Table.Cell>
                    <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                      <p>{v.status}</p>
                      <br />
                      <a
                        href={`/admin/dashboard/admin/order/tracking/${v._id}`}
                        className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500 md:text-[11px] sm:text-[11px] text-[10px]"
                      >
                        Keterangan
                      </a>
                    </Table.Cell>
                    <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                      <a
                        href={`/admin/dashboard/admin/order/edit/a?no_invoice=${v.no_invoice}`}
                        className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500 w-24 md:text-[11px] sm:text-[11px] text-[10px]"
                      >
                        Edit
                      </a>
                    </Table.Cell>
                    {/* <Table.Cell className="text-center md:text-[11px] sm:text-[11px] text-[10px]">
                      <a
                        onClick={(e) => {
                          handleDelete(v.no_invoice);
                        }}
                        className="font-medium text-white  bg-red-600 rounded-lg py-1 px-2 hover:underline dark:text-cyan-500 w-24 mt-5 md:text-[11px] sm:text-[11px] text-[10px]"
                      >
                        Delete
                      </a>
                    </Table.Cell> */}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
      <br />
      <p className=" text-center mb-2 text-red-600">page : {page + 1}</p>
      <div className="flex justify-center items-center">
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
      </div>

      <br />
      <br />
      <br />
      <br />
    </>
  );
}
