
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

    this.lists = aiDays.map((i) => {
      return (
        <SwiperSlide onClick={() => this.handleClick(i)}>
          <div className = "swiper-content">
            <div className = "day-number">
              {i}
            </div>
            <div className = "cleared-head">
              Who Cleared
            </div>
            <div className = "cleared-number">
              {5}
            </div>
          </div>
        </SwiperSlide>
      );
    });

    const [colNum, rowNum] = calculate_layout();
    this.state = {
      colNum:colNum,
      rowNum:rowNum,
    }
    console.log("hmm", colNum, rowNum);
    window.addEventListener('resize', (e)=>this.handleResize(e));

  }

  componentDidMount() {
    let w = window.innerWidth, h = window.innerHeight;
    document.getElementById("list-inside").style.paddingTop = Math.round(h/10)+"px";
    const [colNum, rowNum] = calculate_layout();
    this.setState({
      colNum:colNum,
      rowNum:rowNum,
    });
  }

  handleResize(){
    let w = window.innerWidth, h = window.innerHeight;
    document.getElementById("list-inside").style.paddingTop = Math.round(h/10)+"px";

    const [rowNum, colNum] = calculate_layout();
    const sliders = document.getElementsByClassName("swiper-slide");
    for(let i=0;i<sliders.length;i++){
      sliders[i].style.height = Math.round(90/rowNum)+"%";
    }

    const contents = document.getElementsByClassName("swiper-content");

    console.log(contents[0].style);
    for(let i=0;i<contents.length;i++){
      contents[i].style.width = contents[i].style.height;
    }

    this.setState({
      colNum:colNum,
      rowNum:rowNum,
    });

  }

  handleClick(i){
    console.log("you clicked "+i);
    const { history } = this.props;
    history.push(`/list/${i}`);
  }

  render() {
    const [rowNum, colNum] = calculate_layout();
    return (
      <div id = "list-inside">
        <Swiper slidesPerView={colNum} slidesPerColumn={rowNum} slidesPerGroup={colNum} pagination={{"clickable": true}} className="mySwiper">
          {this.lists}
        </Swiper> 
      </div>
    );
  }
}

export default List;


function calculate_layout(){
  let w = window.innerWidth, h = window.innerHeight;

  let colNum = 5, rowNum = 3;
  if(h<450) rowNum = 1;
  else if(h<750) rowNum = 2;
  else if(h<1100) rowNum = 3;
  else if(h<1400) rowNum = 4;
  else if(h<1600) rowNum = 5;
  else if(h<1800) rowNum = 6;
  else rowNum = 7;

  if(w<450) colNum = 1;
  else if(w<750) colNum = 2;
  else if(w<1100) colNum = 3;
  else if(w<1400) colNum = 4;
  else if(w<1600) colNum = 5;
  else if(w<1800) colNum = 6;
  else colNum = 7;
  return [rowNum, colNum];
}