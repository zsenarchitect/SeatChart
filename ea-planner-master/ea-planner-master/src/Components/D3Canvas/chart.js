import * as d3 from 'd3';
import dayjs from 'dayjs';
// import { treemapBinary } from 'd3';
import { dataSet } from '../../data/data'

var svgContainer = {};

var circleRadius = 5;
var radiusScale = 100;

var todayActive = true;
var activeDate = {};

var signInData, scheduleData = []

var getCheckInStyle = () => null

const draw = (data, _activeDate, handlePopoverOpen, handlePopoverClose, _signInData, _scheduleData, _getCheckInStyle) => {

  getCheckInStyle = _getCheckInStyle

  // TODO: get rid of this activeDate thing
  activeDate = _activeDate
  todayActive = dayjs().isSame(_activeDate, 'days')

  signInData = _signInData
  scheduleData = _scheduleData


  let circles = svgContainer.selectAll('.seatCircle')
    .data(data, d => d.id);

  //update
  circles.transition()
    .ease(d3.easeQuad)
    .duration(150)
    .attr("r", circleRadius * 1.75)
    .style("fill", (d) => getCheckInStyle(d.id).fill)
    .style("stroke", (d) => getCheckInStyle(d.id).stroke)
    .style("stroke-width", (d) => getCheckInStyle(d.id).strokeWidth)
    .attr("opacity", (d) => getCheckInStyle(d.id).opacity)
    .transition()
    .ease(d3.easeQuad)
    .duration(150)
    .attr("r", (d) => getCheckInStyle(d.id).radius * circleRadius);

  //exit
  circles.exit()
    .transition()
    .ease(d3.easeQuad)
    .duration(300)
    .attr('r', 0)
    .remove();

  //enter
  circles.enter().append('circle')
    .attr("class", "seatCircle")
    .attr("id", d => d.id)
    .on('mouseover', handlePopoverOpen)
    .on('mouseout', handlePopoverClose)
    .attr("cx", (d) => seatingPosX(d))
    .attr("cy", (d) => seatingPosY(d))
    .style("fill", (d) => getCheckInStyle(d.id).fill)
    .style("stroke", (d) => getCheckInStyle(d.id).stroke)
    .style("stroke-width", (d) => getCheckInStyle(d.id).strokeWidth)
    .attr("r", circleRadius * 1.75)
    .attr("opacity", (d) => getCheckInStyle(d.id).opacity)
    .attr('firstName', (d) => d.firstName)
    .attr('lastName', (d) => d.lastName)
    .attr('headshot', (d) => d.headshot)
    .attr('seat', (d) => d.seat)
    .attr('ext', (d) => d.ext)
    .transition()
    .duration(200)
    .attr('r', (d) => getCheckInStyle(d.id).radius * circleRadius);

    var office = ''

    if(data.length > 0){
      office = data[0].office === '1WTC' ? 'WTC' : data[0].office;
    }

  roomLabels(office, handlePopoverOpen, handlePopoverClose);
}

const handleResize = (e) => {
  let img = document.querySelector('#planImg');

  circleRadius = img.height / radiusScale;

  svgContainer
    .attr("width", img.width)
    .attr("height", img.height)
    .selectAll('.seatCircle')
    .attr("cx", (d) => seatingPosX(d))
    .attr("cy", (d) => seatingPosY(d))
    .attr("r", (d) => getCheckInStyle(d.id).radius * circleRadius)

  let rectSize = {
    width: circleRadius * 12,
    height: circleRadius * 5,
    fontSize: circleRadius * 1.5 + 'px',
    lineHeight: circleRadius * 2 + 'px'
  }

  const roomGroups = svgContainer
    .selectAll('.rooms')
    .attr("transform", (d) => `translate(${d.x * img.width}, ${d.y * img.height})`)

  roomGroups.selectAll('rect')
    .attr("width", rectSize.width)
    .attr("height", rectSize.height)
    .attr("transform", `translate(${-rectSize.width / 2}, ${-rectSize.height / 2})`)

  const labels = roomGroups.selectAll('text')
    .style("font-size", rectSize.fontSize)

  labels.selectAll('.name-label')
    .attr("transform", `translate(0, ${rectSize.height / -4})`)

  labels.selectAll('.capacity-label')
    .attr("transform", `translate(0, ${rectSize.height / 4})`)
}

const initChart = (ref) => {

  if (document.querySelector('#d3-svg-canvas') !== null) return;

  window.addEventListener('resize', handleResize);

  let img = document.querySelector('#planImg');

  circleRadius = img.height / radiusScale;

  svgContainer = d3.select(ref.current)
    .append("svg")
    .attr("id", "d3-svg-canvas")
    .attr("width", img.width)
    .attr("height", img.height)
}

