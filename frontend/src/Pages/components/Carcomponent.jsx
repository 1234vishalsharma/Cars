import React from 'react'
import { useNavigate } from 'react-router-dom'

const Carcomponent = ({data}) => {
    const navigate = useNavigate();
    const openCarPage = () => {
        navigate(`/Car/carID=${data.carID}`);    
    }
  return (
    <div onClick={openCarPage} className='flex hover:cursor-pointer w-[440px] h-44 rounded-xl border borer-white overflow-hidden'>
        {/* Text container */}
    <div className='flex flex-col w-3/5 gap-1 justify-center ml-12 overflow-hidden'>
        <span>Title: {data.title}</span>
        <span>Dealer: {data.dealer}</span>
        <span>Model: {data.model}</span>
    </div>
    {/* Image container */}
    <div className='w-3/5'>
        <img className='h-full w-full object-cover' src={data.images[0]} alt="Loading..." />
    </div>
      
    </div>
  )
}

export default Carcomponent
