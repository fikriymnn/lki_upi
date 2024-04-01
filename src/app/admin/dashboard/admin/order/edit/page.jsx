"use client"
import axios from 'axios';
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation"

export default function Order_analisis({ searchParams }) {
    const { no_invoice } = searchParams
    const router = useRouter()
    const uid = uuidv4()
    const [countForm, setCountForm] = useState(1);
    const [duplicate, setDuplicate] = useState([<CustomForm i={0} key={0} uuid={uid} />]);
    const [iD, setID] = useState('')
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
    const [deskripsi_sample, setDeskripsi_sample] = useState([])
    const [riwayat_pengujian, setRiwayat_pengujian] = useState([])
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
        {
            jenis_pengujian: "XRD",
            kode_pengujian: "XRD"
        },

    ]



    const handleFS = (event) => {
        let reader = new FileReader();
        const imageFile = event.target.files[0];
        const imageFilname = event.target.files[0].name
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {

                //------------- Resize img code ----------------------------------
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 437;
                var MAX_HEIGHT = 437;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                ctx.canvas.toBlob((blob) => {
                    const file = new File([blob], imageFilname, {
                        type: imageFile.type,
                        lastModified: Date.now()
                    });

                    foto_sample[0] = file



                }, imageFile.type, 1);

            };
            img.onerror = () => {
                alert("invalid image content")
            };
            //debugger
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            
                let obj = {}
                obj.nama_sample = nama_sample[0]
                obj.jumlah_sample = jumlah_sample[0]
                obj.wujud_sample = wujud_sample[0]
                obj.pelarut = pelarut[0]
                obj.preparasi_khusus = preparasi_khusus[0]
                obj.target_senyawa = target_senyawa[0]
                obj.metode_parameter = metode_parameter[0]
                obj.deskripsi_sample = deskripsi_sample[0]
                obj.riwayat_pengujian = riwayat_pengujian[0]
                obj.sample_dikembalikan = sample_dikembalikan[0]
                const data = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/order/${iD}`,obj,{withCredentials:true})
                if(data.data.success){
                    alert("update success")
                        router.refresh()
                }               
        } catch (err) {
            alert(err.message)
        }

    }
    useEffect(() => {

        async function cek() {
            try {
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order?no_invoice=${no_invoice}`)
                if (data.data.success) {
                    const datas = data.data.data
                    console.log(datas)
                    setID(datas._id)
                    jenis_pengujian[0][0] = datas.jenis_pengujian
                    kode_pengujian[0] = datas.kode_pengujian
                    nama_sample[0] = datas.nama_sample
                    jumlah_sample[0] = datas.jumlah_sample
                    wujud_sample[0] = datas.wujud_sample
                    pelarut[0] = datas.pelarut
                    preparasi_khusus[0] = datas.preparasi_khusus
                    target_senyawa[0] = datas.target_senyawa
                    sample_dikembalikan[0] = datas.sample_dikembalikan
                    metode_parameter[0] = datas.metode_parameter
                    deskripsi_sample[0] = datas.deskripsi_sample
                    riwayat_pengujian[0] = datas.riwayat_pengujian
                    console.log(jenis_pengujian[0][0])
                }
            } catch (err) {
                alert(err.message)
            }
        }
        cek()

    }, [])



    function CustomForm({ i }) {
        console.log(jumlah_sample[0])
        return (
            <>
                
            </>
        )
    }

    return (
        <>
            <div>
                <p className='text-center text-4xl font-bold text-gray-800 mt-7'>Edit Order</p>
                <div className='flex justify-center'>
                    <hr className='grad h-2 mb-8 mt-5 w-56 text-center' />
                </div>
                <form onSubmit={handleSubmit}>
                <div className=" border-2 rounded-lg md:mx-20 mx-5">
                    <div className='w-full h-10 grad rounded-[5px]'></div>
                    <div className='px-10 py-5 flex flex-col gap-3'>
                        <div>
                            <h2 className="text-lg font-semibold">Jenis pengujian</h2>
                            <input className='input-style-lki' name="nama_sample" type="text" readOnly value={jenis_pengujian[0][0]?jenis_pengujian[0][0]:''}/>

                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Nama sample</h2>
                            <input className='input-style-lki' name="nama_sample" value={nama_sample[0]} type="text" onChange={(e) => {
                                nama_sample[0] = e.target.value

                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Jumlah sample</h2>
                            <input placeholder='masukkan jumlah sample' className='input-style-lki' value={jumlah_sample[0]}  name="jumlah_sample" type="number" onChange={(e) => {
                                jumlah_sample[0] = e.target.value
                            }} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Wujud sample</p>
                            <select defaultValue={wujud_sample[0]} name="wujud_sample" id="wujud_sample" className='input-style-lki' onChange={(e) => {
                                e.preventDefault()
                                wujud_sample[0] = e.target.value

                            }}>
                                {wujud_sample[0]=="padat"?<option value="padat" selected>padat</option>:<option value="padat">padat</option>}
                                {wujud_sample[0]=="cair"?<option value="cair" selected>cair</option>:<option value="cair">cair</option>}
                                {wujud_sample[0]=="gas"?<option value="gas" selected>gas</option>:<option value="gas">gas</option>}
                            </select>

                        
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Pelarut</h2>
                            <input placeholder='masukkan pelarut yang digunakan' className='input-style-lki' name="pelarut" defaultValue={pelarut[0]} type="text" onChange={(e) => {
                                e.preventDefault()
                                pelarut[0] = e.target.value
                            }} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Preparasi khusus</p>
                            <select defaultValue={preparasi_khusus[0]} name="preparasi_khusus" id="preparasi_khusus" className='input-style-lki' onChange={(e) => {
                                e.preventDefault()
                                preparasi_khusus[0] = e.target.value
                            }}>
                                {preparasi_khusus[0]==true?<option value={true} selected>Ya (esterifikasi/destruksi)</option>:<option value={true}>Ya (esterifikasi/destruksi)</option>}
                                {preparasi_khusus[0]==false?<option value={false} selected>Tidak</option>:<option value={false}>Tidak</option>}
                                
                                
                            </select>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Target senyawa/logam yang di cari
                            </h2>
                            <input placeholder='Tuliskan tujuan pengamatan yang ingin diperoleh, misal analisis logam natrium (Na) untuk AAS ' className='input-style-lki' name="target_senyawa" defaultValue={target_senyawa[0]} type="text" onChange={(e) => {
                                e.preventDefault()
                                target_senyawa[0] = e.target.value
                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Metode Parameter
                            </h2>
                            <input className='input-style-lki' placeholder='Tuliskan metode parameter yang ingin digunakan (suhu/flow/panjang gelombang/fasa gerak, gas, dsb.)' name="metode_parameter" defaultValue={metode_parameter[0]} type="text" onChange={(e) => {
                                e.preventDefault()
                                metode_parameter[0] = e.target.value

                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Apakah sample akan diambil setelah pengujian?
                            </h2>
                            <select  name="sample_dikembalikan" id="sample_dikembalikan" className='input-style-lki' onChange={(e) => {
                                e.preventDefault()
                                sample_dikembalikan[0] = e.target.value

                            }}>
                                {sample_dikembalikan[0]=='ya'?<option value="ya" selected>Ya</option>:<option value="ya">Ya</option>}
                                {sample_dikembalikan[0]=='tidak'? <option value="tidak" selected>Tidak</option>: <option value="tidak">Tidak</option>}
                            </select>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Deskripsi sample
                            </h2>
                            <textarea defaultValue={deskripsi_sample[0]} placeholder='Deskripsikan mengenai sampel: sifat fisik, jumlah sampel (gram atau volume), penyimpanan (suhu tertentu atau tidak) dan bagaimana sampel diperoleh' className='input-style-lki-box' name="deskripsi_sample" type="text" onChange={(e) => {

                                e.preventDefault()
                                deskripsi_sample[0] = e.target.value
                            }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" >Riwayat pengujian sample
                            </h2>

                            <textarea defaultValue={riwayat_pengujian[0]} placeholder='Deskripsikan mengenai riwayat pengujian sampel: apakah pernah diuji di tempat lain dan bagaimana hasilnya' className='input-style-lki-box' name="riwayat_pengujian" type="text" onChange={(e) => {

                                e.preventDefault()
                                riwayat_pengujian[0] = e.target.value
                            }} />
                        </div>
                    </div>
                </div>
       
                  
                    <br />
                    <div className='w-full flex justify-center mb-20'>

                        <button type="submit" className='grad  text-white rounded-lg m-auto text-[24px] font-bold px-6 py-3'>Konfirmasi edit</button>
                    </div>

                </form>
            </div>
        </>
    )
}