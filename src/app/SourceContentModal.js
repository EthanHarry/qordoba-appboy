import TextArea from 'react-textarea-autosize';
import React from 'react';
import Modal from 'react-modal';

var SourceContentModal = (props) => {
  console.log('SRC CONTENT MODAL props', props)
  return (
    <Modal
      id='q-source-content-modal'
      isOpen={props.sourceContentModalOpen}
      parentSelector={props.qModalGetParentSelector}
      onRequestClose={props.handleSourceContentClose}
      contentLabel="Source Content Modal"
      style={props.qModalStyle}
    >
      <h1>Template source content</h1>
      <p className='helptext'>To send this template to Qordoba for translation, please<strong> copy and paste ALL contents from the HTML editor to the left </strong>and click "Submit" to send to Qordoba.</p>
      <div className='q-modal-textarea-container'>
        <TextArea className='q-modal-textarea' value={props.abAllSourceContent} onChange={props.handleSourceContentChange} />
      </div>
      <button className='btn' type='submit' onClick={props.handleSourceContentClose}> Submit </button>
    </Modal>
  )
}

export default SourceContentModal;