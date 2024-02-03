"use client";
import React, { useEffect, useState } from "react";
import FieldForm from "../../FieldForm";
import { Button } from "../../../../components/ui/button";

const AdditionalChargers = ({ form, nameValue }) => {
  const [charges, setCharges] = useState([]);
  const [showForm, setShowForm] = useState(false);



  function calAmount(rate , days){
    return Number(rate) + Number(days)
  }

  const rate = form.watch(`${nameValue}[${charges.length}].rate`);
  const days = form.watch(`${nameValue}[${charges.length}].days`);

  useEffect(() => {
    if (rate && days) {
      const result = Number(rate) * Number(days);
      form.setValue(`${nameValue}[${charges.length}].amount`, result);
    }
  }, [rate, days, charges.length, nameValue]);

  useEffect(()=>{
    const result = calAmount(rate , days)
    form.setValue(`${nameValue}.amount`, result)
  },[rate ,days ]);

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

  return (
    <div>
      

      {/* Close and Reset button */}
      <div className="flex items-center gap-3 max-w-md w-full">
        <Button
          type="button"
          variant="secondary"
          className='flex-1'
          onClick={() => {
            setCharges([]);
            form.setValue(nameValue, []);
          }}
        >
          Reset Additional Charges
        </Button>
        <Button
          type="button"
          className='flex-1'
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
                <tr key={i} className="w-full text-center">
                  <td>{items.chargesName}</td>
                  <td>{items.days}</td>
                  <td>{items.rate}</td>
                  <td>{items.amount}</td>
                  <td>{items.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form */}
      <div>
        {showForm && (
          <>
          <p>Fill in the details below:</p>
            <FieldForm
              form={form}
              name={`${nameValue}[${charges.length}].chargesName`}
              label="Charge Name"
              type="text"
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
              className='flex-1 max-w-md w-full'
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
