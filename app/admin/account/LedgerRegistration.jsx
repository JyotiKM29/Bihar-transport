import React from 'react'
import LedgerForm from './components/LedgerForm'

const LedgerRegistration = () => {
  return (
    <div className="mt-14 lg:my-4 max-w max-h  bg-white py-4 lg:p-8 px-4 md:px-10 lg:px-20 shadow-md rounded-md">

<h2 className="text-3xl text-center font-semibold mb-8"> Create New Ledger </h2>
      <LedgerForm />
      
    </div>
  )
}

export default LedgerRegistration
