export default function Loading(){
    return(
        <>
          <div className="fixed inset-0 h-screen flex items-center justify-center backdrop-blur-sm bg-white">
      <div className="w-16 h-16 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
    </div>
        </>
    )
}