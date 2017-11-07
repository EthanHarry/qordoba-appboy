import React from 'react';
import CopyToClipboardButton from './CopyToClipboardButton.js';

class TranslationPreview extends React.Component {
  constructor(props) {
    console.log('PROPS YO!!!', props)
    super(props);
    this.state = {abTargetCompleteHtml: '', textArea: ''}
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
        </div>
      )
    }
    else if (this.props.abLanguageCode) {
      return (
        <p className='helptext'>This translation has not yet been completed in Qordoba.</p>
      )
    }
    else {
      return (
        <p>You have completed translations in Qordoba! Select a language in the dropdown to see a preview or download all above! </p>
      )
    }
  }
}

export default TranslationPreview;
              //<CopyToClipboardButton textAreaQuery='textarea.q-translated-textarea' type="submit" className='q-copy-button' />
          // <textarea className='q-translated-textarea' value={this.props.abLocaleTargetContent}></textarea>