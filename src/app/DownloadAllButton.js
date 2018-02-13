import React from 'react';
import Modal from 'react-modal';
import TextArea from 'react-textarea-autosize';
import pretty from 'pretty-html';
import CopyToClipboardButton from './CopyToClipboardButton';


class DownloadAllButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateHtml: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.abAllTargetContent).length > 0) {
      this.buildTemplateHtml(nextProps);
    }
  }

  buildTemplateHtml(nextProps) {
    console.log('DL BUTTON NEXT PROPS', nextProps)
    var html = ``;
    var ifUsed = false;
    for (var key in nextProps.abAllTargetContent) {
      var locale = key.slice(0,2);
      if (!ifUsed) {
        html += `{% if $\{language} == '${locale}' %}\n`
        ifUsed = true;
      }
      else {
        html += `\n{% elsif $\{language} == '${locale}' %}\n`
      }
      html += nextProps.abAllTargetContent[key];
    }
    html += `\n{% else %}\n${nextProps.qSourceContent}\n{% endif %}`
    this.setState({templateHtml:html})
  }

  render() {
    return (
      <div className='q-nav-item'>
        <button disabled={this.props.disabled} type='button' className='q-btn btn q-download-all' onClick={this.props.handleDownloadAllClick}>Download / Publish All</button>
        <Modal
          id='q-download-all-modal'
          isOpen={this.props.downloadAllModalOpen}
          parentSelector={this.props.qModalGetParentSelector}
          onRequestClose={this.props.handleDownloadAllClose}
          contentLabel="Download All Modal"
          style={this.props.qModalStyle}
        >
          <h1>Translated HTML</h1>
          <CopyToClipboardButton handleModalClose={this.props.handleDownloadAllClose} textAreaQuery='#q-download-all-textarea' type="submit" />
          <p className='helptext'> If you'd like to include all completed translations from Qordoba.<strong> click the "Copy to Clipboard" button </strong>and replace the contents of the template to the left with the new HTML.</p>
          <div className='q-modal-textarea-container'>
            <TextArea id='q-download-all-textarea' disabled className='q-modal-textarea' value={this.state.templateHtml} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default DownloadAllButton;