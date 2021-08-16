
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


const aiDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];

class List extends React.Component {

  constructor(props){
    super(props);

    let w = window.innerWidth;
    const swiperSize = 300;
    let swiperSpace = 30;
    let colNum = Math.floor((w + swiperSpace)/(swiperSize + swiperSpace));
    if (colNum >= 2) {
      swiperSpace = (w - colNum * swiperSize)/(colNum-1)
    }
    else swiperSpace = 0;

    console.log("w=",w,"colNum:",colNum,"space :",swiperSpace);

    this.lists = aiDays.map((i) => {
      return (
        <SwiperSlide onClick={() => this.handleClick(i)}>
          <flex className = "swiper-content">
            <img src={"http://localhost:8000/images/stage"+i+".png"} className = "stage-image"/>
            <div>
              {"Day "+i}
            </div>
            <div>
              {"Who Cleared :"+5}
            </div>
          </flex>
        </SwiperSlide>
      );
    });

    this.state = {
      colNum:colNum,
      swiperSpace : swiperSpace,
      rowNum:3
    }
    window.addEventListener('resize', (e)=>this.handleResize(e));

  }

  handleResize(){
    let w = window.innerWidth;
    const swiperSize = 300;
    let swiperSpace = 30;
    let colNum = Math.floor((w + swiperSpace)/(swiperSize + swiperSpace));
    if (colNum >= 2) {
      swiperSpace = (w - colNum * swiperSize)/(colNum-1)
    }
    else swiperSpace = 0;

    console.log("resized... w=",w,"colNum:",colNum,"space :",swiperSpace);
    this.setState({
      colNum:colNum,
      swiperSpace:swiperSpace
    });
  }

  handleClick(i){
    console.log("you clicked "+i);
    const { history } = this.props;
    history.push(`/list/${i}`);
  }

  render() {
    return (
      <div className = "list-inside">
        <Swiper slidesPerView={this.state.colNum} slidesPerColumn={this.state.rowNum} spaceBetween={30} pagination={{"clickable": true}} className="mySwiper">
          {this.lists}
        </Swiper>
      </div>
    );
  }
}

export default List;
