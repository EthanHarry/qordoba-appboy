import React from 'react';
import Dialog from 'react-dialog'
class DownloadAllButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    console.log('UPDTATING DL ALL BUTTON!!!!', this.props)
  }

  render() {
    return (
      <div className='container'>
        <button type='button' className='btn img-btn pull-left q-download-all' onClick={this.props.handleDownloadAllClick}>Download and publish all completed translations</button>
        {
          this.props.downloadAllModalOpen &&
          <Dialog
          title="Dialog Title"
          onClose={this.props.handleDownloadAllClose}
          >
          <h1>Dialog Content</h1>
          <p>More Content. Anything goes here</p>
          </Dialog>
        }
      </div>
    );
  }
}

export default DownloadAllButton;