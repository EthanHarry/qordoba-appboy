import React from 'react';
import Modal from 'react-modal';

var CanvasSelectionModal = (props) => {
  return (
    <Modal
      id='q-canvas-choose-modal'
      isOpen={!props.abId && props.abCanvasSelectionInProgress}
      parentSelector={props.qModalGetParentSelector}
      onRequestClose={props.handleCanvasModalClose}
      contentLabel="Canvas Choose Modal"
      style={props.qModalStyle}
    >
      <h1> Choose your canvas </h1>
      <select value={props.abId} onChange={props.handleCanvasSelect} id='q-canvas-dropdwn' className='q-dropdown'>
        <option disabled value={0}> Choose a Canvas </option>
        {props.qCanvasFileMatches.map((canvasFile) => {
          var fileNameRegex = /canvas_.*-(.*).html/;
          var fileNameMatches = fileNameRegex.exec(canvasFile.url);
          var fileName = fileNameMatches[1];
          return <option className='q-canvas-option' value={fileName} key={fileName}>{fileName}</option>
        })}
      </select>
      <button onClick={props.handleCanvasNoMatchClick} id='q-canvas-no-match-btn' className='btn q-btn'>None of the above </button>
      <div> Some stuff about ID's </div>
    </Modal>
  )
}

export default CanvasSelectionModal;