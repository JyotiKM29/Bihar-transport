'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import FuelDetails from './FuelDetails';
import { UserContext } from '@/app/context/UserContextProvider';

const FuelPage = ({ params }) => {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id;
  const { user } = useContext(UserContext);

  const adminId = user?._id;

  console.log(data);

  // useEffect(() => {
  //   const encodedData = searchParams.get('data');
  //   if (encodedData) {
  //     const decodedData = JSON.parse(decodeURIComponent(encodedData));
  //     setData(decodedData);
  //     console.log(data);
  //   }
  // }, [searchParams]);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/accounting/fullLoadHireRegister/getBooking/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newData = await response.json();

        setData(newData.data);

        console.log("data",data);
                console.log("new data",newData);
      } catch (error) {
        console.error('There was a problem with the fetch request.', error);
      }
    }

    fetchData();
  },[id])







  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <FuelDetails data={data} />
    </div>
  );
};

export default FuelPage;
