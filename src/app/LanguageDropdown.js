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
        <select value={this.props.languageDropdownValue} disabled={this.props.disabled} onChange={this.props.handleLanguageChange}>
          <option disabled value={0}>Select a language</option>
          {Object.keys(this.props.qProjectLanguages).map((locale) => {
            if (locale !== this.props.qSourceLocale)
            return ( 
              <option disabled={this.props.qTranslationStatusObj[locale] && !this.props.qTranslationStatusObj[locale].completed} className="q-language-dropdown-option" value={locale} key={locale} data-locale={locale} data-name={this.props.qProjectLanguages[locale].name} data-id={this.props.qProjectLanguages[locale].id}>
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

