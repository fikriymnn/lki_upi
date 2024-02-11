"use client"
import axios from 'axios';
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';


export default function order_analisis() {
    const uid = uuidv4()
    const [countForm, setCountForm] = useState(1);
    const [duplicate, setDuplicate] = useState([<CustomForm i={0} key={0} uuid={uid} />]);
    const [arr, setArr] = useState([])
    const [jenis_pengujian, setJenis_pengujian] = useState([[]])
    const [kode_pengujian, setKode_pengujian] = useState([[]])
    const [nama_sample, setNama_sample] = useState([])
    const [jumlah_sample, setJumlah_sample] = useState([])
    const [wujud_sample, setWujud_sample] = useState([])
    const [pelarut, setPelarut] = useState([])
    const [preparasi_khusus, setPreparasi_khusus] = useState([])
    const [target_senyawa, setTarget_senyawa] = useState([])
    const [sample_dikembalikan, setSample_dikembalikan] = useState([])
    const [metode_parameter, setMetode_parameter] = useState([])
    const [jurnal_pendukung, setJurnal_pendukung] = useState([])
    const [deskripsi_sample, setDeskripsi_sample] = useState([])
    const [riwayat_pengujian, setRiwayat_pengujian] = useState([])
    const [foto_sample, setFoto_sample] = useState([])
    const [uuid, setUuid] = useState([uid])
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



    const increment = (e) => {
        setCountForm(a => a + 1)
        console.log(nama_sample)
        console.log(jenis_pengujian)
        e.preventDefault()
        setDuplicate([...duplicate, <CustomForm i={countForm} key={duplicate.length} />])
        let add = [...jenis_pengujian]
        add.push([])
        setJenis_pengujian([...add])
        let add2 = [...kode_pengujian]
        add2.push([])
        setKode_pengujian([...add2])
        let add3 = [...foto_sample]
        add3.push("")
        setFoto_sample([...add3])
        let add4 = [...jurnal_pendukung]
        add4.push("")
        setJurnal_pendukung([...add4])
        console.log(jurnal_pendukung)
        let add5 = uuid
        const uid = uuidv4()
        add5.push(uid)
        setUuid([...add5])
        console.log(uuid)


    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            for (let i = 0; i < jenis_pengujian.length; i++) {
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
                obj.deskripsi_sample = deskripsi_sample[i]
                obj.riwayat_pengujian = riwayat_pengujian[i]
                obj.sample_dikembalikan = sample_dikembalikan[i]
                obj.uuid = uuid[i]
                console.log(obj)
                arr[i] = obj
            }
            console.log(arr)
            if (arr.length == duplicate.length) {
                console.log("post data")
                const data = await axios.post("http://localhost:5000/api/order", arr, {
                    withCredentials: true

                })
                console.log(data)
                if (data.data.success) {
                    var v;
                    for (v = 0; v <= uuid.length; v++) {
                        for (let a = 0; a < jurnal_pendukung.length; a++) {
                            if (uuid[v] == jurnal_pendukung[a].uid) {
                                async function cek() {
                                    await axios.post(`http://localhost:5000/api/jurnal_pendukung/${uuid[v]}`, { jurnal_pendukung: jurnal_pendukung[a].file }, {
                                        withCredentials: true,
                                        headers: { "Content-Type": 'multipart/form-data' }
                                    })
                                }
                                cek()

                            }
                        }
                        for (let b = 0; b < foto_sample.length; b++) {
                            if (uuid[v] == foto_sample[b].uid) {
                                async function cek2() {

                                    await axios.post(`http://localhost:5000/api/foto_sample/${uuid[v]}`, { foto_sample: foto_sample[b].file }, {
                                        withCredentials: true,
                                        headers: { "Content-Type": 'multipart/form-data' }
                                    })
                                }
                                cek2()
                            }
                        }
                        if (v == uuid.length) {
                            alert('success')
                        }
                    }
                }

            }
        } catch (err) {
            alert(err.message)
        }

    }

    function CustomForm({ i }) {
        return (
            <>
                <div className=" border-2 rounded-lg md:mx-20 mx-5">
                    {/* <p className='text-xl font-semibold text-xl text-white bg-red-600 rounded-lg p-3'>{i + 1}</p> */}
                    <div className='w-full h-10 grad rounded-[5px]'></div>
                    <div className='px-10 py-5 flex flex-col gap-3'>
                        <div>
                            <h2 className="text-lg font-semibold">Jenis pengujian</h2>
                            {
                                kode.map((a, b) => {
                                    return (
                                        <div key={b}>
                                            <input className='input-style-lki-checklist ' type="checkbox" id={`jenis_pengujian${b}${i}`} name={`jenis_pengujian`} value={a.jenis_pengujian} onChange={(e) => {
                                                const { checked, value } = e.target
                                                console.log(kode_pengujian)

                                                if (checked) {

                                                    let cccc = [...jenis_pengujian]

                                                    let copya2 = cccc[i]
                                                    copya2.push(value)
                                                    cccc[i] = copya2
                                                    setJenis_pengujian(cccc)

                                                    let cccc2 = [...kode_pengujian]
                                                    let copya22 = cccc2[i]
                                                    copya22.push(a.kode_pengujian)
                                                    cccc2[i] = copya22
                                                    setKode_pengujian(cccc2)

                                                } else {
                                                    let copy = [...jenis_pengujian]
                                                    let copy2 = copy[i]

                                                    let copy3 = [...kode_pengujian]
                                                    let copy4 = copy3[i]
                                                    if (copy2?.includes(value)) {
                                                        let index = copy2.indexOf(value)
                                                        copy2.splice(index, 1)
                                                        copy[i] = copy2
                                                        setJenis_pengujian([...copy])

                                                        let index2 = copy4.indexOf(a.kode_pengujian)
                                                        copy4.splice(index2, 1)
                                                        copy3[i] = copy4
                                                        setKode_pengujian([...copy3])
                                                    } else {
                                                        return false
                                                    }
                                                }
                                                console.log(jenis_pengujian)
                                            }} />
                                            <label htmlFor={`jenis_pengujian${b}${i}`} className='ml-3'>{a.jenis_pengujian}</label>
                                        </div>
                                    )
                                })
                            }



                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Nama sample</h2>
                            <input placeholder='masukkan nama sample' className='input-style-lki' name="nama_sample" required type="text" onChange={(e) => {
                                nama_sample[i] = e.target.value
                                console.log(nama_sample)

                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Jumlah sample</h2>
                            <input placeholder='masukkan jumlah sample' className='input-style-lki' name="jumlah_sample" required type="number" onChange={(e) => {
                                jumlah_sample[i] = e.target.value
                            }} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Wujud sample</p>

                            <input type="radio" className='input-style-lki-radio ' id={`wujud_sample1${i}`} name={`wujud_sample${i}`} onChange={(e) => {
                                wujud_sample[i] = e.target.value
                            }} value="padat" />
                            <label className='ml-3' htmlFor={`wujud_sample1${i}`}>Padat</label>
                            <br />

                            <input type="radio" className='input-style-lki-radio ' id={`wujud_sample2${i}`} name={`wujud_sample${i}`} onChange={(e) => {
                                e.preventDefault()
                                wujud_sample[i] = e.target.value
                            }} value="cair" />
                            <label className='ml-3' htmlFor={`wujud_sample2${i}`}>Cair</label>
                            <br />

                            <input type="radio" className='input-style-lki-radio ' id={`wujud_sample3${i}`} name={`wujud_sample${i}`} onChange={(e) => {
                                e.preventDefault()
                                wujud_sample[i] = e.target.value
                            }} value="gas" />
                            <label className='ml-3' htmlFor={`wujud_sample3${i}`}>Gas</label>

                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Pelarut</h2>
                            <input placeholder='masukkan pelarut yang digunakan' className='input-style-lki' name="pelarut" required type="text" onChange={(e) => {
                                e.preventDefault()
                                pelarut[i] = e.target.value
                            }} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Preparasi khusus</p>
                            <div className='flex'>
                                <input type="radio" className='input-style-lki-radio ' name={`preparasi_khusus${i}`} onChange={(e) => {
                                    e.preventDefault()
                                    preparasi_khusus[i] = e.target.value
                                }} value={true} />
                                <h2 className='ml-3' htmlFor={`preparasi_khusus${i}`}>Ya (esterifikasi/destruksi)</h2>
                            </div>
                            <br />
                            <div className='flex'>
                                <input type="radio" className='input-style-lki-radio ' name={`preparasi_khusus${i}`} onChange={(e) => {
                                    e.preventDefault()
                                    preparasi_khusus[i] = e.target.value
                                }} value={false} />
                                <h2 className='ml-3' htmlFor="preparasi_khusus">Tidak</h2>
                            </div>
                            <br />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Target senyawa/logam yang di cari
                            </h2>
                            <input placeholder='Tuliskan tujuan pengamatan yang ingin diperoleh, misal analisis logam natrium (Na) untuk AAS ' className='input-style-lki' name="target_senyawa" required type="text" onChange={(e) => {
                                e.preventDefault()
                                target_senyawa[i] = e.target.value
                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Metode Parameter 
                            </h2>
                            <input className='input-style-lki' placeholder='Tuliskan metode parameter yang ingin digunakan (suhu/flow/panjang gelombang/fasa gerak, gas, dsb.)' name="metode_parameter" required type="text" onChange={(e) => {
                                e.preventDefault()
                                metode_parameter[i] = e.target.value

                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >APAKAH SAMPEL AKAN DIAMBIL SETELAH PENGUJIAN?
                            </h2>
                            <select required name="sample_dikembalikan" id="sample_dikembalikan" className='input-style-lki' onChange={(e)=>{
                                e.preventDefault()
                                sample_dikembalikan[i] = e.target.value
                                console.log(sample_dikembalikan)
                            }}>
                                <option value="" selected>Pilih</option>
                                <option value="ya">Ya</option>
                                <option value="tidak">Tidak</option>
                                
                            </select>
                        </div>
                        <div className='grid md:grid-cols-2 grid-cols-1 gap-10'>

                            <div>
                                <h2 className="text-lg font-semibold" >Foto sample
                                </h2>
                                <input className='input-style-lki' name="foto_sample" type="file" onChange={(e) => {
                                    e.preventDefault()

                                    foto_sample[i] = { file: e.target.files[0], uid: uuid[i] }

                                }} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold" >Jurnal pendukung
                                </h2>
                                <input className='input-style-lki' name="jurnal_pendukung" type="file" onChange={(e) => {

                                    e.preventDefault()

                                    jurnal_pendukung[i] = { file: e.target.files[0], uid: uuid[i] }

                                }} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Deskripsi sample
                            </h2>
                            <textarea placeholder='Deskripsikan mengenai sampel: sifat fisik, jumlah sampel (gram atau volume), penyimpanan (suhu tertentu atau tidak) dan bagaimana sampel diperoleh' className='input-style-lki-box' name="deskripsi_sample" type="text" onChange={(e) => {

                                e.preventDefault()
                                deskripsi_sample[i] = e.target.value
                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Riwayat pengujian sample
                            </h2>
                            <textarea placeholder='Deskripsikan mengenai riwayat pengujian sampel: apakah pernah diuji di tempat lain dan bagaimana hasilnya' className='input-style-lki-box' name="riwayat_pengujian" type="text" onChange={(e) => {

                                e.preventDefault()
                                riwayat_pengujian[i] = e.target.value
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
                <p className='text-center text-4xl font-bold text-gray-800 mt-7'>Layanan Analisis
                    Laboratorium Kimia Instrumen &#40;LKI&#41; UPI</p>
                <div className='flex justify-center'>
                    <hr className='grad h-2 mb-8 mt-5 w-56 text-center' />
                </div>
                <form onSubmit={handleSubmit}>
                    {duplicate}
                    <br />
                    <div className='flex mx-20 gap-2'>
                        <input className='my-auto' type="checkbox" id="verifikasi" name="verifikasi" required onChange={(e) => setVerifikasi(true)} />
                        <h2 htmlFor="verifikasi">Saya telah memahami proses pengujian yang akan dilakukan dan memahami syarat dan ketentuan yang telah dijelaskan oleh staff/pengelola laboratorium
                        </h2><br />

                    </div>
                    <br />
                    <div className='w-full flex justify-center mb-20'>

                        <button type="submit" className='grad  text-white rounded-lg m-auto text-[24px] font-bold px-6 py-3'>Kirim</button>
                    </div>

                </form>
                {/* <div className='grid grid-cols-1 justify-items-center'>
                    <button onClick={increment} className='bg-blue-800 p-3 text-white rounded-lg'>Tambah order</button>
                    <br />
                    <br />
                   
                </div> */}


            </div>
        </>
    )
}