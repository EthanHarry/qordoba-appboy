import React from 'react';

var CanvasSelectionDropdown = (props) => {
  return (
    <select value={props.abId} onChange={props.handleCanvasSelect} id='q-canvas-dropdwn' className='q-dropdown'>
      <option disabled value={0}> Choose a Canvas </option>
      {props.qCanvasFileMatches.map((canvasFile) => {
        var fileNameRegex = /canvas_.*-(.*).html/;
        var fileNameMatches = fileNameRegex.exec(canvasFile.url);
        var fileName = fileNameMatches[1];
        return <option className='q-canvas-option' value={fileName} key={fileName}>{fileName}</option>
      })}
    </select>
  )
}

export default CanvasSelectionDropdown;