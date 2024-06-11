"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { useContext, useState } from "react";
import * as z from "zod";
import { useToast } from "../../../../components/ui/use-toast";
import { UserContext } from "../../../../context/UserContextProvider";
import {
  Form,
  FormField,
} from "../../../../components/ui/form";
import { Input } from "@/app/components/ui/input";
import FieldForm from "../../FieldForm";
import { useRouter } from "next/navigation";
import SearchVOD from "./SearchVOD";

const formSchema = z.object({
  vehicleNo: z.string(),
  vehicleType: z.string(),
  vehicleLength: z.string(),
  passingWeight: z.string(),
  carryWeight: z.string(),
  driverMobileNo: z.coerce.string(),
  ownerMobileNo: z.coerce.string(),
  fromAddress: z.string(),
  specificRoutes: z.string(),
  inTime:  z.string(),
  outTime: z.string(),
  remarks: z.string(),
  location: z.array(z.string()),
});

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};


const VehicleEntry = () => {
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const initialFormState = {
    vehicleNo: undefined,
    vehicleType: undefined,
    vehicleLength: undefined,
    passingWeight:  undefined,
    carryWeight: undefined,
    driverMobileNo: undefined,
    ownerMobileNo: undefined,
    fromAddress: undefined,
    specificRoutes: undefined,
    inTime: formatTime(new Date().getTime()),
    outTime: undefined,
    remarks: undefined,
    location:  [],
  };

  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });

  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  async function MyHandleSubmit(values) {
   
    console.log(values);

    try {
     
      const response = await fetch('/api/Attendence/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),  
      });
    console.log(response);
  
    const newResult = await response.json();
    
  
    if(response.ok){
      setIsLoading(false);
      displayToast("Successfully Booked, Click view Booking button to view the booking", "✅");
      const userDetail = newResult.user;
      reset(initialFormState);
    }
  
    else{
      console.error("Error:", newResult.message);
      displayToast("Error", "❌", newResult.message);
      setIsLoading(false);
    }
      } catch (error) {
        console.error("Error:", newResult.message);
      displayToast("Error", "❌", newResult.message);
      setIsLoading(false);
      }



  }


  function handleBack(){
    route.push("/admin/vehicle")
  }

  return (
    <div className="min-h-[90vh] p-8 rounded-xl shadow-2xl bg-white">
    <div>
      <Button onClick={handleBack}>Back</Button>
    </div>
    <h2 className="text-2xl font-semibold text-center underline text-blue-800 mb-10">In a Vehicle </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(MyHandleSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
          <FormField
          control={form.control}
          name="vehicleNo"
          render={({ field }) => (
            <SearchVOD
              form={form}
              field={field}
              label="Vehicle No"
             
            />
          )}
        />
    {/* <FieldForm form={form} nameValue="vehicleNo" label="Vehicle No" type="text" /> */}
    <FieldForm form={form} nameValue="vehicleType" label="Vehicle Type" type="text" />
    <FieldForm form={form} nameValue="vehicleLength" label="Vehicle Length" type="text" />
    <FieldForm form={form} nameValue="passingWeight" label="Passing Weight" type="text" />
    <FieldForm form={form} nameValue="carryWeight" label="Carry Weight" type="text" />
    <FieldForm form={form} nameValue="driverMobileNo" label="Driver No" type="text" />
    <FieldForm form={form} nameValue="ownerMobileNo" label="Owner No" type="text" />
    <FieldForm form={form} nameValue="fromAddress" label="From Address" type="text" />
    <FieldForm form={form} nameValue="specificRoutes" label="Specific Routes No" type="text" />
    <FieldForm form={form} nameValue="inTime" label="In Time" type="time" />
    <FieldForm form={form} nameValue="outTime" label="Out Time" type="time" />
    <FieldForm form={form} nameValue="remarks" label="Remarks" type="text" />
    </div>    
    <div className="w-full flex justify-center mt-10">
    <Button type="submit" className="h-12 text-lg w-full lg:w-1/3">
              {isLoading ? "Loading..." : "Submit"}
            </Button>
    </div>

           
         
        </form>
      </Form>
    </div>
  );
};

export default VehicleEntry;
