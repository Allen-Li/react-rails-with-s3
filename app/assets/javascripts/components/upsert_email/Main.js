import React, { Component, PropTypes } from 'react';
import * as Service from '../shared/service';
import Dropzone from 'react-dropzone';
import Select from 'react-select';
import DynamicInputField from './DynamicInputField';
import ImageContainer from './ImageContainer';
import CodeMirror from 'react-codemirror'
require('codemirror/mode/htmlembedded/htmlembedded')
require('codemirror/mode/javascript/javascript')
require('codemirror/addon/display/placeholder')

export default class UpsertEmail extends Component {
  constructor(props) {
    super(props)
    this.state = this.initState()
    this.templateSelectChange = this.templateSelectChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleEmailTypeChange = this.handleEmailTypeChange.bind(this)
    this.submit = this.submit.bind(this)
    this.renderEmailTypeBody = this.renderEmailTypeBody.bind(this)
    this.renderClientHtml = this.renderClientHtml.bind(this)
    this.renderMoatTags = this.renderMoatTags.bind(this)
    this.renderEmailType = this.renderEmailType.bind(this)
    this.successfulCallback = this.successfulCallback.bind(this)
  }

  initState() {
    return {
      email_data: this.props.initial_data || {
        name: '',
        tracking_pixels: [''],
        moat_tags: '',
        template_id: '',
        html: '',
        images_attributes: [],
        email_type: 'client_html'
      },
      name_class: '',
      template_select_class: '',
      html_area_class: '',
      image_drop_zone_class: '',
      is_valid: true,
      active_image_index: ''
    }
  }

  templateSelectChange(template) {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.template_id = template.value;
    this.setState({ email_data: new_email_data, template_select_class: '' });
  }

  updateDynamicInputValue(type, index, value) {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data[type][index] = value
    this.setState({ email_data: new_email_data})
  }

  deleteDynamicInputField(type, index) {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data[type].splice(index, 1)
    this.setState({ email_data: new_email_data})
  }

  submit(e) {
    e.preventDefault()
    let is_valid = true
    let name_class = ''
    let template_select_class = ''
    let html_area_class = ''
    let image_drop_zone_class = ''

    if (this.state.email_data.name == ''){
      name_class = 'valid-failed'
      is_valid = false
    }

    if (this.state.email_data.template_id == '') {
      template_select_class = 'valid-failed'
      is_valid = false
    }

    switch(this.state.email_data.email_type){
      case 'client_html':
        if(this.state.email_data.html == '') {
          html_area_class = 'valid-failed'
          is_valid = false
          this.showAlertMessage('Client html is required.')
        }
        break
      case 'single_image':
        if(this.validImageLength() == 0) {
          image_drop_zone_class = 'valid-failed'
          is_valid = false
          this.showAlertMessage('Image is required. Please upload.')
        }

        if(this.validImageLength() > 1) {
          is_valid = false
          this.showAlertMessage('Please upload single image.')
        }
        break
      case 'multiple_images':
        if(this.validImageLength() < 2) {
          image_drop_zone_class = 'valid-failed'
          is_valid = false
          this.showAlertMessage('Multiple image is required. Please upload more than one.')
        }
    }

    this.setState({
      name_class: name_class, 
      template_select_class: template_select_class,
      html_area_class: html_area_class,
      image_drop_zone_class: image_drop_zone_class,
      is_valid: is_valid
    })

    if(is_valid) {
      let id = this.state.email_data.id
      this.update_position()
      if(id) {
        Service.put(`/emails/${id}`, this.state.email_data, this.updateSuccessfulCallback)
      } else {
        Service.post('/emails', this.state.email_data, this.successfulCallback)
      }
    }
  }

  showAlertMessage(message) {
    alert(message)
  }

  update_position = () => {
    let new_email_data = Object.assign({}, this.state.email_data)
    this.state.email_data.images_attributes.forEach((image, index) => {
      image.position = index + 1
    })
    this.setState({ email_data: new_email_data });
  }

  validImageLength = () => {
    return this.state.email_data.images_attributes.filter(image=>{
      return image['_destroy'] != true
    }).length
  }

  updateSuccessfulCallback() {
    alert('The email is updating successfully!')
  }

  successfulCallback(result) {
    this.setState(this.initState())
    alert('New email successfully!')
  }

  template_select() {
    let options = this.props.template_options
    return (
      <Select className={this.state.template_select_class} name="form-field-name"
        value={this.state.email_data.template_id} options={options} onChange={this.templateSelectChange}
        placeholder="Please Select a Template"/>
    )
  }

  handleNameChange(name) {
    var new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.name = name.target.value;
    this.setState({ email_data: new_email_data, name_class: '' });
  }

  handleClientHtmlChange(html) {
    this.setClientHtmlState(html)
  }

  setClientHtmlState = (html) => {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.html = html;
    this.setState({ email_data: new_email_data, html_area_class: '' });
  }

   handleMoatTagsChange(moat_tags) {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.moat_tags = moat_tags;
    this.setState({ email_data: new_email_data });
  }

  setClientHtml = (e) => {
    let file = e.target.files[0]
    this.getFileContent(file)
  }

  getFileContent = (file) => {
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8")
    reader.onload = () => {
      this.setClientHtmlState(reader.result);
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    }
  }

