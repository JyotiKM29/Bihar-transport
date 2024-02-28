import React from 'react'

const DataView = ({title , value }) => {
  return (
    <label className='flex gap-3'>
      <h2 className='text-xl font-medium '>{title} :</h2>
      <p>{value}</p>
    </label>
  )
}

export default DataView
