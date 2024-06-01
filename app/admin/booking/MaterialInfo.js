"use client";
import ProductList from "./ProductAdd";
import UnitAdd from "./UnitAdd";
import React, { useContext, useEffect, useState } from "react";
import FieldForm from "../component/FieldForm";
import { Button } from "../../components/ui/button";
import SearchItem from "./SearchItem";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { UserContext } from "../../context/UserContextProvider";
import { parse } from "path";

const MaterialInfo = ({ form, nameValue, onAddItem, setMaterialItems }) => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [unitsData, setUnitsData] = useState([]);
  const [rateAsPerData, setRateAsPerData] = useState([]);

  useEffect(() => {
    fetchUnits(); // Initial fetch when component mounts
    fetchRateAsPer();

   
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

    window.addEventListener("wheel", disableScrollOnNumberInput, { passive: false });
    window.addEventListener("wheel", handleWheelEvent);

    return () => {
      window.removeEventListener("wheel", disableScrollOnNumberInput);
      window.removeEventListener("wheel", handleWheelEvent);
    };

  }, []);

  const fetchUnits = async () => {
    // Fetch units data from API
    try {
      const response = await fetch(`/api/getunits/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUnitsData(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchRateAsPer = async () => {
    // Fetch units data from API
    try {
      const response = await fetch(`/api/setting/rateAsPer/get/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("rate as per data:", data.data);
      setRateAsPerData(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUnitAdded = () => {
    fetchUnits(); // Fetch units data after a new unit is added
  };

  const { user } = useContext(UserContext);

  const userId = user?._id;

  

  function calPartyBhara() {
    const totalAmount = items.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.amount),
      0,
    );

    const percentageAmount = parseFloat(GSTPercentage) * parseFloat(basicAmount);

    const totalMaterialAmount = parseFloat(basicAmount) + percentageAmount;
    // console.log("totalMaterialAmount", totalMaterialAmount);

    form.setValue(`${nameValue}[${items.length}].amount`,totalMaterialAmount );
   

    // form.setValue("partyBhara", totalAmount);
    // console.log("paty bhara from material info :" ,form.getValues("partyBhara"));

    return totalAmount;
  }

  function calAmount(rate, quantity, GSTPercentage = 0, rateMultiple) {
    let amount;
    if (rateMultiple === "Actual weight") {
      const quantity = form.getValues(
        `${nameValue}[${items.length}].actualWeight`,
      );
      amount = parseFloat(rate) * parseFloat(quantity);
    } else if (rateMultiple === "charged weight") {
      const quantity = form.getValues(
        `${nameValue}[${items.length}].chargedWeight`,
      );
      amount = parseFloat(rate) * parseFloat(quantity);
    } else if (rateMultiple === "quantity") {
      const quantity = form.getValues(`${nameValue}[${items.length}].quantity`);
      amount = parseFloat(rate) * parseFloat(quantity);
    } else {
      amount = parseFloat(rate) * parseFloat(quantity);
    }
    amount = isNaN(amount) ? 0 : amount;
    form.setValue(`${nameValue}[${items.length}].basicAmount`, amount);
    const total = parseFloat(amount) * Number(GSTPercentage);
    return parseFloat(amount + total);
  }

  const rateMultiple = form.watch(`${nameValue}[${items.length}].rateAsPer`);
  const quantity = form.watch(`${nameValue}[${items.length}].quantity`);
  const rate = form.watch(`${nameValue}[${items.length}].rate`);
  const qtyUnit = form.watch(`${nameValue}[${items.length}].quantityUnit`, "");
  const basicAmount = form.watch(`${nameValue}[${items.length}].basicAmount`, "");
 


  const GSTPercentage = form.watch(
    `${nameValue}[${items.length}].GSTPercentage`,
    "",
  );
  const GSTType = form.watch(`${nameValue}[${items.length}].GSTType`);

  useEffect(() => {
    if (GSTType === "RCM") {
      form.setValue(
        `${nameValue}[${items.length}].GSTPercentage`,
        GSTPercentage,
      );
      // form.setValue(`${nameValue}[${items.length}].GSTType`, "RCM")
    }
  }, [GSTType]);

  useEffect(() => {
    if (!isNaN(parseFloat(rate)) && !isNaN(parseFloat(quantity))) {
      let result = calAmount(rate, quantity, GSTPercentage, rateMultiple);

      form.setValue(`${nameValue}[${items.length}].amount`, result);
    }
    calPartyBhara();
  }, [
    rate,
    quantity,
    items.length,
    nameValue,
    GSTPercentage,
    rateMultiple,
    GSTType,
    basicAmount,
  ]);

  function handleAdditionalItem() {
    const newItem = {
      material: form.getValues(`${nameValue}[${items.length}].material`),
      hsnNo: form.getValues(`${nameValue}[${items.length}].hsnNo`),
      quantity: form.getValues(`${nameValue}[${items.length}].quantity`),
      quantityUnit: form.getValues(
        `${nameValue}[${items.length}].quantityUnit`,
      ),
      actualWeight: form.getValues(
        `${nameValue}[${items.length}].actualWeight`,
      ),
      actualWeightUnit: form.getValues(
        `${nameValue}[${items.length}].actualWeightUnit`,
      ),
      chargedWeight: form.getValues(
        `${nameValue}[${items.length}].chargedWeight`,
      ),
      chargedWeightUnit: form.getValues(
        `${nameValue}[${items.length}].chargedWeightUnit`,
      ),
      rateAsPer: form.getValues(`${nameValue}[${items.length}].rateAsPer`),
      rateAsPerOption: form.getValues(
        `${nameValue}[${items.length}].rateAsPerOption`,
      ),
      rate: form.getValues(`${nameValue}[${items.length}].rate`),
      rateUnit: form.getValues(`${nameValue}[${items.length}].rateUnit`),
      GSTPercentage: form.getValues(
        `${nameValue}[${items.length}].GSTPercentage`,
      ),
      GSTType: form.getValues(`${nameValue}[${items.length}].GSTType`),
      amount: form.getValues(`${nameValue}[${items.length}].amount`),
      basicAmount: form.getValues(`${nameValue}[${items.length}].basicAmount`),
    };

    // onAddItem(newItem);
    const data = form.getValues(nameValue);
    console.log("item list after update:", data);

    const updatedItem = form.getValues("itemsList") && [];

    setItems([...updatedItem, newItem]);
    form.setValue(nameValue, [...items, newItem]);
    setMaterialItems([...updatedItem, newItem]);

    setShowForm(false);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold "> Add Materials :</h2>

      {/* Close and Reset button */}
      <div className="my-2 flex w-full  items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          className="flex-1 border-2 border-red-200 bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-500 "
          onClick={() => {
            setItems([]);
            form.setValue(nameValue, []);
            setShowForm(false);
          }}
        >
          Delete all Material
        </Button>
        <Button
          type="button"
          className="flex-1  border-2 border-green-200 bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-700 "
          onClick={() => setShowForm(!showForm)}
          variant="secondary"
        >
          {showForm ? "Close" : "Add Item "}
        </Button>
      </div>

      {/* Form */}
      <div>
        {showForm && (
          <>
            <p className="mb-1">Fill in the details below:</p>
            <div className="flex items-center">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`${nameValue}[${items.length}].material`}
                  render={({ field }) => (
                    <SearchItem
                      nameValue={nameValue}
                      items={items}
                      form={form}
                      field={field}
                      label="Material Name"
                    />
                  )}
                />
              </div>
              <ProductList />
            </div>

            {/* <FieldForm
              form={form}
              name={`${nameValue}[${items.length}].hsnNo`}
              label="HSN No"
              type="text"
            /> */}
            <div className="flex w-full items-center gap-0">
              <FormField
                control={form.control}
                name={`${nameValue}[${items.length}].quantity`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Quantity :
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
                name={`${nameValue}[${items.length}].quantityUnit`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-1 items-center justify-center ">
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select
                            {...field}
                            className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                          >
                            <option key={qtyUnit}>
                              {qtyUnit ? qtyUnit : "Select Quantity Unit"}{" "}
                            </option>
                            {Array.isArray(unitsData) &&
                              unitsData.map((unit) => (
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

              {/* <Link
                href="/admin/settings/newunit"
                className="flex h-10 w-10 items-center justify-center rounded border bg-gray-100 text-xl"
              >
                +
              </Link> */}
            </div>
            <div className="flex w-full items-center gap-0">
              <FormField
                control={form.control}
                name={`${nameValue}[${items.length}].actualWeight`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Actual Weight :
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
                name={`${nameValue}[${items.length}].actualWeightUnit`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-1 items-center justify-center ">
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select
                            {...field}
                            className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                          >
                            <option value="">Select Charged Weight Unit</option>
                            <option value="Box"> Box</option>
                            <option value="Bag"> Bag</option>
                            <option value="Basta"> Basta</option>
                            <option value="Bundle"> Bundle</option>
                            <option value="Carton"> Carton</option>
                            <option value="Carate"> Carate</option>
                            <option value="Drums"> Drums</option>
                            <option value="Loose"> Loose</option>
                            <option value="Packet"> Packet</option>
                            <option value="Roll"> Roll</option>
                            <option value="TIN"> TIN</option>
                            <option value="TON"> TON</option> 
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
                name={`${nameValue}[${items.length}].actualWeightUnit`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-1 items-center justify-center ">
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select
                            {...field}
                            className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                          >
                            {/* <option value=""> Select Actual Weight Unit</option> */}
                            <option key={qtyUnit}>
                              {qtyUnit ? qtyUnit : "Select Actual Weight Unit"}{" "}
                            </option>
                            {Array.isArray(unitsData) &&
                              unitsData.map((unit) => (
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
              {/* <FormField
                control={form.control}
                name={`${nameValue}[${items.length}].rateAsPer`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-1 items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Rate as Per :
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select
                            {...field}
                            className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                          >
                            <option value="fixed"> fixed </option>

                            <option value="Actual weight">Actual weight</option>
                            <option value="charged weight">
                              charged weight
                            </option>
                            <option value="quantity">quantity</option>
                            <option value="distance ">distance </option>

                            <option value="Per trip"> Per trip</option>
                            <option value="per kg"> per kg </option>
                            <option value="Per ton">Per ton</option>
                            <option value="Bundles">Bundles</option>
                            <option value="pounds">pounds</option>
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
                name={`${nameValue}[${items.length}].rateAsPer`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-1 items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        Rate as Per :
                      </FormLabel>

                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select
                            {...field}
                            className="rounded-bl rounded-br-[0px] rounded-tl rounded-tr-[0px]"
                          >
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
            </div>

            {form.watch(`${nameValue}[${items.length}].rateAsPer`, "fixed") !==
              "fixed" && (
              <>
                <div className="flex w-full items-center gap-0">
                  <FormField
                    control={form.control}
                    name={`${nameValue}[${items.length}].rate`}
                    render={({ field }) => {
                      return (
                        <FormItem className=" flex flex-1 items-center justify-center gap-4">
                          <FormLabel className="text-nowrap text-sm lg:text-base">
                            Rate :
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
                    name={`${nameValue}[${items.length}].rateUnit`}
                    render={({ field }) => {
                      return (
                        <FormItem className="flex items-center justify-center ">
                          <div className="flex flex-1 flex-col">
                            <FormControl>
                              <select
                                {...field}
                                className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                              >
                                <option value=""> Select Rate Unit</option>
                                <option value="Kg">Kg (Kilo gram)</option>
                                <option value="g">g (gram) </option>
                                <option value="Ton">Ton</option>
                                <option value="Quintals">Quintals</option>
                                <option value="Dozen">Dozen </option>
                                <option value="Box">Box</option>
                                <option value="Bundles">Bundles</option>
                                <option value="pounds">pounds</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="flex w-full items-center gap-0">
                  <FormField
                    control={form.control}
                    name={`${nameValue}[${items.length}].chargedWeight`}
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-1 items-center justify-center gap-4">
                          <FormLabel className="text-nowrap text-sm lg:text-base">
                            Charged Weight :
                          </FormLabel>
                          <div className="flex flex-1 flex-col">
                            <FormControl>
                              <Input
                                type="number"
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
                    name={`${nameValue}[${items.length}].chargedWeightUnit`}
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-1 items-center justify-center ">
                          <div className="flex flex-1 flex-col">
                            <FormControl>
                              <select
                                {...field}
                                className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                              >
                                {/* <option value=""> Select Charged Weight Unit</option> */}
                                <option key={qtyUnit}>
                                  {qtyUnit
                                    ? qtyUnit
                                    : "Select Charged Weight Unit"}{" "}
                                </option>
                                {Array.isArray(unitsData) &&
                                  unitsData.map((unit) => (
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

                  {/* <FormField
                    control={form.control}
                    name={`${nameValue}[${items.length}].chargedWeightUnit`}
                    render={({ field }) => {
                      return (
                        <FormItem className="flex items-center justify-center ">
                          <div className="flex flex-1 flex-col">
                            <FormControl>
                              <select
                                {...field}
                                className="mb-[.47rem] rounded-bl-[0px] rounded-br rounded-tl-[0px] rounded-tr"
                              >
                                <option value="">
                                  Select Charged Weight Unit
                                </option>
                                <option value="Box"> Box</option>
                                <option value="Bag"> Bag</option>
                                <option value="Basta"> Basta</option>
                                <option value="Bundle"> Bundle</option>
                                <option value="Carton"> Carton</option>
                                <option value="Carate"> Carate</option>
                                <option value="Drums"> Drums</option>
                                <option value="Loose"> Loose</option>
                                <option value="Packet"> Packet</option>
                                <option value="Roll"> Roll</option>
                                <option value="TIN"> TIN</option>
                                <option value="TON"> TON</option> 
                              </select>
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      );
                    }}
                  /> */}
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name={`${nameValue}[${items.length}].GSTType`}
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-center gap-4">
                    <FormLabel className="text-nowrap text-sm lg:text-base">
                      GST Type:
                    </FormLabel>
                    <div className="flex flex-1 flex-col">
                      <FormControl>
                        <select {...field}>
                          <option value="">Select GST Type</option>
                          <option value="RCM">RCM</option>
                          <option value="FCM">FCM</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />

            {form.watch(`${nameValue}[${items.length}].GSTType`) === "FCM" ? (
              <>
                <p className="bg-orange-100 p-1 text-center font-light">
                  if you select FCM , GST percentage is 0%
                </p>
              </>
            ) : (
              <FormField
                control={form.control}
                name={`${nameValue}[${items.length}].GSTPercentage`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                        GST Percentage:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                            <option value={GSTPercentage}>
                              {GSTPercentage
                                ? `${GSTPercentage * 100}%`
                                : "Select GST percentage"}
                            </option>

                            <option value="0.0">0%</option>
                            <option value="0.02">2%</option>
                            <option value="0.05 ">5%</option>
                            <option value="0.08 ">8%</option>
                            <option value="0.12 ">12%</option>
                            <option value="0.18">18%</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
            )}

            {form.watch(`${nameValue}[${items.length}].rateAsPer`, "fixed") ===
              "fixed" && 
            <FieldForm
              form={form}
              name={`${nameValue}[${items.length}].basicAmount`}
              label=" Amount"
              type="number"
            />
            }

           

<FieldForm
              form={form}
              name={`${nameValue}[${items.length}].amount`}
              label="Total Amount"
              type="number"
            />

            <Button
              className=" w-full  border-2 border-blue-200 bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700 "
              type="button"
              variant="secondary"
              onClick={handleAdditionalItem}
            >
              Add Material
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MaterialInfo;
