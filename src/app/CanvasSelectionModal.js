import React from 'react';
import Modal from 'react-modal';
import CanvasSelectionDropdown from './CanvasSelectionDropdown.js';

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
      <CanvasSelectionDropdown abId={props.abId} handleCanvasSelect={props.handleCanvasSelect} qCanvasFileMatches={props.qCanvasFileMatches} />
      <button onClick={props.handleCanvasNoMatchClick} id='q-canvas-no-match-btn' className='btn q-btn'>None of the above </button>
      <div> Some stuff about ID's </div>
    </Modal>
  )
}

export default CanvasSelectionModal;