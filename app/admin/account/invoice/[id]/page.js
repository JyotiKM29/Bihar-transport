"use client";
import { Button } from "../../../../components/ui/button";
import { useContext, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { UserContext } from "../../../../context/UserContextProvider";

function Invoice({params}) {
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);
  const [invoiceData, setInvoiceData] = useState([]);
  const [data ,setData] = useState();
const id = params.id;
  const userId = user?._id;

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/accounting/invoice/${userId}`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          

          console.log("Invoice Generated", result);

          if (result.booking) {
            setInvoiceData(result.booking);
            // Since you're now waiting for the data to be fetched and set, find the index here
            const bookingIndex = result.booking.findIndex(booking => booking._id === id);
            if (bookingIndex !== -1) {
              // Only set the data if the booking is found
              setData(result.booking[bookingIndex]);
              console.log('Data', result.booking[bookingIndex]);
            } else {
              console.log('Booking with the specified ID was not found.');
            }
          } else {
            console.log('No booking data was returned.');
          }
        }
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

  return (
    <div className="flex   items-center justify-around">
      {/* receipt action */}

      <div className="w-[450px]">
        {/* actual receipt */}
        <div className="actual-receipt h-[842px] w-[595px] relative">
          <div className="absolute h-full w-full  bg-white ">
            <Image
              src="/BIHAR TRANSPORT.svg"
              alt="Bihar Transport"
              layout="fill"
              objectFit="contain"
            />
           
          </div>
          <p className="absolute top-[166px] left-[476px]  text-[.7rem]">{data?.date.slice(0,10)}</p>

          <p className="absolute top-[235px] left-[55px]  text-[.7rem]">{data?.consigneeName}</p>
          <p className="absolute top-[235px] left-[418px]  text-[.7rem]">{data?.consigneeMobileNumber}</p>

          <p className="absolute w-1/3 top-[312px] left-[49px]  text-[.5rem] ">{data?.loadingPoints}</p>
          <p className="absolute w-1/3 top-[312px] left-[380px]  text-[.5rem] ">{data?.unloadingPoints}
</p>

          <p className="absolute  top-[340px] left-[69px]  text-[.7rem] ">{data?.allotedVehicle[0]?.vehicleNo}</p>
          <p className="absolute top-[340px] left-[424px]  text-[.7rem] ">{data?.vehicleType}</p>


          <p className="absolute top-[368px] left-[69px]  text-[.7rem] ">{data?.material}</p>
          <p className="absolute top-[368px] left-[408px]  text-[.7rem] ">{data?.chargedWeight}</p>

          <p className="absolute top-[439px] left-[55px]  text-[.7rem] ">fare</p>
          <p className="absolute top-[439px] left-[405px]  text-[.7rem] ">{data?.advanceAmount}</p>
        
        
          <p className="absolute top-[469px] left-[75px]  text-[.7rem] ">detention</p>
          <p className="absolute top-[469px] left-[405px]  text-[.7rem] ">{data?.balanceAmount}</p>

          <p className="absolute top-[498px] left-[105px]  text-[.7rem] ">otherChage</p>
          <p className="absolute top-[498px] left-[430px]  text-[.7rem] ">{data?.partyBhara}</p>


          <p className="absolute top-[564px] left-[92px]  text-[.7rem] ">{data?.allotedVehicle[0]?.vehicleDriver}</p>
          <p className="absolute top-[564px] left-[426px]  text-[.7rem] ">{data?.allotedVehicle[0]?.vehicleOwner}</p>

          <p className="absolute top-[590px] left-[82px]  text-[.7rem] ">{data?.allotedVehicle[0]?.vehicleDriverPhone}</p>
          <p className="absolute top-[590px] left-[422px]  text-[.7rem] ">{data?.allotedVehicle[0]?.vehicleOwnerPhone}</p>

          <p className="absolute top-[626px] left-[82px]  text-[.7rem] ">{data?.remarks}</p>
          
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
        </div>
      </div>
    </div>
  );
}

export default Invoice;