  renderMoatTags() {
    var options = { lineWrapping: true, lineNumbers: true, mode: 'javascript' };
    return (
      <div className="form-group moat-tags-area">
        <label className="control-label"> Moat Tags </label>
        <CodeMirror ref="moat_tags" value={this.state.email_data.moat_tags || ''}
          onChange={this.handleMoatTagsChange.bind(this)} options={options} />
      </div>
    )
  }

  renderClientHtml() {
    var options = { lineWrapping: true, lineNumbers: true, mode: 'htmlmixed' };
    return (
      <div className={this.state.html_area_class}>
        <label className="control-label">Client Html</label>
        <CodeMirror ref="html_textarea" value={this.state.email_data.html || ''}
          onChange={this.handleClientHtmlChange.bind(this)} options={options} />
        <input type="file" className="form-control" onChange={this.setClientHtml} accept="text/html"></input>
      </div>
    )
  }

  renderEmailWithImage() {
    return (
      <ImageContainer setImagesState={this.setImagesState}
        images={this.state.email_data.images_attributes}
        active_image_index={this.state.active_image_index}
        swapImage={this.swapImage}
        removeImage={this.removeImage}
        setImageInfo={this.setImageInfo}
        image_drop_zone_class={this.state.image_drop_zone_class}
        is_multiple={this.state.email_data.email_type == 'multiple_images'}
        setActiveImageIndex={this.setActiveImageIndex}/>
    )
  }

  setActiveImageIndex = (index) => {
    this.setState({active_image_index: index})
  }

  setImagesState = (image_data, index) => {
    var new_email_data = Object.assign({}, this.state.email_data);
    var old_images_data = new_email_data.images_attributes[index]
    if(typeof(index) == 'number') {
      new_email_data.images_attributes[index] = Object.assign({}, old_images_data, image_data)
    } else if(this.state.email_data.email_type == 'single_image') {
      new_email_data.images_attributes[0] = image_data
    } else {
      new_email_data.images_attributes.push(image_data);
    }
    this.setState({ email_data: new_email_data, image_drop_zone_class: '', active_image_index: '' });
  }

  swapImage = (index, action) => {
    let offset = action == 'up' ? -1 : 1
    let new_email_data = Object.assign({}, this.state.email_data);
    let origin = new_email_data.images_attributes[index]
    new_email_data.images_attributes[index] = new_email_data.images_attributes[index + offset]
    new_email_data.images_attributes[index + offset] = origin
    this.setState({ email_data: new_email_data});
  }

  removeImage = (index) => {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.images_attributes[index]['_destroy'] = true
    this.setState({ email_data: new_email_data});
  }

  setImageInfo = (key, index, e) => {
    let value = e.target.value
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.images_attributes[index][key] = value;
    new_email_data.images_attributes[index]['link_class'] = ''
    this.setState({ email_data: new_email_data});
  }

  renderEmailTypeBody() {
    switch(this.state.email_data.email_type){
      case 'client_html':
        return this.renderClientHtml()
      case 'single_image':
      case 'multiple_images':
        return this.renderEmailWithImage()
    }
  }

  renderEmailType() {
    let type_btn_class = []
    switch(this.state.email_data.email_type){
      case 'client_html':
        type_btn_class = ['active']
        break
      case 'single_image':
        type_btn_class = ['','active']
        break
      case 'multiple_images':
        type_btn_class = ['','', 'active']
        break
    }

    return(
      <div className="email-types">
        <a className={type_btn_class[0]} href="javascript:void(0)"
          onClick={this.handleEmailTypeChange} data-type="client_html">
          Client Html
        </a>
        |
        <a className={type_btn_class[1]} href="javascript:void(0)"
          onClick={this.handleEmailTypeChange} data-type="single_image">
          Single Image
        </a>
        |
        <a className={type_btn_class[2]} href="javascript:void(0)"
          onClick={this.handleEmailTypeChange} data-type="multiple_images">
          Multiple Images
        </a>
      </div>
    )
  }

  handleEmailTypeChange(e) {
    let new_state = Object.assign({}, this.state)
    new_state.email_data.email_type = e.target.getAttribute('data-type')
    this.setState(new_state)
  }

  renderDynamicAttribute() {
    return(
      <DynamicInputField
        values={this.state.email_data['tracking_pixels']}
        updateDynamicInputValue={this.updateDynamicInputValue.bind(this)}
        deleteDynamicInputField={this.deleteDynamicInputField.bind(this)}
        label={'Tracking Pixels'}
        type={'tracking_pixels'}
      />
    )
  }

  render() {
    return (
      <form>
        {this.renderEmailType()}
        <div className="row">
          <div className="form-group col-sm-6">
            <label className="control-label">Name</label>
            <input type="text" className={`form-control ${this.state.name_class}`} id="inputName"
              placeholder="Email Name" onChange={this.handleNameChange}
              value={this.state.email_data.name}></input>
          </div>

          <div className="form-group col-sm-6">
            <label className="control-label">Template</label>
            {this.template_select()}
          </div>
        </div>

        {this.renderDynamicAttribute()}
        {this.renderMoatTags()}

        <div className="form-group">
          {this.renderEmailTypeBody()}
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary" onClick={this.submit} >Submit</button>
        </div>
      </form>
    )
  }
}
