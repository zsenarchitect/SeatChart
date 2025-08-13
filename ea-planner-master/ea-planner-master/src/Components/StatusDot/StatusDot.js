import React from 'react';
import './StatusDot.css';

function statusDot (props) {
  let strokeBool = typeof props.stroke === 'undefined';

  let stroke = typeof props.stroke !== 'undefined' ? props.stroke : '';
  let strokeWidth = '2px';
  
  return (
    <div className='dot' style={{backgroundColor:props.color,
                                  borderStyle: strokeBool ? 'none' : 'solid',
                                  borderColor:stroke,
                                  borderWidth:strokeWidth,
                                  width: strokeBool ? '' : '9px',
                                  height: strokeBool ? '' : '9px',
                                  borderRadius: strokeBool ? '' : '8px',}}/>
  )
}

export default statusDot;