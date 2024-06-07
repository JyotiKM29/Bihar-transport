'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FuelDetails from '../../FuelDetails';

const FuelPage = ({ params }) => {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    const encodedData = searchParams.get('data');
    if (encodedData) {
      const decodedData = JSON.parse(decodeURIComponent(encodedData));
      setData(decodedData);
    }
  }, [searchParams]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Fuel Details for Booking {id}</h1>
      <FuelDetails data={data} />
    </div>
  );
};

export default FuelPage;
