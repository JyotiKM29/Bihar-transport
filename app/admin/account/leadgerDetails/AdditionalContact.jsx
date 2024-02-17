"use client";
import React, { useEffect, useState } from "react";
import FieldForm from "../../component/FieldForm";
import { Button } from "../../../components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../../../components/ui/form";

const AdditionalContact = ({ form, nameValue }) => {
    const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);


  function handleAdditionalContact() {

    const newContact = {
        proofType: form.getValues(`${nameValue}[${contacts.length}].proofType`),
        proofNumber: form.getValues(`${nameValue}[${contacts.length}].qty`),
        name: form.getValues(`${nameValue}[${contacts.length}].name`),
        DOB: form.getValues(`${nameValue}[${contacts.length}].DOB`),

        SDWOf: form.getValues(`${nameValue}[${contacts.length}].SDWOf`),
        ContactNo: form.getValues(`${nameValue}[${contacts.length}].ContactNo`),
        alternativeContactNo: form.getValues(`${nameValue}[${contacts.length}].alternativeContactNo`),
        Address: form.getValues(`${nameValue}[${contacts.length}].Address`),
        
        designation: form.getValues(`${nameValue}[${contacts.length}].designation`),
        email: form.getValues(`${nameValue}[${contacts.length}].email`),
     
    };

    setContacts([...contacts ,newContact]);
    console.log('contacts',contacts)
    form.setValue(nameValue, [...contacts ,newContact])
    console.log('form',form.getValues(nameValue));
    setShowForm(false);
  }

  return (
    <div>
      
    <h2 className="font-semibold text-xl ">  Additional Contact :</h2>
    {/* Close and Reset button */}
    <div className="flex items-center gap-3 w-full my-2">
      <Button
        type="button"
        variant="secondary"
        
        className='flex-1 text-red-400 bg-red-100 border-2 border-red-200 hover:bg-red-200 hover:text-red-500 '
        onClick={(e) => {
          e.stopPropagation();
          setShowForm(false);
          setContacts([]);
          form.setValue(nameValue, []);
        }}
      >
       Delete All Contacts
      </Button>
      <Button
        type="button"
        className='flex-1  text-green-500 bg-green-100 border-2 border-green-200 hover:bg-green-200 hover:text-green-700 '
        onClick={() => setShowForm(!showForm)}
        variant="secondary"
      >
        {showForm ? "Close Contact form":"Enter Contact Details"}
      </Button>
    </div>


     {/* Table display */}
     <div>
        {contacts && contacts.length > 0 && (
          <table className="mx-2 my-4 w-full border">
            <thead>
              <tr className="w-full border bg-slate-50">
                <th>Proof Type</th>
                <th>Name</th>
                <th>S/D/W of</th>
                <th>designation</th>
                <th>email</th>
               
              </tr>
            </thead>
            <tbody>
              {contacts.map((items, i) => (
                <tr key={i} className="w-full text-center">
                  <td>{items.proofType}</td>
                  <td>{items.name}</td>
                  <td>{items.SDWOf}</td>
                  <td>{items.designation}</td>
                  <td>{items.email}</td>  
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

  <FormField
                control={form.control}
               
                name={`${nameValue}[${contacts.length}].proofType`}
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center justify-center gap-4">
                      <FormLabel className="text-nowrap text-sm lg:text-base">
                      Proof Type:
                      </FormLabel>
                      <div className="flex flex-1 flex-col">
                        <FormControl>
                          <select {...field}>
                          <option value=" ">Select Proof Type</option>
                        <option value="GSTIN">
                         GSTIN
                        </option>
                        <option value="Aadhar Card">
                        Aadhar Card</option>
                        <option value="Pan Card">Pan Card</option>
                        <option value="Driving Liecence">Driving Liecence</option>
                       
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
              name={`${nameValue}[${contacts.length}].proofNumber`}
              label="Proof Number"
              type="number"
            />
<FieldForm
              form={form}
              name={`${nameValue}[${contacts.length}].name`}
              label="Name"
              type="text"
            />
<FieldForm
              form={form}
              name={`${nameValue}[${contacts.length}].DOB`}
              label="date of Birth"
              type="date"
            />
<FieldForm
              form={form}
              name={`${nameValue}[${contacts.length}].SDWOf`}
              label="Son/daughter/wife of"
              type="text"
            />
<FieldForm
              form={form}
              name={`${nameValue}[${contacts.length}].ContactNo`}
              label="Contact No"
              type="number"
            />
<FieldForm
              form={form}
              name={`${nameValue}[${contacts.length}].alternativeContactNo`}
              label="Alter Contact No"
              type="number"
            />
<FieldForm
              form={form}
              name={`${nameValue}[${contacts.length}].Address`}
              label="Address"
              type="text"
            />
<FieldForm
              form={form}
              name={`${nameValue}[${contacts.length}].designation`}
              label="Designation"
              type="text"
            />
<FieldForm
              form={form}
              name={`${nameValue}[${contacts.length}].email`}
              label="Email"
              type="text"
            />


          <Button
              className='flex-1 w-full  text-blue-500 bg-blue-100 border-2 border-blue-200 hover:bg-blue-200 hover:text-blue-700 '
              type="button"
              variant="secondary"
              onClick={handleAdditionalContact}
            >
              Add Additional Charger
            </Button>
          </>
        )}
      </div>
     
    </div>
  )
}

export default AdditionalContact
