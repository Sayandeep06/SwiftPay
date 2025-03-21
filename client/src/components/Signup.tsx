import Button from "./Button"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import axios from "axios";
const Signup = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")

  const handleSubmit= async ()=>{
    try{
      const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
        username,
        firstname,
        lastname,
        password
      });
      if(response.status == 201){
        //@ts-ignore
        const token = `Bearer ${response.data.token}`;
        localStorage.setItem("authToken", token);
        alert("Signup successfull!")
        navigate("/dashboard");
      }
    }catch(err : any){
      alert(err.response?.data?.message);
    }
  }

  return (
    <div className='flex h-screen w-screen justify-center items-center bg-[#888a89]'>
      <div className='flex flex-col rounded-md shadow-md shadow-gray-600 bg-slate-100 w-80 h-130 p-2'>
      <div className='font-bold text-gray-800 py-2 text-2xl flex items-center justify-center '>
        Sign Up
      </div>
      <p className='px-5 text-gray-600 text-center mb-5'>Enter your information to create an account</p>
      <div className='px-2 w-full text-gray-700 flex flex-col gap-2'>
        <h3>First Name</h3>
        <input placeholder='John' className='w-full border rounded-md border-gray-400 p-1' onChange={(e)=>setFirstname(e.target.value)}></input>
        <h3>Last Name</h3>
        <input placeholder='Doe' className='w-full border rounded-md border-gray-400 p-1' onChange={(e)=>setLastname(e.target.value)}></input>
        <h3>Email</h3>
        <input placeholder='johndoe@example.com' className='w-full border rounded-md border-gray-400 p-1' onChange={(e)=>setUsername(e.target.value)}></input>
        <h3>Password</h3>
        <input
          type="password"
          placeholder=""
          className="w-full border rounded-md border-gray-400 p-1"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") handleSubmit();
          }}
        />
        <div className="mt-3" onClick={()=>handleSubmit()}><Button>Sign Up</Button></div>
        <div className="flex items-center justify-center">
          <p>Already have an account? </p> <span onClick={()=> navigate("/signin")} className="underline cursor-pointer">Login</span>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Signup