const initData = (data, _activeDate, handlePopoverOpen, handlePopoverClose, _signInData, _scheduleData, _getCheckInStyle) => {
  if (!svgContainer) return;

  getCheckInStyle = _getCheckInStyle

  activeDate = _activeDate;

  signInData = _signInData
  scheduleData = _scheduleData

  let circles

  circles = svgContainer.selectAll('.seatCircle')
    .data(data, d => d.id);

  circles.enter().append('circle')
    .attr("class", "seatCircle")
    .attr("id", d => d.id)
    .on('mouseover', handlePopoverOpen)
    .on('mouseout', handlePopoverClose)
    .attr("cx", (d) => seatingPosX(d))
    .attr("cy", (d) => seatingPosY(d))
    .style("fill", (d) => getCheckInStyle(d.id).fill)
    .style("stroke", (d) => getCheckInStyle(d.id).stroke)
    .style("stroke-width", (d) => getCheckInStyle(d.id).strokeWidth)
    .attr("r", (d) => getCheckInStyle(d.id).radius * circleRadius)
    .attr("opacity", (d) => getCheckInStyle(d.id).opacity)
    .attr('firstName', (d) => d.firstName)
    .attr('lastName', (d) => d.lastName)
    .attr('headshot', (d) => d.headshot)
    .attr('seat', (d) => d.seat)
    .attr('ext', (d) => d.ext);

  const office = data[0].office === '1WTC' ? 'WTC' : data[0].office;
  roomLabels(office, handlePopoverOpen, handlePopoverClose);
}

function roomLabels(office, handlePopoverOpen, handlePopoverClose) {

  if(dataSet[office] === undefined){
    return
  }


  let roomData = dataSet[office].rooms;

  let rooms = svgContainer.selectAll('.rooms')
    .data(roomData, d => d.name);

  if (roomData.length < 1) {
    rooms.exit().remove()
    return
  }

  let img = document.querySelector('#planImg');

  let rectSize = {
    width: circleRadius * 12,
    height: circleRadius * 5,
    fontSize: circleRadius * 1.5 + 'px',
    lineHeight: circleRadius * 2 + 'px'
  }

  const roomGroups = rooms.enter().append('g')
    .attr("class", "rooms")
    .attr("id", d => d.id)
    .attr("transform", (d) => `translate(${d.x * img.width}, ${d.y * img.height})`)
    .on('mouseover', handlePopoverOpen)
    .on('mouseout', handlePopoverClose)

  roomGroups.append('rect')
    .attr("id", d => d.id + '-rect')
    .attr("fill", "#646365")
    .attr("width", rectSize.width)
    .attr("height", rectSize.height)
    .attr("rx", circleRadius)
    .attr("opacity", 0.9)
    .attr("transform", `translate(${-rectSize.width / 2}, ${-rectSize.height / 2})`)

  roomGroups.append('text')
    .attr("id", d => d.id + '-name')
    .attr('class', 'name-label')
    .attr('fill', "white")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("font-size", rectSize.fontSize)
    .attr("transform", `translate(0, ${rectSize.height / -10})`)
    .text(d => d.name)

  roomGroups.append('text')
    .attr("id", d => d.id + '-capacity')
    .attr('class', 'capacity-label')
    .attr('fill', "white")
    .attr("text-anchor", "middle")
    .style("font-size", rectSize.fontSize)
    .attr("transform", `translate(0, ${rectSize.height / 5})`)
    .text(d => 'Capacity: ' + d.capacity)

}

const seatingPosX = (d) => {
  var dSeat = String(d.seat);
  let seatData;

  //filtering to show proper office is taken care of upstream
  switch (d.office) {
    case "1WTC":
      seatData = dataSet.WTC[dSeat];
      break;
    case "SHO":
      seatData = dataSet.SHO[dSeat];
      break;
    default:
      return null;
  }

  let img = document.querySelector('#planImg');

  if (typeof (seatData) == 'undefined') {
    return -100;
  }

  var posX = seatData.x;
  return (posX * (img.width));
}

const seatingPosY = (d) => {
  var dSeat = String(d.seat);
  let seatData;

  //filtering to show proper office is taken care of upstream
  switch (d.office) {
    case "1WTC":
      seatData = dataSet.WTC[dSeat];
      break;
    case "SHO":
      seatData = dataSet.SHO[dSeat];
      break;
    default:
      return null;
  }

  let img = document.querySelector('#planImg');

  if (typeof (seatData) == 'undefined') {
    return -100;
  }

  var posY = seatData.y;
  return Math.abs((posY - 1) * (img.height));
}

export { draw, initChart, initData };