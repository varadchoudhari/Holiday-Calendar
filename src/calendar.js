import React, { Component } from 'react';
import './calendar.css'
import axios from 'axios'

class Day extends React.Component {
  render() {
    let dates = this.props.dates;
    let bgColor = this.props.bgColor;
    return(<div id={this.props.id} style={{backgroundColor:bgColor[this.props.id]}} className="date">{this.props.dates[this.props.id]}</div>);
  }
}

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [{id: 1, state: "Andhra Pradesh", code: "ANP"}, {id: 2, state: "Arunachal Pradesh", code: "ARP"}, {id: 3, state:"Assam"}, {id:4, state:"Bihar"}, {id: 5, state:"Chhattisgrah"}, {id: 6, state:"Delhi"}, {id: 7, state:"Goa"}, {id: 8, state: "Gujarat"}, {id: 9, state:"Harayana"}, {id:10, state:"Himachal Pradesh"}, {id:11, state:"Jammu and Kashmir"}, {id: 12, state:"Jharkhand"}, {id: 13, state:"Karnataka"}, {id: 14, state:"Kerala"}, {id: 15, state:"Madhya Pradesh"}, {id: 16, state:"Maharashtra"}, {id: 17, state: "Manipur"}, {id: 18, state:"Meghalaya"}, {id: 19, state:"Mizoram"}, {id:20, state:"Nagaland"}, {id: 21, state:"Odisha"}, {id:22, state:"Puducherry"}, {id:23, state:"Punjab"}, {id:24, state:"Rajasthan"}, {id: 25, state:"Sikkim"}, {id:26, state:"Tamil Nadu"}, {id:27, state:"Telangana"}, {id:28, state:"Tripura"}, {id:29, state:"Uttar Pradesh"}, {id: 30, state:"Uttarakhand"}, {id:31, state:"West Bengal"}],
      dates: Array(34).fill(""),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getYear() + 1900,
      holidayTiles: Array(34).fill("")
    };
  }

  getMonthName() {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[this.state.currentMonth].toString() + " " + this.state.currentYear;
  }

  getMonthDates(year, month) {
    let numberOfDays = new Date(year, month+1,0).getDate();
    let startDay = new Date(year, month, 1).getDay();
    let dates = Array(34).fill("")
    if (startDay === 0) {
      for(let i = startDay+6; i < numberOfDays+startDay+6; i++) {
        let date = i-5;
        dates[i] = date.toString();
      }
      if ((numberOfDays+startDay+5 - 34) === 1) {
        dates[0] = 30;
      }
      if ((numberOfDays+startDay+5 - 34) === 2) {
        dates[0] = 30;
        dates[1] = 31;
      }

    }
    else {
      for(let i = startDay - 1; i < numberOfDays+startDay-1; i++) {
        let date = i - (startDay - 2);
        dates[i] = date.toString();
      }
    }
    this.setState({dates: dates});
  }

  componentWillMount() {
    this.getMonthDates(this.state.currentYear, this.state.currentMonth);
  }

  componentDidMount() {
    this.fetchData(this.state.currentYear, this.state.currentMonth);
  }

  fetchData(year, month) {
    let currentMonth = month+1;
    let currentYear = year;
    let a = axios.get("http://localhost:3000/holidays?month="+currentMonth+"&year="+currentYear)
    .then(response => {return response.data})
    .then(result => {
          let colour = Array(34).fill("");
          for(let i = 0; i < result.length; i++) {
            let dates = this.state.dates;
            colour[this.state.dates.indexOf(""+result[i].day)] = "#a0e7ff";
          }
          this.setState({holidayTiles:colour})
    });
  }


  renderDate(id) {
    return(<Day id={id} bgColor={this.state.holidayTiles} dates={this.state.dates}/>)
  }

  renderDay(day) {
    return(<div className="day">{day}</div>)
  }

  setNextMonth() {
    let blank = Array(34).fill("")
    this.setState({holidayTiles:blank})
    let currentMonth = this.state.currentMonth;
    let currentYear = this.state.currentYear;
    if(currentMonth === 11) {
      currentMonth = 0;
      currentYear = currentYear + 1;
    }
    else {
      currentMonth = currentMonth + 1;
    }
    this.setState({currentMonth: currentMonth, currentYear: currentYear});
    this.getMonthDates(currentYear, currentMonth);
    this.fetchData(currentYear, currentMonth);
  }

  setPreviousMonth() {
    let blank = Array(34).fill("")
    this.setState({holidayTiles:blank})
    let currentMonth = this.state.currentMonth;
    let currentYear = this.state.currentYear;
    if(currentMonth === 0) {
      currentMonth = 11;
      currentYear = currentYear - 1;
    }
    else {
      currentMonth = currentMonth - 1;
    }
    this.setState({currentMonth: currentMonth, currentYear: currentYear});
    this.getMonthDates(currentYear, currentMonth);
    this.fetchData(currentYear, currentMonth);
  }

  renderTop() {
    return(<div className="topbar">
      <div className="back-switcher">
        <button id="back-button" onClick={this.setPreviousMonth.bind(this)}></button>
      </div>
      <h2 className="month-title">{this.getMonthName()}</h2>
      <div className="front-switcher">
        <button id="next-button" onClick={this.setNextMonth.bind(this)}></button>
      </div>
    </div>)
  }

  renderDropDown() {
    return(
      <select>
        {this.state.states.map((data) => {
          return(<option key={data.id} value={data.state} onChange={this.selectState(data.state)}>{data.state}</option>)
        })}
      </select>
    );
  }

  selectState(e) {
    //console.log(e);
  }

  render() {
    return(
      <div>
        <div>{this.renderTop()}</div>
        <div id="board" className="grid">
          {this.renderDay("Mon")}
          {this.renderDay("Tue")}
          {this.renderDay("Wed")}
          {this.renderDay("Thu")}
          {this.renderDay("Fri")}
          {this.renderDay("Sat")}
          {this.renderDay("Sun")}
          {this.renderDate(0)}
          {this.renderDate(1)}
          {this.renderDate(2)}
          {this.renderDate(3)}
          {this.renderDate(4)}
          {this.renderDate(5)}
          {this.renderDate(6)}
          {this.renderDate(7)}
          {this.renderDate(8)}
          {this.renderDate(9)}
          {this.renderDate(10)}
          {this.renderDate(11)}
          {this.renderDate(12)}
          {this.renderDate(13)}
          {this.renderDate(14)}
          {this.renderDate(15)}
          {this.renderDate(16)}
          {this.renderDate(17)}
          {this.renderDate(18)}
          {this.renderDate(19)}
          {this.renderDate(20)}
          {this.renderDate(21)}
          {this.renderDate(22)}
          {this.renderDate(23)}
          {this.renderDate(24)}
          {this.renderDate(25)}
          {this.renderDate(26)}
          {this.renderDate(27)}
          {this.renderDate(28)}
          {this.renderDate(29)}
          {this.renderDate(30)}
          {this.renderDate(31)}
          {this.renderDate(32)}
          {this.renderDate(33)}
          {this.renderDate(34)}
        </div>
        <div>{this.renderDropDown()}</div>
      </div>
    );
  }
}
