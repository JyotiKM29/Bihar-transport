  "use client";
  import SearchVehicle from "./SearchVehicle";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm } from "react-hook-form";
  import * as z from "zod";
  import FieldForm from "../../component/FieldForm";
  import UnitAdd from "../UnitAdd";

  import { Button } from "../../../components/ui/button";

  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../../../components/ui/form";
  import { useContext, useEffect, useState } from "react";
  import { UserContext } from "../../../context/UserContextProvider";
  import { useToast } from "../../../components/ui/use-toast";

  import { Input } from "../../../components/ui/input";
  import { useRouter } from "next/navigation";

  const formSchema = z.object({
    adminId: z.string(),
    date: z.coerce.date({ message: "Date is required" }),
    vehicleNo: z.string({message:"vehicle no is required"}),
    vehicleType: z.string({ message: "Vehicle Type is required" }).optional(),
    DriverDetails: z.object({
      driverName: z.string({ message: "Driver Name is required" }).optional(),
      driverMobNo: z.coerce.number({ message: "Driver Mobile No is required" }).optional(),
    }),
    orderNo: z.string({ message: "Order No is required" }),
    arrangedBy: z.string({ message: "Arranged By is required" }),
    arrangedByName: z.string().optional(),
    arrangedByPhoneNo: z.coerce.number().optional(),
    materialDetails: z.object({
      qty: z.coerce.number({ message: "Quantity is required" }),
      qtyUnit: z.string({ message: "Quantity Unit is required" }),
      actualWgt: z.coerce.number({ message: "Actual Weight is required" }),
      actualWgtUnit: z.string({ message: "Actual Weight Unit is required" }),
      rateAsPer: z.string({ message: "Rate As Per is required" }),
      rate: z.string({ message: "Rate is required" }),
      chargedWgt: z.coerce.number({ message: "Charged Weight is required" }).optional(),
      chargedWgtUnit: z.string({ message: "Charged Weight Unit is required" }).optional(),
      availableWgt: z.coerce.number(),
      driverBhara: z.coerce.number(),
      commission: z.coerce.number(),
      netBhara: z.coerce.number(),
      newLedgerBalance: z.coerce.number(),
      remarks: z.string().optional(),
    }),
    payableLiability: z.string().nonempty({ message: "Payable Liability is required" }),
    recievableLiability: z.string().nonempty({ message: "Receivable Liability is required" }),
    billTo: z.string().nonempty({ message: "Bill To is required" }).optional(),
  });

  const AllocateVehicle = ({ params, ledgerBalance, setAvailableWgt, setAllotedWgt }) => {
    const { toast } = useToast();
    const [isloading, setIsLoading] = useState();
    const [receivableData, setReceivable] = useState([]);
    const [paymentLibilityData, setPaymentLibility] = useState([]);
    const [rateAsPerData, setRateAsPerData] = useState([]);
      const [isCommissionEditable, setIsCommissionEditable] = useState(false);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [allocate, setAllocate] = useState(false);
    const [routeDispatch, setRouteDispatch] = useState(false);
    const route = useRouter();
    const [data, setData] = useState(null);
    const userId = user?._id;
    const orderId = params.OrderId;

    console.log(ledgerBalance);

    const initialFormState = {
      adminId: "",
      orderNo: params.OrderId,
      date: new Date().toISOString()?.split("T")[0],
      vehicleNo: undefined,
      vehicleType: undefined,
      DriverDetails: {
        driverName: undefined,
        driverMobNo: undefined,
      },
      arrangedBy: undefined,
      arrangedByName: undefined,
      arrangedByPhoneNo: undefined,
      materialDetails: {
        qty: undefined,
        qtyUnit: undefined,
        actualWgt: undefined,
        actualWgtUnit: undefined,
        availableWgt: undefined,
        rateAsPer: "fixed",
        rate: undefined,
        chargedWgt: undefined,
        chargedWgtUnit: undefined,
        driverBhara: 0,
        commission: 0,
        netBhara: 0,
        newLedgerBalance: ledgerBalance,
        remarks: undefined,
      },
      payableLiability: undefined,
      recievableLiability: undefined,
      billTo: undefined,
    };

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: initialFormState,
    });

    const bookingID = form.getValues("bookingID");
    const DriverBhara = form.watch("materialDetails.driverBhara", 0);
    const vehicleNo = form.watch("vehicleNo");
    let allotedSpace = form.watch("materialDetails.actualWgt");

    let availableWgt = form.getValues("materialDetails.availableWgt");

    useEffect(() => {
      availableWgt = form.getValues("materialDetails.availableWgt");
      setAvailableWgt(availableWgt);

      allotedSpace = form.getValues("materialDetails.actualWgt");
      console.log("here", allotedSpace);
      setAllotedWgt(allotedSpace);

    }, [vehicleNo, allotedSpace, form.watch("actualWgt")]);

    // function calNetBhara(driverBhara) {
    //   const commission = driverBhara * 0.05;
    //   form.setValue("materialDetails.commission", commission.toFixed(2));
    //   const netBhara = driverBhara - commission;
    //   form.setValue("materialDetails.netBhara", netBhara.toFixed(2));
    // }





    useEffect(() => {
      calNetBhara(DriverBhara);
    }, [DriverBhara]);




  const handleCommissionChange = (e) => {
      const commission = parseFloat(e.target.value) || 0;
      form.setValue("materialDetails.commission", commission.toFixed(2));
      updateNetBharaAndPercentage(commission);
    };

    const updateNetBharaAndPercentage = (commission) => {
      const driverBhara = parseFloat(form.getValues("materialDetails.driverBhara")) || 0;
      const netBhara = driverBhara - commission;
      const percentage = driverBhara ? (commission / driverBhara) * 100 : 0;

      form.setValue("materialDetails.netBhara", netBhara.toFixed(2));
      form.setValue("materialDetails.commissionPercentage", percentage.toFixed(2));
    };

    const calNetBhara = (driverBhara) => {
      if (!isCommissionEditable) {
        const commission = driverBhara * 0.05;
        form.setValue("materialDetails.commission", commission.toFixed(2));
        updateNetBharaAndPercentage(commission);
      } else {
        const commission = parseFloat(form.getValues("materialDetails.commission")) || 0;
        updateNetBharaAndPercentage(commission);
      }
    };

    useEffect(() => {
      const driverBhara = parseFloat(form.getValues("materialDetails.driverBhara")) || 0;
      calNetBhara(driverBhara);
    }, [isCommissionEditable]);




    // for stop scrolling 

    useEffect(() => {
      const disableScrollOnNumberInput = (e) => {
        if (e.target.type === "number") {
          e.preventDefault();
        }
      };

      const handleWheelEvent = (e) => {
        if (document.activeElement.type === "number") {
          document.activeElement.blur();
        }
      };

      window.addEventListener("wheel", disableScrollOnNumberInput, {
        passive: false,
      });
      window.addEventListener("wheel", handleWheelEvent);

      return () => {
        window.removeEventListener("wheel", disableScrollOnNumberInput);
        window.removeEventListener("wheel", handleWheelEvent);
      };
    }, []);







    async function myhandleSubmit(value) {
      try {
        const res = formSchema.parse(value);
        console.log("solved", res);
      } catch (error) {
        console.log("hi", error);
      }

      

      value.adminId = user?._id;

      console.log("hey bro: ", value);

      if(routeDispatch){
        setLoading2(true);
      } 
      else 
        setIsLoading(true);

      try {
        const response = await fetch("/api/vehicleAllocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        const newResult = await response.json();

        if (response.ok) {


        
          displayToast("Successfully allocated vehicle", "✅");
          if (routeDispatch) {
            setLoading2(false);
            route.push(`/admin/booking/dispatedVehicle/${newResult?.message?._id}`);
          }
          else {
            setIsLoading(false);
          }

          if (allocate) {
            console.log(allocate, orderId);
            route.push(`/admin/booking/${orderId}/print/${orderId}`);
          }
          form.reset(initialFormState);
        } else {
          console.error("Error:", newResult.message);
          displayToast("Error", "❌", newResult.message);
          if(routeDispatch){
        setLoading2(false);
      } 
      else 
        setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        displayToast("Error while sending data", "❌", newResult.message);
      if(routeDispatch){
        setLoading2(false);
      } 
      else 
        setIsLoading(false);
      }
    }

    const displayToast = (title, action, description = undefined) => {
      toast({
        title,
        action,
        description,
      });
    };

    useEffect(() => {
      if (user?._id) {
        fetchReceivable();
        fetchPaymentLibility();
        fetchRateAsPer();
      }
    }, [userId]);

    const fetchPaymentLibility = async () => {
      try {
        const response = await fetch(`/api/setting/paymentLiablity/get/${userId}`);
        const result = await response.json();

        console.log("result payment Liablity: ", result);
        setPaymentLibility(result.data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    const fetchReceivable = async () => {
      try {
        const response = await fetch(`/api/setting/receivable/get/${userId}`);
        const result = await response.json();

        console.log("result: ", result);
        setReceivable(result.data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    const fetchRateAsPer = async () => {
      try {
        const response = await fetch(`/api/setting/rateAsPer/get/${userId}`);
        const result = await response.json();

        console.log("result: ", result);
        setRateAsPerData(result.data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    const fetchUnits = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/getunits/${userId}`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          setLoading(false);

          setData(data.data);
          console.log(data);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    useEffect(() => {
      fetchUnits();
    }, [userId]);

    const handleUnitAdded = () => {
      fetchUnits();
    };


    return (
      <div className="max-w  mt-14 overflow-hidden rounded-2xl  bg-white px-4 py-4  md:px-10 lg:my-4 ">
        <h2 className="mb-6 text-center text-xl font-semibold text-red-600">
          {" "}
          fill below detail for vehicle allocation
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(myhandleSubmit)}>
            <div className="grid w-full  grid-cols-1  gap-6 xl:grid-cols-2  xl:space-x-6">
              <div className=" row-span-3 rounded-xl border px-6 py-4 shadow-md ">
                <h2 className="text-2xl font-medium text-blue-500 underline">
                  Hired Vehicle Details
                </h2>

                <FieldForm
                  form={form}
                  name="orderNo"
                  label="Order No"
                  type="string"
                />
                <FieldForm form={form} name="date" label="Date " type="date" />
                <FormField
                  control={form.control}
                  name="vehicleNo"
                  render={({ field }) => (
                    <SearchVehicle
                      nameValue="vehicleNo"
                      form={form}
                      field={field}
                      label="Vehicle No"
                    />
                  )}
                />

                <FieldForm
                  form={form}
                  name="vehicleType"
                  label="Vehicle Type "
                  type="text"
                />

                <div className="flex items-center justify-center ">
                  <div>
                    <FieldForm
                      form={form}
                      name="DriverDetails.driverName"
                      label="Driver Details "
                      type="text"
                    />
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="DriverDetails.driverMobNo"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex items-center justify-center gap-4">
                            <FormLabel className="text-nowrap text-sm lg:text-base"></FormLabel>

                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                placeholder="Driver Mobile No"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="arrangedBy"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Arranged By :
                        </FormLabel>

                        <FormControl>
                          <select {...field}>
                            <option value="">Select Arranged By </option>
                            <option value="Self">Self</option>
                            <option value="Other transporter">
                              Other transporter
                            </option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              {form.watch("arrangedBy") === "Other transporter" && (
                <>
                  <FieldForm
                    form={form}
                    name="arrangedByName"
                    label="Name "
                    type="text"
                  />
                  <FieldForm
                    form={form}
                    name="arrangedByPhoneNo"
                    label="Mobile No"
                    type="number"
                  />
                </>
              )}
            </div>

            <div className=" row-span-3 rounded-xl border px-6 py-4 shadow-md ">
              <h2 className="text-2xl font-medium text-blue-500 underline">
                Material & Freight Payable Details
              </h2>
              <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name="materialDetails.qty"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Qty :
                        </FormLabel>
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                            />
                          </FormControl>

                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
                {/* <FormField
                  control={form.control}
                  name="materialDetails.qtyUnit"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-1 items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                              <option value=""> Select Qty</option>
                              {Array.isArray(data) &&
                                data.map((unit) => (
                                  <option key={unit.name} value={unit.name}>
                                    {unit.name}
                                  </option>
                                ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                /> */}

                <FormField
                  control={form.control}
                  name="materialDetails.qtyUnit"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-1 items-center justify-center">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                              {/* Default option similar to the first component */}
                              {/* <option key={qtyUnit}>
                {qtyUnit ? qtyUnit : "Select Quantity Unit"} */}
                              {/* </option> */}

                              <option> Select QTY unit</option>

                              {Array.isArray(data) &&
                                data.map((unit) => (
                                  <option key={unit.name} value={unit.name}>
                                    {unit.name}
                                  </option>
                                ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />

                <UnitAdd onUnitAdded={handleUnitAdded} />
              </div>

              <div className="flex w-full items-center gap-0">
                <FormField
                  control={form.control}
                  name="materialDetails.actualWgt"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center justify-center gap-4">
                        <FormLabel className="text-nowrap text-sm lg:text-base">
                          Actual Weight :
                        </FormLabel>
                        <div className="relative flex flex-1 flex-col">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                            />
                          </FormControl>
                          <p className="absolute bottom-1 w-full bg-orange-100 text-[12px]">
                            Must less than {availableWgt} KG
                          </p>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="materialDetails.actualWgtUnit"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-1 items-center justify-center ">
                        <div className="flex flex-1 flex-col">
                          <FormControl>
                            <select
                              {...field}
                              className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                            >
                              <option value=""> Select Unit of Weight </option>
                              <option value="kg">Kg</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="materialDetails.rateAsPer"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Rate as Per :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                            <option value="">
                              {rateAsPerData && rateAsPerData.length > 0
                                ? "Select Rate As Per"
                                : "Loading..."}
                            </option>
                            {Array.isArray(rateAsPerData) &&
                              rateAsPerData.map((rate) => (
                                <option key={rate.value} value={rate.value}>
                                  {rate.name}
                                </option>
                              ))}
                          </select>
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

              <FieldForm
                form={form}
                name="materialDetails.rate"
                label="Rate "
                type="text"
              />

              {form.watch(`materialDetails.rateAsPer`, "fixed") !== "fixed" && (
                <>
                  <div className="flex w-full items-center gap-0">
                    <FormField
                      control={form.control}
                      name="materialDetails.chargedWgt"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex items-center justify-center gap-4">
                            <FormLabel className="text-nowrap text-sm lg:text-base">
                              Charged Weight :
                            </FormLabel>
                            <div className="flex flex-1 flex-col">
                              <FormControl>
                                <Input
                                  type="text"
                                  {...field}
                                  className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                                />
                              </FormControl>

                              <FormMessage />
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="materialDetails.chargedWgtUnit"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-1 items-center justify-center ">
                            <div className="flex flex-1 flex-col">
                              <FormControl>
                                <select
                                  {...field}
                                  className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                                >
                                  <option value="">
                                    {" "}
                                    Select Unit of Weight{" "}
                                  </option>
                                  <option value="kg">Kg</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </>
              )}

              <FieldForm
                form={form}
                name="materialDetails.driverBhara"
                label="Driver Bhara ( &#8377;)"
                type="number"
              />
              {/* 
              <FormField
                control={form.control}
                name="materialDetails.commission"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Commission :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                            <p className="text-xl font-medium">&#8377;</p>
                            <Input
                              type="text"
                              {...field}
                              className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                              readOnly
                            />
                          </div>
                        </FormControl>
                        <p className="-mt-2 text-[12px]">
                          commision value is 5% of Driver Bhara
                        </p>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              /> */}

              <FormField
                control={form.control}
                name="materialDetails.commission"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Commission :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                            <p className="text-xl font-medium">&#8377;</p>
                            <Input
                              type="text"
                              {...field}
                              className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              readOnly={!isCommissionEditable}
                              onChange={handleCommissionChange}
                            />
                          </div>
                        </FormControl>
                        <p className="-mt-2 text-[12px]">
                          By default Commission value is 5% of Driver Bhara
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setIsCommissionEditable(!isCommissionEditable)
                          }
                          className="mt-2 text-sm text-blue-500"
                        >
                          {isCommissionEditable
                            ? "Lock Commission"
                            : "Edit Commission"}
                        </button>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="materialDetails.commissionPercentage"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Commission Percentage :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="materialDetails.netBhara"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Net Bhara :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                            <p className="text-xl font-medium">&#8377;</p>
                            <Input
                              type="text"
                              {...field}
                              className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                              readOnly
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="materialDetails.newLedgerBalance"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Ledger Balance :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-yellow-100 pl-2">
                            <p className="text-xl font-medium">&#8377;</p>
                            <Input
                              type="number"
                              value={Number(ledgerBalance).toFixed(2)}
                              className="border-none bg-yellow-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                              readOnly
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

              <FieldForm
                form={form}
                name="materialDetails.remarks"
                label="Remarks "
                type="text"
              />
            </div>

            <div className="row-span-1 rounded-xl bg-red-300 p-4 shadow-xl  ">
              <FormField
                control={form.control}
                name="payableLiability"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Payable Liability :
                      </FormLabel>

                      <FormControl>
                        <select
                          {...field}
                          className="border border-red-300 bg-red-200 focus-visible:ring-1"
                        >
                          <option value="">
                            {paymentLibilityData &&
                            paymentLibilityData.length > 0
                              ? "Select payable liability"
                              : "Loading..."}
                          </option>
                          {Array.isArray(paymentLibilityData) &&
                            paymentLibilityData.map((rate) => (
                              <option key={rate.value} value={rate.value}>
                                {rate.name}
                              </option>
                            ))}
                        </select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="recievableLiability"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Recievable Liability :
                      </FormLabel>

                      <FormControl>
                        <select
                          {...field}
                          className="border border-red-300 bg-red-200 focus-visible:ring-1"
                        >
                          <option value="">
                            {receivableData && receivableData.length > 0
                              ? "Select Recievable Liabilitly"
                              : "Loading..."}
                          </option>
                          {Array.isArray(receivableData) &&
                            receivableData.map((rate) => (
                              <option key={rate.value} value={rate.value}>
                                {rate.name}
                              </option>
                            ))}
                        </select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            {form.watch(`recievableLiability`, "consignor") ===
              "thirdParty" && (
              <>
                <div className="  rounded-2xl border bg-blue-300 p-4 shadow-xl">
                  <FormField
                    control={form.control}
                    name="billTo"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex items-center justify-center gap-4">
                          <FormLabel className="text-nowrap text-sm lg:text-base">
                            Bill To
                          </FormLabel>
                          <div className="flex flex-1 flex-col">
                            <FormControl>
                              <div className="mb-2 flex h-12 items-center justify-center gap-1 rounded bg-blue-100 pl-2">
                                <p className="text-xl font-medium">&#8377;</p>
                                <Input
                                  type="text"
                                  {...field}
                                  className="border-none bg-blue-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                />
                              </div>
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-4  grid w-full grid-cols-1 gap-4 p-4 xl:grid-cols-2 xl:gap-14">
            <Button
              type="submit"
              onClick={(e) => {
                setAllocate(true);
              }}
            >
              {isloading ? "Loading..." : "Assign Vehicle Only"}
            </Button>
            <Button
              type="submit"
              onClick={(e) => {
                setRouteDispatch(true);
              }}
            >
              {loading2 ? "Loading..." : " Continue & Dispatch"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AllocateVehicle;
