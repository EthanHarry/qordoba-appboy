console.log('hi react app')
import React from 'react';
import IFrame from 'react-iframe';
import $ from 'jquery';
import styles from './main.css';
import LanguageDropdown from './LanguageDropdown.js';


//TODO
  //auth
  //Fix event listeners so that extension can fire multiple times without reload
  //Fix config import and usage
  //Webpack config
  //Loading spinner while w8ing for init
  //Stop alert from firing every fucking time
  //Set App header contents
  //Determine where to put classes on React containers (we have 2 containers -- target and container in App)



//NEXT
  //1. API call to Qordoba to see if asset exists
    //Lookup and save in Qordoba by TYPE and by ID (we'll get fancy and add name later)
  //2. conditional rendering of iFrame, "send to Qordoba" button, or "Translation in progress" string

class App extends React.Component {
  constructor(props) {
    super(props);

    //Need to actually render from auth
    this.state = {
      qAuthToken: 'b57c4072-6533-409c-b4b1-cdd9210c1802',
      qOrganizationId: '3168',
      qProjectId: '5843',
      qProjectLanguages: {},
      qProjectFiles: {},
      abCurrentLanguageCode: '',
      abCurrentLanguageName: '',
      abCurrentType: '',
      abCurrentId: '',
      abCurrentTitle: ''
    }
    this.getQLanguages = this.getQLanguages.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  //React UI

  async componentDidUpdate() {
    console.log('STATE', this.state)
  }


  async componentDidMount() {
    this.getCurrentAbTemplate();
    await this.getQLanguages();
  }


  async handleLanguageChange(e) {
    console.log(e.target)
    var dropdownMenu = e.target;
    var selectedOption = dropdownMenu.querySelector(`[data-name="${e.target.value}"]`);
    await this.setState({abCurrentLanguageName: selectedOption.dataset.name, abCurrentLanguageCode: selectedOption.dataset.locale});
    await this.getQFiles();
  }


  //Appboy Data

  getCurrentAbTemplate() {
    var urlPathArray = window.location.pathname.split('/');
    var articleTitleSpan = document.querySelector('span.editable-heading');
    this.setState({abCurrentType: urlPathArray[urlPathArray.length - 2], abCurrentId: urlPathArray[urlPathArray.length - 1], abCurrentTitle: articleTitleSpan.innerHTML})
  }

  //QORDOBA API CALLS

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

  async getQFiles() {
    var reqHeader = {
      'X-AUTH-TOKEN': this.state.qAuthToken,
      'Content-Type': 'application/json'
    };
    var qordobaLanguageId = this.state.qProjectLanguages[this.state.abCurrentLanguageCode].id;
    console.log('qprojId', qordobaLanguageId)
    var qordobaResponse = await $.ajax({
      type: 'POST',
      url: `https://app.qordoba.com/api/projects/${this.state.qProjectId}/languages/${qordobaLanguageId}/page_settings/search`,
      headers: reqHeader,
      data: JSON.stringify({})
    })
    var qordobaFiles = qordobaResponse.pages;
    var allQFilesObj = Object.assign({}, this.state.qProjectFiles);
    for (var i = 0; i < qordobaFiles.length; i++) {
      var qordobaFileObj = {};
      qordobaFileObj.completed = qordobaFiles[i].completed;
      qordobaFileObj.enabled = qordobaFiles[i].enabled;
      qordobaFileObj.createdAt = qordobaFiles[i].created_at;
      qordobaFileObj.updatedAt = qordobaFiles[i].update;
      qordobaFileObj.qArticleId = qordobaFiles[i].page_id;
      allQFilesObj[qordobaFiles[i].url] = qordobaFileObj;
    }
    this.setState({qProjectFiles: allQFilesObj})
  }



  render() {
    return (
      <div id='q-app-container' className='flex flex-column flex-full-width-height'>
        <LanguageDropdown handleLanguageChange={this.handleLanguageChange} qProjectLanguages={this.state.qProjectLanguages} getQLanguages={this.getQLanguages}/>
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
