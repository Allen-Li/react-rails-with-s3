import React, { Component, PropTypes } from 'react';

export default class DynamicInputField extends Component {
  constructor(props) {
    super(props)
    this.renderDynamicInputField = this.renderDynamicInputField.bind(this)
    this.handleInputFieldChange = this.handleInputFieldChange.bind(this)
  }

  addInputField(type) {
    this.props.updateDynamicInputValue(type, this.props.values.length, '')
  }

  deleteInputField(type, index, e) {
    this.props.deleteDynamicInputField(type, index)
  }

  handleInputFieldChange(type, index, e) {
    let value = e.target.value;
    this.props.updateDynamicInputValue(type, index, value)
  }

  renderDynamicInputField() {
    let dynamic_values = this.props.values
    let type = this.props.type
    return dynamic_values.map((value, index)=>{
      return(
        <div className="dynamic-input-field" key={index}>
          <input type="text" className="form-control" onChange={this.handleInputFieldChange.bind(this, type, index)}
            value={value}></input>
          <a className="delete-dynamic-input-field" href="javascript:void(0)"
            onClick={this.deleteInputField.bind(this, type, index)}>X</a>
        </div>
      )
    })
  }

  render() {
    return(
      <div className="form-group dynamic_input_fields">
        <label className="control-label">{this.props.label}</label>
        <a className="add-dynamic-input-field" href="javascript:void(0)" onClick={this.addInputField.bind(this, this.props.type)}>ADD</a>
        {this.renderDynamicInputField()}
      </div>
    )
  }
}