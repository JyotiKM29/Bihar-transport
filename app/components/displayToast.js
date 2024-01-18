import React from 'react'
import { useToast } from "./ui/use-toast";

const DisplayToast = ({title, action, description = ""}) => {
    const { toast } = useToast();
  return (
  
 toast({
        title,
        action,
        description,
      })
  
   
  )
}

export default DisplayToast
