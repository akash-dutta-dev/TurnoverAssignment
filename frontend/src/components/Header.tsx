import { IoMdSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { logout } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // Import useState
import { useAppContext } from "../context/AppContext";

export const Header = () => {
  const nav = ["Category", "Sale", "Clearance", "New Stock", "Trending"];
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useAppContext();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    const response = await logout();
    console.log(response);
    if (response.statusCode == 200) {
      setUserDetails(undefined);
      localStorage.removeItem("userDetails");
      navigate("/sign-up");
    }
  };

  useEffect(() => {
    if (userDetails) {
      setShowLogout(userDetails.isVerified);
    } else {
      setShowLogout(false);
    }
  }, [userDetails]);

  return (
    <div className="flex flex-col p-5">
      <div className="flex flex-row justify-around items-center">
        <div className="text-3xl font-bold cursor-pointer">ECOMMERCE</div>
        <div className="flex flex-row gap-5 font-semibold cursor-pointer">
          {nav.map((value, id) => (
            <div key={id} className="text-xl">
              {value}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="text-2xl cursor-pointer">
            <IoMdSearch />
          </div>
          <div className="text-2xl cursor-pointer">
            <FiShoppingCart />
          </div>
          {showLogout && ( // Show logout button if showLogout is true
            <div className="text-2xl cursor-pointer" onClick={handleLogout}>
              <LuLogOut />
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-200 flex items-center justify-center mt-4">
        <span className=" text-xl font-bold">&lt;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        Get 10% off on business sign up
        <span className=" text-xl font-bold">&nbsp;&nbsp;&nbsp;&nbsp;&gt;</span>
      </div>
    </div>
  );
};
