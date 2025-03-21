import { useState } from "react";
import axios from "axios";
//@ts-ignore
const SendMoney = ({ toUserId, setToUserId }) => {
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    if (!toUserId || amount == "") {
      alert("No recipient selected or no amount selected");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be signed in to transfer money.");
        return;
      }
      
      const response = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        { to: toUserId, amount: Number(amount) },
        { headers: { Authorization: token } }
      );
      
      if (response.status === 200) {
        alert("Transfer successful!");
        setToUserId(null); 
      } else {
        //@ts-ignore
        alert(response.data.message || "Transfer failed");
      }
    } catch (error) {
      //@ts-ignore
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex max-w-full h-screen w-screen justify-center items-center bg-[#888a89]">
      <div className="flex flex-col rounded-md shadow-md shadow-gray-600 bg-slate-100 w-80 h-90 p-2">
        <div className="font-bold text-gray-800 py-2 text-2xl flex items-center justify-center">
          Send Money
        </div>
        <div className="px-2 w-full text-gray-700 flex flex-col gap-2">
          <h3>Recipient</h3>
          <input
            value={toUserId || "No recipient selected"}
            disabled
            className="w-full border rounded-md border-gray-400 p-1 bg-gray-200 cursor-not-allowed"
          />
          <h3>Amount</h3>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full border rounded-md border-gray-400 p-1"
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="mt-3">
            <button
              onClick={handleTransfer}
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Transfer
            </button>
            <button
              onClick={() => setToUserId(null)}
              className="w-full bg-gray-400 text-white py-2 rounded-md mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;