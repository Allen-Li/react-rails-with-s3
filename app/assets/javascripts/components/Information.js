import React, { Component, PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';

export default class Information extends Component {
  render() {
    var input = '# This is a header\n\nAnd this is a paragraph';
    return(
      <ReactMarkdown source={this.props.information} />
    )
  }
}