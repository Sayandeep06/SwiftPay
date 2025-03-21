

const Button = (props:any) => {
  return (
    <button className="bg-gray-900 text-gray-200 w-full rounded-md p-1 cursor-pointer">
      {props.children}
    </button>
  )
}

export default Button
