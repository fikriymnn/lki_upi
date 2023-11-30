export default function admin(){
    return(
        <>
        <div>
            <h1>Login</h1>
            <div>
                <form>
                    <div>
                        <p>Email</p>
                        <input id="email" name="email" type="text" onChange={()=>{}}/>
                    </div>
                    <div>
                        <p>Password</p>
                        <input id="password" name="password" type="password" onChange={()=>{}}/>
                    </div>
                    <button onClick={()=>{}}>Login</button>
                </form>
            </div>
        </div>
        </>
    )
}