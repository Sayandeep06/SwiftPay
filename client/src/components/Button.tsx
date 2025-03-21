

const Button = (props:any) => {
  return (
    <button className="bg-gray-900 text-gray-200 w-full rounded-md p-1">
      {props.children}
    </button>
  )
}

export default Button
