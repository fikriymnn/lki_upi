export default function Success(){
    return(
        <>
          <div className="md:h-screen sm:h-screen h-screen  m-auto flex align-center items-center justify-center">
          <center className="font-semibold md:text-2xl sm:text-xl text-xs w-7/12" >
            Order sukses!, lakukan pengecekan secara berkala pada halaman <a href="/my_order" className="text-blue-600 hover:text-blue-800">Order Saya</a> untuk melihat progress pengujian.
          </center>
          </div>
          
        </>
    )
}