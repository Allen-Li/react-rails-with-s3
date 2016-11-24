import React, { Component, PropTypes } from 'react';
import * as Service from './shared/service';

export default class UpsertTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      template_data: this.props.initial_data || {},
      name_class: '',
      html_area_class: ''
    }

    this.handleNameChange = this.handleNameChange.bind(this)
    this.renderHtml = this.renderHtml.bind(this)
    this.submit = this.submit.bind(this)
    this.successfulCallback = this.successfulCallback.bind(this)
  }

  submit(e) {
    e.preventDefault()
    let is_valid = true
    let name_class = ''
    let html_area_class = ''

    if (this.refs.name_input.value == ''){
      name_class = 'valide-failed'
      is_valid = false
    }

    if (this.refs.html_textarea.value == '') {
      html_area_class = 'valide-failed'
      is_valid = false
    }

    this.setState({
      name_class: name_class, 
      html_area_class: html_area_class
    })

    if(is_valid) {
      let id = this.state.template_data.id
      if(id) {
        return Service.get(`/templates/${id}/edit`, this.state.template_data, this.successfulCallback)
      } else {
        return Service.post('/templates', this.state.template_data, this.successfulCallback)
      }
    }
  }

  successfulCallback(result) {
    this.setState({template_data: {}})
    alert(result.message)
  }
  
  handleNameChange(name) {
    var new_template_data = Object.assign({}, this.state.template_data);
    new_template_data.name = name.target.value;
    this.setState({ template_data: new_template_data, name_class: '' });
  }

  handleHtmlChange(html) {
    let new_template_data = Object.assign({}, this.state.template_data);
    new_template_data.html = html.target.value;
    this.setState({ template_data: new_template_data, html_area_class: '' });
  }

  renderHtml() {
    return (
      <div>
        <label className="control-label">Html</label>
        <textarea ref="html_textarea" className={`form-control template-html-area ${this.state.html_area_class}`} onChange={this.handleHtmlChange.bind(this)} value={this.state.template_data.html || ''}></textarea>
      </div>
    )
  }

  render() {
    return (
      <form ref="new_template" data-toggle="validator" role="form">
        <div className="form-group">
          <label className="control-label">Name</label>
          <input ref="name_input" type="text" className={`form-control ${this.state.name_class}`} id="inputName" placeholder="Template Name" onChange={this.handleNameChange} value={this.state.template_data.name || ''}></input>
        </div>

        <div className="form-group">
          {this.renderHtml()}
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary" onClick={this.submit} >Submit</button>
        </div>
      </form>
    )
  }
}