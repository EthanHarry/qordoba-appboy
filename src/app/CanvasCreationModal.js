import React from 'react';
import Modal from 'react-modal';

var CanvasCreationModal = (props) => {
 return (
    <div className='q-nav-item'>
      <Modal
        id='q-canvas-creation-modal'
        isOpen={props.canvasCreationModalOpen}
        parentSelector={props.qModalGetParentSelector}
        onRequestClose={props.handleCanvasModalClose}
        contentLabel="Canvas Creation Modal"
        style={props.qModalStyle}
      >
        <form onSubmit={props.handleCanvasIdSubmit} id='q-canvas-creation-form'>
          <input className='q-input' type='text' placeholder='Canvas ID' />
          <button id='q-canvas-creation-btn' className='q-btn btn'> Submit </button>
        </form>
        <h1> ID's for Canvas content </h1>
        <h3> NOTE: Please check with your manager for ID naming conventions before proceeding. </h3>
        <div> Each template created from Canvas must be given a unique ID. Please make sure that you give this template very specific, clear name that your teammates will recognize. </div>
      </Modal>
    </div>
  )
}

export default CanvasCreationModal;