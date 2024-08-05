"use client";
import React, { useEffect, useState, useContext } from "react";
import FieldForm from "../../../component/FieldForm";
import { Button } from "../../../../components/ui/button";
import { UserContext } from "../../../../context/UserContextProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";

const AdditionalChargers = ({ form, nameValue }) => {
  const [charges, setCharges] = useState([]);
  const [chargesList, setChargesList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(UserContext);

  const userId = user?._id;

  const rate = form.watch(`${nameValue}[${charges.length}].rate`);
  const days = form.watch(`${nameValue}[${charges.length}].days`);

  useEffect(() => {
    if (rate && days) {
      const result = Number(rate) * Number(days);
      form.setValue(`${nameValue}[${charges.length}].amount`, result);
    }
  }, [rate, days, charges.length, nameValue]);

  useEffect(() => {
    const result = rate && days ? Number(rate) * Number(days) : 0;
    form.setValue(`${nameValue}.amount`, result);
  }, [rate, days]);

  function handleAdditionalCharge() {
    const newCharge = {
      chargesName: form.getValues(`${nameValue}[${charges.length}].chargesName`),
      days: form.getValues(`${nameValue}[${charges.length}].days`),
      rate: form.getValues(`${nameValue}[${charges.length}].rate`),
      amount: form.getValues(`${nameValue}[${charges.length}].amount`),
      remarks: form.getValues(`${nameValue}[${charges.length}].remarks`),
    };

    setCharges([...charges, newCharge]);
    setShowForm(false);
  }

  const fetchAdditionalCharges = async () => {
    try {
      const response = await fetch(`/api/setting/additionalCharges/get/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setChargesList(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAdditionalCharges();
  }, []);

  return (
    <div>
      {/* Close and Reset button */}
      <div className="flex items-center gap-3 max-w-md w-full">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => {
            setCharges([]);
            form.setValue(nameValue, []);
          }}
        >
          Reset Additional Charges
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={() => setShowForm(!showForm)}
          variant="secondary"
        >
          Enter Additional Charge
        </Button>
      </div>

      {/* Table display */}
      <div>
        {charges && charges.length > 0 && (
          <table className="mx-2 my-4 w-full border">
            <thead>
              <tr className="w-full border bg-slate-50">
                <th>Charges Name</th>
                <th>Day</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((items, i) => (
                <tr key={i} className="w-full border text-center">
                  <td>{items.chargesName}</td>
                  <td>{items.days}</td>
                  <td>{items.rate}</td>
                  <td>{items.amount}</td>
                  <td>{items.remarks}</td>
                </tr>
              ))}
              <tr className="w-full text-center font-bold">
                <td colSpan="3">Total Freight</td>
                <td>{charges.reduce((total, item) => total + item.amount, 0)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Form */}
      <div>
        {showForm && (
          <>
            <p>Fill in the details below:</p>
           <FormField
              control={form.control}
              name={`${nameValue}[${charges.length}].chargesName`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-4">
                  <FormLabel className="whitespace-nowrap">Charge Name</FormLabel>
                  <Select {...field}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Charge" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <option value="">
                        {chargesList && chargesList.length > 0
                          ? "Select Additional Charge"
                          : "Loading..."}
                      </option>
                      {Array.isArray(chargesList) &&
                        chargesList.map((charge) => (
                          <SelectItem key={charge.value} value={charge.value}>
                            {charge.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FieldForm
              form={form}
              name={`${nameValue}[${charges.length}].days`}
              label="Days"
              type="number"
            />
            <FieldForm
              form={form}
              name={`${nameValue}[${charges.length}].rate`}
              label="Rate"
              type="number"
            />
            <FieldForm
              form={form}
              name={`${nameValue}[${charges.length}].amount`}
              label="Amount"
              type="number"
            />
            <FieldForm
              form={form}
              name={`${nameValue}[${charges.length}].remarks`}
              label="Remark"
              type="text"
            />
            <Button
              className="flex-1 max-w-md w-full"
              type="button"
              variant="secondary"
              onClick={handleAdditionalCharge}
            >
              Add Additional Charge
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdditionalChargers;
