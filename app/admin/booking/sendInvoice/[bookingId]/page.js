"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { UserContext } from "../../../../context/UserContextProvider";
import { useToast } from "../../../../components/ui/use-toast";

const EmailSend = ({params}) => {
  const [email , setEmail] =useState('');
  const [userName , setUserName] =useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useContext(UserContext);

  const userId = user?._id;
  const bookingId = params.bookingId;
  const displayToast = (title, action, description = "") => {
    toast({
      title,
      action,
      description,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(userId);
  
    try {
      setLoading(true);
  
      const response = await fetch('/api/invoice', {
        method: 'POST',
        body: JSON.stringify({
         
          adminId: userId,
          bookingId,
          name:userName,
         email,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        displayToast('Successfully Sent Invoice on Email', '✅');
      } else {
        console.error('Error:', result.message);
        displayToast('failed to sent email ', '❌', result.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      displayToast('Server Error', '❌', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full rounded-3xl bg-white px-6 py-4  shadow-sm">
      <h2 className="mt-12 lg:mt-0 font-semiBold text-3xl "> Invoice : </h2>

      <form onSubmit={handleSubmit}
       className="self-end w-full flex flex-col justify-between items-start shadow-md border px-6 py-4 rounded-xl  mt-8"
      >
       <label className="w-full md:flex gap-4 items-center">
     <p className="text-nowrap font-semiBold text-lg">User Name :</p> 
      <Input
          label="Email"
          placeholder="Enter your user name"
          id="email"
          type="text"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className='w-full'
        />
      </label>
      
      <label className="w-full md:flex gap-4 items-center">
     <p className="text-nowrap font-semiBold text-lg">Email :</p> 
      <Input
          label="Email"
          placeholder="Enter your email"
          id="email"
          type="text"
          required
          value={email}
          className='w-full'
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

     
     
       
        <Button type="submit">{loading ? 'Loading ...':'Send Invoice'}</Button>
      </form>
    </div>
  );
};

export default EmailSend;
