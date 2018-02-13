import React from 'react';
import Modal from 'react-modal';
import CanvasSelectionDropdown from './CanvasSelectionDropdown.js';

var CanvasSelectionModal = (props) => {
  console.log('canvas selection modal props', props)
  return (
    <Modal
      id='q-canvas-choose-modal'
      isOpen={!props.abId && props.abCanvasSelectionInProgress && !props.qLoginModalOpen && props.abCanvasExistInQ}
      parentSelector={props.qModalGetParentSelector}
      onRequestClose={props.handleCanvasModalClose}
      contentLabel="Canvas Choose Modal"
      style={props.qModalStyle}
    >
      <h1> Select ID for this Message </h1>
      <CanvasSelectionDropdown abId={props.abId} handleCanvasSelect={props.handleCanvasSelect} qCanvasFileMatches={props.qCanvasFileMatches} />
      <button onClick={props.handleCanvasNoMatchClick} id='q-canvas-no-match-btn' className='btn q-btn'>None of the above </button>
      <div id='q-canvas-selection-info-text-1' className='q-info-text'> The above dropdown menu contains a list of all Messages from this Canvas that currently exist in Qordoba.</div>
      <div className='q-info-text'>If this Message has not been uploaded to Qordoba, please click "None of the above". You will be prompted to name the Message when you click "Upload to Qordoba".</div>
    </Modal>
  )
}

export default CanvasSelectionModal;