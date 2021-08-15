
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css"

import "./listStyles.css";


// import Swiper core and required modules
import SwiperCore, {
  Pagination
} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Pagination]);


const aiDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];

const lists = aiDays.map((i) => {
  return (
    <SwiperSlide onClick={() => handleClick(i)}>{"Slide "+i}</SwiperSlide>
  );
});



class List extends React.Component {

  constructor(props){
    super(props);

    let w = window.innerWidth;
    let colNum=3;
    if(w<900) {
      colNum = 2;
    }
    else if(w<1200){
      colNum = 3;
    }
    else if(w<1600){
      colNum = 4;
    }
    else{
      colNum = 5;
    }

    this.state = {
      colNum:colNum,
      rowNum:3
    }
    window.addEventListener('resize', (e)=>this.handleResize(e));

  }

  handleResize(){
    let w = window.innerWidth;
    let colNum=3;
    if(w<900) {
      colNum = 2;
    }
    else if(w<1200){
      colNum = 3;
    }
    else if(w<1600){
      colNum = 4;
    }
    else{
      colNum = 5;
    }
    this.setState({
      colNum:colNum
    })
  }

  render() {
    return (
      <>
        <Swiper slidesPerView={this.state.colNum} slidesPerColumn={this.state.rowNum} spaceBetween={30} pagination={{"clickable": true}} className="mySwiper">
          {lists}
        </Swiper>
      </>
    );
  }
}

function handleClick(i){
  console.log("you clicked "+i);
}

export default List;

