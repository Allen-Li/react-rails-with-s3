import React, { Component, PropTypes } from 'react';
import * as Service from './shared/service';
import Dropzone from 'react-dropzone';
import CodeMirror from 'react-codemirror'
import Alert from 'react-s-alert';
require('codemirror/mode/htmlembedded/htmlembedded')
require('codemirror/addon/display/placeholder')

export default class UpsertTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      template_data: this.props.initial_data || {},
      name_class: '',
      html_area_class: '',
      mode: this.chooseMode(),
      new_templates: []
    }

    this.uploadTemplate = this.uploadTemplate.bind(this)
    this.enterTemplate = this.enterTemplate.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.renderHtml = this.renderHtml.bind(this)
    this.submit = this.submit.bind(this)
    this.successfulCallback = this.successfulCallback.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.renderUploadResult = this.renderUploadResult.bind(this)
    this.uploadSuccessfulCallback = this.uploadSuccessfulCallback.bind(this)
  }

  chooseMode() {
    return this.props.initial_data ? 'enter' : 'upload'
  }

  submit(e) {
    e.preventDefault()
    let is_valid = true
    let name_class = ''
    let html_area_class = ''

    if (this.refs.name_input.value == ''){
      name_class = 'valid-failed'
      is_valid = false
    }

    if (this.refs.html_textarea.props.value == '') {
      html_area_class = 'valid-failed'
      is_valid = false
    }

    this.setState({
      name_class: name_class, 
      html_area_class: html_area_class
    })

    if(is_valid) {
      let id = this.state.template_data.id
      Alert.closeAll()
      if(id) {
        Service.put(`/templates/${id}`, this.state.template_data, this.updateSuccessfulCallback, this.failingCallback)
      } else {
        Service.post('/templates', this.state.template_data, this.successfulCallback, this.failingCallback)
      }
    }
  }

  failingCallback(result) {
    Alert.error(result.responseJSON.message, {
      position: 'bottom',
      timeout: 'none'
    });
  }

  updateSuccessfulCallback(result) {
    Alert.success(result.message, {
      position: 'bottom'
    });
  }

  successfulCallback(result) {
    this.setState({template_data: {}})
    Alert.success(result.message, {
      position: 'bottom'
    });
  }
  
  handleNameChange(name) {
    var new_template_data = Object.assign({}, this.state.template_data);
    new_template_data.name = name.target.value;
    this.setState({ template_data: new_template_data, name_class: '' });
  }

  handleHtmlChange(html) {
    let new_template_data = Object.assign({}, this.state.template_data);
    new_template_data.html = html;
    this.setState({ template_data: new_template_data, html_area_class: '' });
  }

  renderHtml() {
    let placeholder = "Formats like so: \n<html>\n  <head>\n    {{moat_tags}}\n  <\/head>\n  <body>" +
      "\n    {{tracking_pixels}}\n    {{content}}\n  <\/body>\n<\/html>"
    var options = {
      gutters: ["note-gutter", "CodeMirror-linenumbers"],
      lineWrapping: true,
      placeholder: placeholder,
      lineNumbers: true,
      mode: 'htmlmixed',
      height: '600px'
    };
    return (
      <div className={`${this.state.html_area_class}`}>
        <label className="control-label">Html</label>
        <CodeMirror ref="html_textarea" value={this.state.template_data.html || ''}
          onChange={this.handleHtmlChange.bind(this)} options={options} />
      </div>
    )
  }

  enterTemplate() {
    return(
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

  onDrop(acceptedFiles) {
    var data = new FormData();
    acceptedFiles.forEach((value, key) => {
      data.append(key, value) 
    })

    Service.fileRequest('/templates/upload', data, this.uploadSuccessfulCallback)
  }

  uploadSuccessfulCallback(result) {
    this.setState({
      new_templates: result.new_templates
    });
    Alert.success(result.message, {
      position: 'bottom'
    });
  }

  uploadTemplate() {
    return(
      <div>
        <div className="drop-zone">
          <Dropzone onDrop={this.onDrop} multiple disablePreview accept="text/html">
            <p className="prompt">Dropping some templates here, or click to select templates to upload.</p>
          </Dropzone>
        </div>
        {this.renderUploadResult()}
      </div>
    )
  }

  renderUploadResult() {
    return(
      this.state.new_templates.length > 0 ? 
        <div>
          <h2>Uploaded {this.state.new_templates.length} files successfully</h2>
          <div>
            {
              this.state.new_templates.map((template, index) => 
                <p key={index}>
                  <a href={`/templates/${template.id}/preview`} target="_blank">{template.name}</a>
                </p>
              )
            }
          </div>
        </div> : null
    )
  }

  uploadMode() {
    this.setState({mode: 'upload'})
  }

  enterMode() {
    this.setState({mode: 'enter'})
  }

  render() {
    if(this.state.mode == 'upload') {
      var upload_btn_class = 'upload-template-btn active'
      var enter_btn_class = 'enter-template-btn'
    } else {
      var upload_btn_class = 'upload-template-btn'
      var enter_btn_class = 'enter-template-btn active'
    }
    return(
      <div>
        <div className="template-mode">
          <a className={upload_btn_class} href="javascript:void(0)" onClick={this.uploadMode.bind(this)}>
            Upload Template
          </a>
          |
          <a className={enter_btn_class} href="javascript:void(0)" onClick={this.enterMode.bind(this)}>
            Enter Template
          </a>
        </div>
        {this.state.mode == 'upload' ? this.uploadTemplate() : this.enterTemplate()}
        <Alert stack={true} timeout={3000} />
      </div>
    )
  }
}