import React from 'react';
import Dialog from 'react-dialog'
class DownloadAllButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {templateHtml: ''}
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

  render() {
    return (
      <div className='q-nav-item'>
        <button disabled={!this.props.abFileTranslationsExist} type='button' className='btn img-btn q-download-all' onClick={this.props.handleDownloadAllClick}>Download and publish all completed translations</button>
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
              <textarea rows={20} cols={40} value={this.state.templateHtml}/>
            </Dialog>
          }
        </div>
      </div>
    );
  }
}

export default DownloadAllButton;