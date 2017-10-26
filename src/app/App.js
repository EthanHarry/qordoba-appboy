console.log('hi react app')
import React from 'react';
import IFrame from 'react-iframe';
import $ from 'jquery';
import styles from './main.css';


//TODO
  //auth
  //Fix event listeners so that extension can fire multiple times without reload
  //Fix config import and usage
  //Webpack config
  //Loading spinner while w8ing for init

class App extends React.Component {
  constructor(props) {
    super(props);

    //Need to actually render from auth
    this.state = {
      qAuthToken: 'b57c4072-6533-409c-b4b1-cdd9210c1802',
      qOrganizationId: '3168',
      qProjectId: '5843',
      qProjectLanguages: {}
    }

    // this.getAndRenderLanguages = this.getAndRenderLanguages.bind(this);
  }

  async componentDidMount() {
    await this.getQLanguages();
  }

  async getQLanguages() {
    var reqHeader = {
      'X-AUTH-TOKEN': this.state.qAuthToken,
      'Content-Type': 'application/json'
    };
    var projectDetailCall = await $.ajax({
      type: 'GET',
      url: `https://app.qordoba.com/api/organizations/${this.state.qOrganizationId}/projects?limit=1&offset=0&limit_to_projects=${this.state.qProjectId}`,
      headers: reqHeader
    })
    var qProjectLanguages = projectDetailCall.projects[0].target_languages;

    for (var i = 0; i < qProjectLanguages.length; i++) {
      var qLangs = Object.assign({}, this.state.qProjectLanguages);
      qLangs[qProjectLanguages[i].code] = {id: qProjectLanguages[i].id, name: qProjectLanguages[i].name}
      this.setState({qProjectLanguages: qLangs});
    }
  }

  render() {
    return (
      <div id='q-app-container' className='flex flex-column flex-full-width-height'>
        <select id='language-dropdown'>
          {Object.keys(this.state.qProjectLanguages).map((locale) => {
            return ( 
              <option className="language-dropdown-option" key={locale} data-locale={locale} data-name={this.state.qProjectLanguages[locale].name} data-id={this.state.qProjectLanguages[locale].id}>
                {this.state.qProjectLanguages[locale].name}
              </option>
            )
          })}
        </select>
        <div id="q-email-preview-holder" className="email-preview-holder flex flex-column flex-full-width-height">
          <IFrame
            url="https://www.hackreactor.com"
            className="email-preview flex-full-width-height"
          />
        </div>
      </div>
    )
  }
}

export default App;
