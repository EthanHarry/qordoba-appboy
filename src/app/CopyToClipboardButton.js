import React from 'react';

class CopyToClipboardButton extends React.Component {
  constructor(props) {
    super(props);
    this.abCopyTargetContent = this.abCopyTargetContent.bind(this);
  }

  abCopyTargetContent() {
    var textArea = document.querySelector(this.props.textAreaQuery);
    textArea.disabled = false;
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    textArea.disabled = true;
    if (this.props.handleModalClose) {
      this.props.handleModalClose();
    }
  }

  render() {
    return (
      <button className=' q-btn btn pull-left q-copy-button' onClick={this.abCopyTargetContent}>Copy HTML to Clipboard</button>
    )
  }
}

export default CopyToClipboardButton;