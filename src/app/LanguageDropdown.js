import React from 'react';

class LanguageDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props)
  }

  render() {
    return (
      <select id='language-dropdown'>
        {Object.keys(this.props.qProjectLanguages).map((locale) => {
          return ( 
            <option className="language-dropdown-option" key={locale} data-locale={locale} data-name={this.props.qProjectLanguages[locale].name} data-id={this.props.qProjectLanguages[locale].id}>
              {this.props.qProjectLanguages[locale].name}
            </option>
          )
        })}
      </select>
    )
  }
}

export default LanguageDropdown;

