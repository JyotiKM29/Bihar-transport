"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";
import { Form } from "../../../components/ui/form";
import { useContext,useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { useToast } from "../../../components/ui/use-toast";
import InflationChart from './InflationChart';

const formSchema = z.object({
  adminId: z.string(),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
});

const GSTWise = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState();
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);

  const dataBar =[data?.RCM , data?.FCM];
  const categoryBar = ["RCM" , "FCM" ]

 

  const initialFormState = {
    adminId: "",
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const StartDate = form.getValues('fromDate');
  const EndDate = form.getValues( 'toDate') ;

  async function myhandleSubmit(value) {
    console.log(formSchema.safeParse(value));

    try {
      const res = formSchema.parse(value);
      console.log("solved", res);
    } catch (error) {
      console.log("hi", error);
    }

    value.adminId = user?._id;
    try {
      const response = await fetch("/api/report/GSTWise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      console.log(response);

      const newResult = await response.json();
      console.log(newResult);

      if (response.ok) {
        setIsLoading(false);
        displayToast("Successfully", "✅");
        // console.log("New booking created!", newResult);
        setData(newResult.data);
        console.log('data :',data )
        form.reset(initialFormState);
      } else {
        console.error("Error:", newResult.message);
        displayToast("Error", "❌", newResult.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      displayToast("Error ", "❌", newResult.message);
      setIsLoading(false);
    }
  }

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(myhandleSubmit)}
          className="flex max-w-full flex-col items-center justify-between  gap-4 md:flex-row "
        >
          <div className="flex-1">
            <FieldForm
              form={form}
              name="fromDate"
              label="From Date"
              type="date"
            />
          </div>
          <div className="flex-1">
            <FieldForm form={form} name="toDate" label="To Date" type="date" />
          </div>
          <Button type="submit"className="w-full lg:w-1/5 shadow-md bg-violet-500 hover:bg-violet-700 text-white ">
            {isloading ? "Loading..." : "Generate Report"}
          </Button>
        </form>
      </Form>

<div className="flex gap-8 ">


      {/* Table */}
      {data && Object.keys(data).length > 0 && <table className="w-1/2 mt-10 ">
        <thead>
          <tr>
          <th className="border py-1 px-2 bg-blue-200">RCM</th>
          <th className="border py-1 px-2 bg-blue-200">FCM</th>
         
          </tr>
        </thead>
        <tbody>
 
      <tr >
        <td className="border px-2 py-1 text-center">{data?.RCM}</td>
        <td className="border px-2 py-1 text-center">{data?.FCM}</td>
        
      </tr>
   
</tbody>

      </table> }


      {/* graph */}

<div className="w-1/2">
{(data && Object.keys(data).length > 0)? <InflationChart  data={dataBar} category={categoryBar}
  totalValue={data.totalBooking}
/> : <p className="font-light text-red-700 ">No  Data Available for this period. Select Dates</p>}
</div>
     
      </div>
    </div>
  );
};

export default GSTWise;
