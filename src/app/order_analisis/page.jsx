"use client"
import axios from 'axios';
import { useState } from 'react'

export default function order_analisis() {
    const [countForm, setCountForm] = useState(1);
    const [duplicate, setDuplicate] = useState([<CustomForm i={0} key={0} />]);
    const [arr, setArr] = useState([])
    const [jenis_pengujian, setJenis_pengujian] = useState([[]])
    const [kode_pengujian, setKode_pengujian] = useState([[]])
    const [nama_sample, setNama_sample] = useState([])
    const [jumlah_sample, setJumlah_sample] = useState([])
    const [wujud_sample, setWujud_sample] = useState([])
    const [pelarut, setPelarut] = useState([])
    const [preparasi_khusus, setPreparasi_khusus] = useState([])
    const [target_senyawa, setTarget_senyawa] = useState([])
    const [metode_parameter, setMetode_parameter] = useState([])
    const [jurnal_pendukung, setJurnal_pendukung] = useState([])
    const [deskripsi_sample, setDeskripsi_sample] = useState([])
    const [foto_sample, setFoto_sample] = useState([])
    const [verifikasi, setVerifikasi] = useState(false)

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
            jenis_pengujian: "NMR Proton 1D",
            kode_pengujian: "NMR"
        },
        {
            jenis_pengujian: "NMR Carbon 1D",
            kode_pengujian: "NMR"
        },
        {
            jenis_pengujian: "NMR 2D",
            kode_pengujian: "NMR"
        },
        {
            jenis_pengujian: "AAS Flame",
            kode_pengujian: "AS"
        },
        {
            jenis_pengujian: "AAS Furnace",
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



    const increment = (e) => {
        setCountForm(a => a + 1)
        console.log(nama_sample)
        console.log(jenis_pengujian)
        e.preventDefault()
        setDuplicate([...duplicate, <CustomForm i={countForm} key={duplicate.length} />])
        let add = jenis_pengujian
        add.push([])
        setJenis_pengujian([...add])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            for(let i = 0;i<nama_sample.length;i++){
                let obj = {}
                obj.jenis_pengujian = jenis_pengujian[i]
                obj.kode_pengujian = kode_pengujian[i]
                obj.nama_sample = nama_sample[i]
                obj.jumlah_sample = jumlah_sample[i]
                obj.wujud_sample = wujud_sample[i]
                obj.pelarut = pelarut[i]
                obj.preparasi_khusus = preparasi_khusus[i]
                obj.target_senyawa = target_senyawa[i]
                obj.metode_parameter = metode_parameter[i]
                obj.jurnal_pendukung = jurnal_pendukung[i]
                obj.deskripsi_sample = deskripsi_sample[i]
                obj.foto_sample = foto_sample[i]
                let arr2 = arr
                arr2.push(obj)
                setArr(arr2)
            }
            if(arr.length==duplicate.length){
                const data = await axios.post("http://localhost:5000/api/order",arr,{
                    withCredentials:true
                })
                console.log(data)
                if(data.data.success==true){
                    alert("success")
                }
            }
        }catch(err){
            alert(err.message)
        }
       
    }

    function CustomForm({ i }) {
        return (
            <>
                <div className=" border-2 rounded-lg mx-20">
                    <p className='text-xl font-semibold text-xl text-white bg-red-600 rounded-lg p-3'>{i + 1}</p>
                    <div className='px-10 py-5'>
                        <div>
                            <h2 className="text-lg font-semibold">Jenis pengujian</h2>
                            {
                                kode.map((a, b) => {
                                    return (
                                        <div key={b}>
                                            <input type="checkbox" id={`jenis_pengujian${b}${i}`} name={`jenis_pengujian`} value={{jenis_pengujian:a.jenis_pengujian,kode_pengujian:a.kode_pengujian}} onChange={(e) => {
                                                const { checked, value } = e.target

                                                if (checked) {
                                                    let cccc = jenis_pengujian

                                                    let copya2 = cccc[i]
                                                    copya2.push(value.jenis_pengujian)
                                                    cccc[i] = copya2
                                                    setJenis_pengujian(cccc)

                                                    let cccc2 = kode_pengujian
                                                    let copya22 = cccc[i]
                                                    copya22.push(value.kode_pengujian)
                                                    cccc2[i] = copya2
                                                    setKode_pengujian(cccc2)

                                                } else {
                                                    let copy = jenis_pengujian
                                                    let copy2 = copy[i]

                                                    let copy3 = kode_pengujian
                                                    let copy4 = copy3[i]
                                                    if (copy2?.includes(value)) {
                                                        let index = copy2.indexOf(value)
                                                        copy2.splice(index, 1)
                                                        copy[i] = copy2
                                                        setJenis_pengujian([...copy])

                                                        let index2 = copy4.indexOf(value)
                                                        copy4.splice(index2, 1)
                                                        copy3[i] = copy4
                                                        setKode_pengujian([...copy3])

                                                    } else {
                                                        return false
                                                    }
                                                }
                                                console.log(jenis_pengujian)
                                            }} />
                                            <label htmlFor={`jenis_pengujian${b}${i}`}>{a.jenis_pengujian}</label>
                                        </div>
                                    )
                                })
                            }



                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Nama sample</h2>
                            <input name="nama_sample" required type="text" onChange={(e) => {
                                nama_sample[i] = e.target.value
                                console.log(nama_sample)

                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Jumlah sample</h2>
                            <input name="jumlah_sample" required type="number" onChange={(e) => {
                                jumlah_sample[i] = e.target.value
                            }} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Wujud sample</p>

                            <input type="radio" id="wujud_sample1" name="wujud_sample" onChange={(e) => {
                                wujud_sample[i] = e.target.value
                            }} value="padat" />
                            <label htmlFor="wujud_sample1">Padat</label>
                            <br />

                            <input type="radio" id="wujud_sample2" name="wujud_sample" onChange={(e) => {
                                e.preventDefault()
                                wujud_sample[i] = e.target.value
                            }} value="cair" />
                            <label htmlFor="wujud_sample2">Cair</label>
                            <br />

                            <input type="radio" id="wujud_sample3" name="wujud_sample" onChange={(e) => {
                                e.preventDefault()
                                wujud_sample[i] = e.target.value
                            }} value="gas" />
                            <label htmlFor="wujud_sample3">Gas</label>

                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Pelarut</h2>
                            <input name="pelarut" required type="text" onChange={(e) => {
                                e.preventDefault()
                                pelarut[i] = e.target.value
                            }} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Preparasi khusus</p>
                            <div className='flex'>
                                <input type="radio" name="preparasi_khusus" onChange={(e) => {
                                    e.preventDefault()
                                    preparasi_khusus[i] = e.target.value
                                }} value={true} />
                                <h2 className="" htmlFor="preparasi_khusus">Ya (esterifikasi/destruksi)</h2>
                            </div>
                            <br />
                            <div className='flex'>
                                <input type="radio" name="preparasi_khusus" onChange={(e) => {
                                    e.preventDefault()
                                    preparasi_khusus[i] = e.target.value
                                }} value={false} />
                                <h2 className="" htmlFor="preparasi_khusus">Tidak</h2>
                            </div>
                            <br />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Target senyawa/logam yang di cari
                            </h2>
                            <input name="target_senyawa" required type="text" onChange={(e) => {
                                e.preventDefault()
                                target_senyawa[i] = e.target.value
                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Metode Parameter (Suhu/flow/panjang gelombang/fasa gerak, gas, dsb)
                            </h2>
                            <input name="metode_parameter" required type="text" onChange={(e) => {
                                e.preventDefault()
                                metode_parameter[i] = e.target.value

                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Foto sample
                            </h2>
                            <input name="foto_sample" type="file" onChange={(e) => {

                                e.preventDefault()
                                foto_sample[i] = e.target.value
                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Jurnal pendukung
                            </h2>
                            <input name="jurnal_pendukung" type="file" onChange={(e) => {

                                e.preventDefault()
                                jurnal_pendukung[i] = e.target.value
                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Deskripsi sample
                            </h2>
                            <input name="deskripsi_sample" type="text" onChange={(e) => {

                                e.preventDefault()
                                deskripsi_sample[i] = e.target.value
                            }} />
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div>
                {/* <button onClick={() => { console.log(jenis_pengujian); console.log(nama_sample) }}>asd</button> */}
                <p className='text-center text-4xl font-bold text-gray-800 mt-7'>ORDER ANALISIS</p>
                <div className='flex justify-center'>
                    <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
                </div>
                <form onSubmit={handleSubmit}>
                    {duplicate}
                    <br />
                    <div className='flex mx-20'>
                        <input type="radio" id="verifikasi" name="verifikasi" value={true} required onClick={(e) => setVerifikasi(e.target.value)} />
                        <h2 htmlFor="verifikasi">Saya telah memahami proses pengujian yang akan dilakukan dan memahami syarat dan ketentuan yang telah dijelaskan oleh staff/pengelola laboratorium
                        </h2><br />

                    </div>
                    <br />
                    <button type="submit" className='bg-blue-800 p-3 text-white rounded-lg'>Kirim</button>

                </form>
                <div className='grid grid-cols-1 justify-items-center'>
                    <button onClick={increment} className='bg-blue-800 p-3 text-white rounded-lg'>Tambah order</button>
                    <br />
                    <br />
                   
                </div>


            </div>
        </>
    )
}