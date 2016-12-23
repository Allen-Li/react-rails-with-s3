import React, { Component, PropTypes } from 'react';
import * as Service from '../shared/service';
import WarningDialog from '../shared/WarningDialog';
import Alert from 'react-s-alert';

export default class PublishContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email_data: this.props.email_data
    }
    this.publishSuccessfulCallback = this.publishSuccessfulCallback.bind(this)
    this.publish = this.publish.bind(this)
  }

  publish(e) {
    e.preventDefault()
    let id = this.state.email_data.id
    Alert.closeAll()
    Service.put(`/emails/${id}/publish`, {}, this.publishSuccessfulCallback, this.props.failingCallback)
  }

  publishSuccessfulCallback(result) {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.path = result.path
    this.setState({show_copy_dialog: true, email_data: new_email_data})
  }

  publishEmailDialog = () => {
    let content = "Published successfully!"
    return(
      <WarningDialog heading_title="Publish Email" content={content} 
        cancelClick={this.hideCopyDialog} cancel_button_text='Close'
        hide_confirm_button={true} hide_copy_button={false}
        email_path={this.state.email_data.path}/>
    )
  }

  publicDialogButton(result) {
    return(
      <div>
        <button type="button" className="btn btn-warning"
          onClick={this.hideCopyDialog}>Close
        </button>
      </div>
    )
  }

  hideCopyDialog = () => {
    this.setState({show_copy_dialog: false})
  }

  renderPublishButton() {
    return this.state.email_data.id ? 
      <button type="submit" className="email-publish btn btn-success" onClick={this.publish} >Publish</button> : ''
  }

  render() {
    return(
      <div>
        {this.renderPublishButton()}
        {this.state.show_copy_dialog ? this.publishEmailDialog() : ''}
        <Alert stack={true} timeout={3000} />
      </div>
    )
  }
}