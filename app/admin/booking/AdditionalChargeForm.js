import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const AdditionalChargeForm = () => {
  const [selectedCharges, setSelectedCharges] = useState([]);
  const [selectedCharge, setSelectedCharge] = useState("");
  const [rate, setRate] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleChargeSelect = (event) => {
    setSelectedCharge(event.target.value);
  };

  const handleAddButtonClick = () => {
    if (selectedCharge && rate !== 0 && quantity !== 0) {
    
      const newCharge = {
        name: selectedCharge,
        rate: rate,
        quantity: quantity,
      };
      setSelectedCharges([...selectedCharges, newCharge]);

      
      setRate(0);
      setQuantity(0);
      setSelectedCharge("");
    }
  };

  const handleRemoveButtonClick = (index) => {
    // Remove the charge at the specified index
    const updatedCharges = [...selectedCharges];
    updatedCharges.splice(index, 1);
    setSelectedCharges(updatedCharges);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 items-center justify-between gap-6">
        <select
          className="h-10 flex-1 rounded-md border bg-slate-50 px-2"
          onChange={handleChargeSelect}
          value={selectedCharge}
        >
          <option value="" disabled>
            Select Charge
          </option>
          <option value="Ditentional Charge">Ditentional Charge</option>
          <option value="Pickup Charge">Pickup Charge</option>
          <option value="Packing Charge">Packing Charge</option>
          <option value="Loading Charge">Loading Charge</option>
          <option value="Unloading Charge">Unloading Charge</option>
          <option value="Other Charge">Other Charge</option>
        </select>
      </div>
      <div>
        {selectedCharges.length > 0 && (
          <div>
           
            <ul>
              {selectedCharges.map((charge, index) => (
                <div key={index} className="flex flex-col gap-1">
                <div className="flex justify-between mt-2 items-center">
                  <p className="font text-lg  -mb-1">{charge.name}</p>
                  <Button
                      variant="ghost"
                      onClick={() => handleRemoveButtonClick(index)}
                    >
                      Remove
                    </Button>

                </div>
                  
                  <div className="flex items-center gap-6 ">
                    <span className="flex gap-2">
                   <p className="font-semibold text-nowrap">Rate :</p> 
                     {charge.rate}</span>{" "}
                    <span className="flex gap-2">  <p className="font-semibold text-nowrap">Quantity :</p> {charge.quantity}</span>
                    <span className="flex gap-2">  <p className="font-semibold text-nowrap">Total :</p> {charge.quantity * charge.rate}</span>
                   
                  </div>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        {selectedCharge && (
          <div className="flex flex-col -gap-2">
            <h2 className="font-semibold">{selectedCharge}:</h2>
            <div className="flex items-center gap-4 -mt-1">
              <label>Rate:</label>
              <Input
                type="number"
                placeholder="Rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 -mt-2">
              <label>Quantity:</label>
              <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <Button variant="outline" onClick={handleAddButtonClick}>
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalChargeForm;
