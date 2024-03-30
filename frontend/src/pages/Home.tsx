import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import {
  getInterest,
  selectInterest,
  unselectInterest,
} from "../api/interestApi";
import { Loader } from "../components/Loader";

export type InterestProps = {
  id: string;
  interest: string;
  checked: boolean;
};

export const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [interests, setInterests] = useState<InterestProps[]>([]);
  const [loading, setLoading] = useState(false);
  const checkboxRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { userDetails } = useAppContext();
  const navigate = useNavigate();

  const fetchInterest = async (page: number, size: number) => {
    try {
      setLoading(true);
      const response = await getInterest(page, size);
      setLoading(false);
      if (response.statusCode == 200) {
        setInterests(response.responseBody.userInterests);
        setTotalPages(response.responseBody.totalPages);
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(page);
    fetchInterest(page, 6);
  };

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    interestId: string
  ) => {
    const updatedInterests = interests.map((interest) =>
      interest.id === interestId
        ? { ...interest, checked: event.target.checked }
        : interest
    );
    setInterests(updatedInterests);
    if (event.target.checked) {
      await selectInterest(interestId);
    } else {
      await unselectInterest(interestId);
    }
  };

  useEffect(() => {
    fetchInterest(1, 6); // Initially (page: 1, size: 6)
  }, []);

  useEffect(() => {
    if (!(userDetails && userDetails.isVerified)) {
      navigate("/sign-up");
    }
  }, [userDetails, navigate]);

  return (
    <div className="container mx-auto flex flex-col sm:w-1/3 border border-black-800 rounded-lg p-12">
      <div className="text-3xl font-semibold text-center">
        Please mark your Interests!
      </div>
      <div className="text-base mt-5 text-center">
        We will keep you notified
      </div>
      <div className="text-xl font-semibold mt-5">My saved interests!</div>
      {(loading && <Loader />) || (
        <div className="flex flex-col gap-2 mt-3 mb-5">
          {interests.map((interest: InterestProps) => (
            <div key={interest.id} className="flex gap-2">
              <input
                type="checkbox"
                id={interest.id}
                ref={(el) => (checkboxRefs.current[parseInt(interest.id)] = el)}
                className="mt-1 h-6 w-6 accent-black"
                onChange={(event) => handleCheckboxChange(event, interest.id)}
                checked={interest.checked}
              />
              <label className="text-lg" htmlFor={interest.id}>
                {interest.interest.charAt(0).toUpperCase() +
                  interest.interest.slice(1)}
              </label>
            </div>
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
