import React, { Component, PropTypes } from 'react';

export default class WarningDialog extends Component {
  constructor(props) {
    super(props)
  }

  confirmClick() {
    this.props.confirmClick()
    this.props.cancelClick()
  }

  render() {
    let panel_class = this.props.panel_class || 'panel-info'
    return(
      <div className="custom-warning-modal">
        <div className={`modal-content panel ${panel_class}`}>
          <div className="panel-heading">{this.props.heading_title}</div>
          <div className="panel-body">
            <p>{this.props.content}</p>
            {this.props.content_el}
            <button type="button" className="btn btn-warning"
              onClick={this.props.cancelClick}>
                {this.props.cancel_button_text || 'No'}
            </button>
            <button type="button" className="btn btn-info"
              onClick={this.confirmClick.bind(this)}>
                {this.props.confirm_button_text || 'Yes'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}
