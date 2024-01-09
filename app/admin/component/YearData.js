import React from 'react'

const YearData = () => {
  return (
    <div className="h-[90vh] w-full">
    <div className="mb-4 w-full">
      <h1 className="text-4xl">Yearly Dashboard</h1>
    </div>
    <div
        className="grid  min-h-[95%] 
           w-full  grid-cols-1 grid-rows-4 gap-6 md:grid-cols-5 md:grid-rows-2"
      >
        <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-3 ">
          div 1
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-2 ">
          div 1
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-2 ">
          div 1
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-md md:col-span-3 ">
          div 1
        </div>
      </div>
  </div>
  )
}

export default YearData
