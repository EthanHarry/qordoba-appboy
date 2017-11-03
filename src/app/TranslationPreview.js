import React from 'react';

class TranslationPreview extends React.Component {
  constructor(props) {
    console.log('PROPS YO!!!', props)
    super(props);
    this.state = {abTargetCompleteHtml: ''}
  }

  abCopyTargetContent() {
    var textArea = document.querySelector('textarea.q-translated-textarea');
    console.log('textarea', textArea)
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
  }

  render() {
    console.log(this.props)
    if (!this.props.disabled) {
      return (
        <div className='q-translation-status-container flex flex-column flex-full-width-height'>
          <div id="q-email-preview-holder" className="email-preview-holder flex flex-column flex-full-width-height">
            <iframe
              srcDoc={this.props.abLocaleTargetContent}
              className="email-preview flex-full-width-height"
              id="q-preview-iframe"
            />
          </div>
            <div>
              <button className='btn img-btn pull-left' onClick={this.abCopyTargetContent} type="submit" id='q-copy-button'> Copy translation to clipboard </button>
              <button className='btn img-btn pull-left' onClick={this.props.qFileUpload} type="submit" id='q-upload-button'> Re-upload changed template to Qordoba </button>
            </div>
          <textarea className='q-translated-textarea' value={this.props.abLocaleTargetContent}></textarea>
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }
}

export default TranslationPreview;