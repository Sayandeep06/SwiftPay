 
const NavBar = () => {
  return (
    <div className="flex width-screen h-18 px-4 rounded-md justify-between items-center border border-gray-300">
      <div className="font-extrabold text-2xl">SwiftPay</div>
      <div className="flex justify-center items-center gap-4">
        <div>Hello, user</div>
        <div className="bg-gray-300 rounded-4xl w-10 h-10 flex justify-center items-center">U</div>
      </div>
    </div>
  )
}

export default NavBar
