"use client";
import { Button } from "../../../../../components/ui/button";
import { useContext, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { UserContext } from "../../../../../context/UserContextProvider";
import { useRouter } from "next/navigation";

function Invoice({params}) {
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [data ,setData] = useState();
const id = params.id;
  const userId = user?._id;

 

  useEffect(() => {
    const fetchData = async () => {
      try {
        
          const response = await fetch(`/api/bookingDetail/${id}`, {
            method: "GET",
          });

          if (!response.ok) {
            console.log(response);
          }

          const result = await response.json();
          setData(result.booking);
      
          console.log("Receipt:", data);

        
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [userId]);

  const downloadPDF = () => {
    const capture = document.querySelector(".actual-receipt");
    setLoader(true);
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL("img/png");
      const doc = new jsPDF("p", "mm", "a4");
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
      setLoader(false);
      doc.save("receipt.pdf");
    });
  };

  const handleContinue = () => {
    router.push("/admin/booking?tab=intilize");
  };

  return (
    <div className="flex   items-center justify-around">
      {/* receipt action */}

      <div className="w-[450px]">
        {/* actual receipt */}
        <div className="actual-receipt relative h-[842px] w-[595px]">
          <div className="absolute h-full w-full  bg-white ">
            <Image
              src="/BIHAR TRANSPORT.svg"
              alt="Bihar Transport"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="absolute left-[476px] top-[166px]  text-[.7rem]">
            {data?.date.slice(0, 10)}
          </p>

          <p className="absolute left-[55px] top-[235px]  text-[.7rem]">
            {data?.consigneeName}
          </p>
          <p className="absolute left-[418px] top-[235px]  text-[.7rem]">
            {data?.consigneeMobileNumber}
          </p>

          <p className="absolute left-[49px] top-[312px] w-1/3  text-[.5rem] ">
            {data?.loadingPoints}
          </p>
          <p className="absolute left-[380px] top-[312px] w-1/3  text-[.5rem] ">
            {data?.unloadingPoints}
          </p>

          <p className="absolute  left-[69px] top-[340px]  text-[.7rem] ">
            {data?.allotedVehicle[0]?.vehicleNo}
          </p>
          <p className="absolute left-[424px] top-[340px]  text-[.7rem] ">
            {data?.vehicleType}
          </p>

          <p className="absolute left-[69px] top-[368px]  text-[.7rem] ">
            {data?.itemsList?.item[0]?.material}
          </p>

          <p className="absolute left-[408px] top-[368px]  text-[.7rem] ">
            {`${data?.itemsList?.item[0]?.actualWeight}  ${data?.itemsList?.item[0]?.actualWeightUnit}`}
          </p>

          <p className="absolute left-[55px] top-[439px]  text-[.7rem] ">
            fare
          </p>
          <p className="absolute left-[405px] top-[439px]  text-[.7rem] ">
            ₹ {data?.advanceAmount}
          </p>

          <p className="absolute left-[75px] top-[469px]  text-[.7rem] ">
            detention
          </p>
          <p className="absolute left-[405px] top-[469px]  text-[.7rem] ">
            ₹ {data?.balanceAmount}
          </p>

          <p className="absolute left-[105px] top-[498px]  text-[.7rem] ">
            otherChage
          </p>
          <p className="absolute left-[430px] top-[498px]  text-[.7rem] ">
            ₹ {data?.totalBillingAmount}
          </p>

          <p className="absolute left-[92px] top-[564px]  text-[.7rem] ">
            {data?.allotedVehicle[0]?.vehicleDriver}
          </p>
          <p className="absolute left-[426px] top-[564px]  text-[.7rem] ">
            {data?.allotedVehicle[0]?.vehicleOwner}
          </p>

          <p className="absolute left-[82px] top-[590px]  text-[.7rem] ">
            {data?.allotedVehicle[0]?.vehicleDriverPhone}
          </p>
          <p className="absolute left-[422px] top-[590px]  text-[.7rem] ">
            {data?.allotedVehicle[0]?.vehicleOwnerPhone}
          </p>

          <p className="absolute left-[82px] top-[626px]  text-[.7rem] ">
            {data?.remarks}
          </p>
        </div>
      </div>
      <div className="self-start">
        <div className="actions-right">
          <Button
            className="receipt-modal-download-button"
            onClick={downloadPDF}
            disabled={!(loader === false)}
          >
            {loader ? <span>Downloading</span> : <span>Download</span>}
          </Button>
          <Button
            className="receipt-modal-download-button ml-2 transition-colors duration-300 ease-in-out hover:bg-blue-700 active:bg-blue-100" // Added margin-right here
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
