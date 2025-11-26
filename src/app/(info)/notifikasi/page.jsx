"use client"

export default function notifikasi({searchParams }) {
    const { url } = searchParams

    return (
        <>
            <div className="md:h-screen sm:h-screen h-screen  m-auto flex align-center items-center justify-center">
                <center className="font-semibold md:text-2xl sm:text-xl text-xs w-7/12" >
                    Update sukses!, klik <a href={url} className="text-blue-600 hover:text-blue-800">kembali</a> untuk pergi ke halaman sebelumnya.
                </center>
            </div>
        </>
    )
}