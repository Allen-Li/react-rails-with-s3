import React, { Component, PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';

export default class Information extends Component {
  render() {
    return(
      <ReactMarkdown source={this.props.information} />
    )
  }
}