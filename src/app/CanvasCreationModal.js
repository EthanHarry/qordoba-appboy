import React from 'react';
import Modal from 'react-modal';

var CanvasCreationModal = (props) => {
 return (
    <div className='q-nav-item'>
      <Modal
        id='q-canvas-creation-modal'
        isOpen={props.canvasCreationModalOpen && !props.qLoginModalOpen}
        parentSelector={props.qModalGetParentSelector}
        onRequestClose={props.handleCanvasModalClose}
        contentLabel="Canvas Creation Modal"
        style={props.qModalStyle}
      >
        <form onSubmit={props.handleCanvasIdSubmit} id='q-canvas-creation-form'>
          <input className='q-input' type='text' placeholder='Canvas ID' />
          <button id='q-canvas-creation-btn' className='q-btn btn'> Submit </button>
        </form>
        <h1> Name this Message </h1>
        <h3> NOTE: Please check with your manager for Message naming conventions before proceeding. </h3>
        <div> Each Message created from Canvas must be given a unique ID. Please make sure that you give this Message very specific, clear name that your teammates will recognize. </div>
      </Modal>
    </div>
  )
}

export default CanvasCreationModal;