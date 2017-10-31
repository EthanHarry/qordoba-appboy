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
      <div>
        <button type='button' className='btn img-btn pull-left q-download-all' onClick={this.props.handleDownloadAllClick}>Download and publish all completed translations</button>
        <div className='container'>
          {
            this.props.downloadAllModalOpen &&
            <Dialog
            title="Dialog Title"
            modal={true}
            onClose={this.props.handleDownloadAllClose}
            buttons={
            [
              {text: "Close",onClick: () => this.props.handleDownloadAllClose()}
            ]
            }>
            <h1>Dialog Content</h1>
            <p>More Content. Anything goes here</p>
            </Dialog>
          }
        </div>
      </div>
    );
  }
}

export default DownloadAllButton;