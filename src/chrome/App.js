console.log('hi react app')
import React from 'react';
import IFrame from 'react-iframe';

//TODO
  //auth
  //Fix event listeners so that extension can fire multiple times without reload
  //Fix config import and usage
  //Webpack config

class App extends React.Component {
  constructor(props) {
    super(props);

    //Need to actually render from auth
    this.state = {
      authToken: '',
      organizationId: '',
      projectId: ''
    }

    // this.getAndRenderLanguages = this.getAndRenderLanguages.bind(this);
  }

  componentDidMount() {
    this.getAndRenderLanguages();
  }

  getAndRenderLanguages() {
    console.log('hi')
  }

  render() {
    return (
      <div id='q-app-container' className='flex flex-column flex-full-width-height'>
        <div id="language-switcher">languageSwitcher placeholder</div>
        <select>
        </select>
        <div id="q-email-preview-holder" className="email-preview-holder flex flex-column flex-full-width-height">
          <div>IFRAME PLACEHOLDER</div>
        </div>
      </div>
    )
  }
}

export default App;
          // <IFrame
            // url="https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy"
            // className="email-preview flex-full-width-height"
          // />
          // <iframe className='email-preview flex-full-width-height' src='http://www.example.com'></iframe>
