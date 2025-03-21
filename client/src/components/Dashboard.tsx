import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SendMoney from "./Send";
import { useRef } from "react";
interface User {
  _id: string;
  firstname: string;
  lastname: string;
}
const URL = import.meta.env.VITE_API_URL;


const Dashboard= () => {
  const [users, setUsers] = useState<User[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [toUserId, setToUserId] = useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const sendMoneyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token) {
      navigate("/signin");
      return;
    }
    setLoggedInUserId(userId);
    fetchBalance(token);
    fetchUsers(token);
  }, [navigate]);

  useEffect(() => {
    if (toUserId && sendMoneyRef.current) {
      sendMoneyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [toUserId]);
  

  const fetchBalance = async (token: string) => {
    try {
      const response = await axios.get(`${URL}/api/v1/account/balance`, {
        headers: { Authorization: token },
      });

      console.log("Balance API Response:", response.data);
      //@ts-ignore
      setBalance(response.data.balance);
    } catch (error) {
      //@ts-ignore
      console.error("Error fetching balance:", error?.response?.data || error);
    }
  };

  const fetchUsers = async (token: string) => {
    try {
      const response = await axios.get<{ users: User[] }>(
        `${URL}/api/v1/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.users);
    } catch (error) {
      //@ts-ignore
      console.error("Error fetching users", error?.response?.data || error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h1 className="text-xl font-bold">Payments App</h1>
        <p className="text-lg">Your Balance: ${balance}</p>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search users..."
            className="p-2 border w-full rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ul className="mt-4">
          {users
            .filter(
              (user) =>
                user._id !== loggedInUserId &&
                (user.firstname.toLowerCase().includes(search.toLowerCase()) ||
                  user.lastname.toLowerCase().includes(search.toLowerCase()))
            )
            .map((user) => (
              <li key={user._id} className="flex justify-between items-center p-2 border-b border-gray-300">
                <span className="font-semibold">
                  {user.firstname} {user.lastname}
                </span>
                <button
                  className="bg-black rounded-md text-white px-4 py-2 cursor-pointer"
                  onClick={() =>{setToUserId(user._id)
                  }}
                >
                  Send Money
                </button>
              </li>
            ))}
        </ul>

        {toUserId && 
          <div ref={sendMoneyRef} >
            <SendMoney toUserId={toUserId} setToUserId={setToUserId} />
          </div>
        }
      </div>
    </div>
  );
};

export default Dashboard;