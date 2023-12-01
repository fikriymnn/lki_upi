
export default function admin(){

    const onSubmit = ()=>{
    console.log("as")
    }
    return(
        <>
        <div>
            <h1>Login</h1>
            <div>
                <form >
                    <div>
                        <p>Email</p>
                        <input id="email" name="email" type="text" />
                    </div>
                    <div>
                        <p>Password</p>
                        <input id="password" name="password" type="password" />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
        </>
    )
}