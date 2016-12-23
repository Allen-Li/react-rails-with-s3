import React, { Component, PropTypes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Alert from 'react-s-alert';

export default class WarningDialog extends Component {
  constructor(props) {
    super(props)
  }

  confirmClick() {
    this.props.confirmClick()
    this.props.cancelClick()
  }

  copyNdePath() {
    Alert.success('Copy path successfully!', {
      position: 'bottom'
    });
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

            {this.props.hide_cancel_button ? '' :
              <button type="button" className="btn btn-warning"
                onClick={this.props.cancelClick}>
                  {this.props.cancel_button_text || 'No'}
              </button>
            }
            {this.props.hide_confirm_button ? '' :
              <button type="button" className="btn btn-info"
                onClick={this.confirmClick.bind(this)}>
                  {this.props.confirm_button_text || 'Yes'}
              </button>
            }
            {this.props.hide_copy_button == false ?
              <CopyToClipboard text={this.props.email_path || 'Path is null'}
                onCopy={this.copyNdePath.bind(this)}>
                <button type="button" className="btn btn-info copy-path">
                  {this.props.copy_button_text || 'Copy Path'}
                </button>
              </CopyToClipboard> : ''
            }
          </div>
        </div>
        <Alert stack={true} timeout={3000} />
      </div>
    )
  }
}
