import React from 'react'
import offers from "../../public/offers.png"

const Banner = () => {
  return (
    <div className="banner">
        <div>
            <h1>The Biggest sale is On!</h1>
            <p>During this exclusive sale, grab items at top discount
            <br/>
            Don't miss the chance
            </p>
            <button className='banner btn'>Check now!</button>
        </div>
        <img src={offers} alt="Banner for special offers!"/>
    </div>
    
  )
}

export default Banner