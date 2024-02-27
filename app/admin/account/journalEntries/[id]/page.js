"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";
import DataView from "../../DataView";

const View = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const router = useRouter();

  const id = params.id;
  async function fetchData() {
    const response = await fetch(
      `/api/accounting/journalEntries/details/${id}`,
    );
    const result = await response.json();

    setData(result.data);
    setLoading(false);
    console.log("res", result);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoBack = () => {
    router.back();
  };



  return (
    <div className="max-w max-h mt-14 rounded-2xl  bg-white px-4 py-4 shadow-lg md:px-10 lg:my-4 lg:p-8 lg:px-20">
      <div className="flex items-center justify-between">
        <h2 className="mb-8  text-3xl font-semibold text-orange-500">
        Journal Entries Details :
        </h2>
        <div className="flex gap-3">
          <Button onClick={handleGoBack}>Back</Button>
        </div>
      </div>

      <>
        {loading ? "loading ..." :<>
        <DataView title='Date' value={data?.date ? new Date(data?.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }): "N/A"}
            />
<hr />
<br />
        <DataView title=' From' value={data?.from}  />
        <hr />
        <br />
        <DataView title='To' value={data?.to}  />
        <hr />
        <br />
<DataView title='Debit' value={data?.debit}  />
<hr />
<br />
<DataView title='Credit' value={data?.credit}  />
<hr />
<br />
<DataView title='Narration' value={data?.narration}  />
<hr />
        </>
        }
      </>
    </div>
  );
};

export default View;
