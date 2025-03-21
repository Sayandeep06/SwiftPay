import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SendMoney from "./Send";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [toUserId, setToUserId] = useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token) {
      navigate("/signin");
      return;
    }

    setLoggedInUserId(userId);

    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("Auth Token for Balance Fetch:", token);
        if (!token) return;
    
        const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
    
        console.log("Full Balance API Response:", response); // Check full response
        //@ts-ignore
        console.log("Extracted Balance:", response.data.balance); // Ensure this exists
        //@ts-ignore
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get<{ users: User[] }>(
          "http://localhost:3000/api/v1/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchBalance();
    fetchUsers();
  }, [navigate]);

  return (
    <div>
      <NavBar/>
      <div className="p-6">
        <h1 className="text-xl font-bold">Payments App</h1>
        <p className="text-lg">Your Balance: ${balance}</p>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search users..."
            className="p-2 border w-full"
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
              <li key={user._id} className="flex justify-between items-center p-2 border-b">
                <span className="font-semibold">
                  {user.firstname} {user.lastname}
                </span>
                <button
                  className="bg-black text-white px-4 py-2"
                  onClick={() => setToUserId(user._id)}
                >
                  Send Money
                </button>
              </li>
            ))}
        </ul>

        {toUserId && <SendMoney toUserId={toUserId} setToUserId={setToUserId} />}
      </div>
    </div>
  );
};

export default Dashboard;