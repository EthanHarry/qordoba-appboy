import React from 'react';
import Dialog from 'react-dialog';
import Modal from 'react-modal';
import TextArea from 'react-textarea-autosize';
import pretty from 'pretty-html';


class DownloadAllButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateHtml: '', 
      modalOpen: false, 
      modalStyle: {
        overlay: {
          position: 'absolute'
        },
        content: {
          left: '10px',
          right: '10px'
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.abAllTargetContent).length > 0) {
      console.log('BUILDING TEMPLATE HTML', this.props.abAllTargetContent)
      this.buildTemplateHtml(nextProps);
    }
  }

  componentDidUpdate() {
    console.log('UPDTATING DL ALL BUTTON!!!!', this.state)
  }

  buildTemplateHtml(nextProps) {
    console.log('NEXT PROPS', nextProps)
    var html = `<html>\n<head>\n${this.props.abHeadContent}\n</head>\n<body>\n`;
    var ifUsed = false;
    for (var key in nextProps.abAllTargetContent) {
      var locale = key.slice(0,2);
      if (!ifUsed) {
        html += `{% if $\{language} == '${locale}' %}`
        ifUsed = true;
      }
      else {
        html += `{% elsif $\{language} == '${locale}' %}`
      }
      html += nextProps.abAllTargetContent[key];
      html += '\n';
    }
    html += `{% else %}${nextProps.abSourceContent}{% endif %}\n</body></html>`
    this.setState({templateHtml:html})
  }

  afterModalOpen() {
    console.log('MODAL IS OPEN', this)
  }

  getParentSelector() {
    return document.querySelector('.q-app-container')
  }

  render() {
    console.log('IS MODAL OPEN?!?', this.props.downloadAllModalOpen)
    return (
      <div className='q-nav-item'>
        <button disabled={this.props.disabled} type='button' className='btn q-download-all' onClick={this.props.handleDownloadAllClick}>Download and publish all completed translations</button>
        <Modal
          id='q-download-all-modal'
          isOpen={this.props.downloadAllModalOpen}
          parentSelector={this.getParentSelector}
          onAfterOpen={this.afterModalOpen}
          onRequestClose={this.props.handleDownloadAllClose}
          contentLabel="Modal"
          style={this.state.modalStyle}
        >
          <h1>Modal Content</h1>
          <div className='q-download-all-textarea-container'>
            <TextArea className='q-download-all-textarea' value={this.state.templateHtml} />
          </div>
          <p>Etc.</p>
        </Modal>
      </div>
    );
  }
}

export default DownloadAllButton;

/*
    <div className='container'>
          {
            this.props.downloadAllModalOpen &&
            <Dialog
            title="Dialog Title"
            width={700}
            onClose={this.props.handleDownloadAllClose}
            buttons={
            [
              {text: "Close",onClick: () => this.props.handleDownloadAllClose(), className: 'q-close-modal'}
            ]
            }>
              <h1>Dialog Content</h1>
              <p>More Content. Anything goes here</p>
            </Dialog>
          }
        </div>
      </div>
      */