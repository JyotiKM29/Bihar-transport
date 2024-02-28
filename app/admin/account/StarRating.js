
'use client'
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Input } from '../../components/ui/input';

const StarRating = ({ onChange }) => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (value) => {
    setRating(value);
    onChange(value);
  };

  

  return (
    <div className='flex gap-1'>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <Input
            className='hidden'
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleStarClick(ratingValue)}
            />
            <FaStar
            
              color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
              size={25}
              style={{ cursor: 'pointer' }}
            />
          </label>
        );
      })}
      {/* <p>You rated: {rating}</p> */}
    </div>
  );
};

export default StarRating;
