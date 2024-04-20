export default function Loading(){
    return(
        <>
          <div className="fixed z-10 backdrop-blur-md w-screen h-screen">
            <center className="m-auto pt-36">
              <div className=" md:p-5 sm:p-5 p-2 w-4/12 bg-white rounded-lg"> 
                  <p className="md:text-3xl sm:text-2xl text-sm font-bold">Loading</p>
                  <br/>
                  <marquee className="w-3/12 border-2 border-black rounded-lg">====================</marquee>
              </div>
            </center>
          </div>
        </>
    )
}