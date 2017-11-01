import React from 'react';

class LanguageDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('DROPDOWNMENU PROPS', this.props)
  }

  render() {
    return (
      <div id='q-language-dropdown' className="q-nav-item">
        <select onChange={this.props.handleLanguageChange}>
          <option selected disabled>Select a language</option>
          {Object.keys(this.props.qProjectLanguages).map((locale) => {
            return ( 
              <option className="q-language-dropdown-option" key={locale} data-locale={locale} data-name={this.props.qProjectLanguages[locale].name} data-id={this.props.qProjectLanguages[locale].id}>
                {this.props.qProjectLanguages[locale].name}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
}

export default LanguageDropdown;

