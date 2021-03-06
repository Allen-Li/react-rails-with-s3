import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as Service from './shared/service';
import WarningDialog from './shared/WarningDialog'
import CopyToClipboard from 'react-copy-to-clipboard';
import Alert from 'react-s-alert';

export default class Email extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emails_data: this.props.emails_data,
      show_delete_dialog: false
    }

    this.rowActions = this.rowActions.bind(this)
    this.deleteEmail = this.deleteEmail.bind(this)
    this.deleteSuccessfulCallback = this.deleteSuccessfulCallback.bind(this)
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this)
  }

  deleteEmail() {
    Service.destroy(`/emails/${this.state.cell_id}`, {}, this.deleteSuccessfulCallback)
  }

  deleteEmailConfirm() {
    let content = "Are you sure you want to delete this email?"
    return(
      <WarningDialog heading_title="Delete Email" content={content} 
        cancelClick={this.hideDeleteConfirm} confirmClick={this.deleteEmail}/>
    )
  }

  showDeleteConfirm(cell) {
    this.setState({show_delete_dialog: true, cell_id: cell.id})
  }

  hideDeleteConfirm = () => {
    this.setState({show_delete_dialog: false, cell_id: ''})
  }

  deleteSuccessfulCallback(result) {
    this.setState({emails_data: result.emails_data})
    Alert.success(result.message, {
      position: 'bottom'
    });
  }

  downloadEmail(cell) {
    location.href = `/emails/${cell.id}/download`
  }

  previewEmail(cell, row) {
    window.open(`/emails/${cell.id}/preview`)
  }

  copyNdePath(cell, row) {
    Alert.success('Copy Successfully!', {
      position: 'bottom'
    });
  }

  editEmail(cell, row) {
    $('#loading').show()
    location.href = `/emails/${cell.id}/edit`
  }

  rowActions(cell, row){
    return (
      <div>
        <button type="button" className="btn btn-info" onClick={this.previewEmail.bind(cell, row)}>Preview</button>
        <button type="button" className="btn btn-info" onClick={this.downloadEmail.bind(cell, row)}>Download</button>
        <CopyToClipboard text={row.path || 'Path is null'}
          onCopy={this.copyNdePath}>
          <button type="button" className="btn btn-info">Copy Path</button>
        </CopyToClipboard>
        <button type="button" className="btn btn-info" onClick={this.editEmail.bind(cell, row)}>Edit</button>
        <button type="button" className="btn btn-danger delete-email" onClick={this.showDeleteConfirm.bind(cell, row)} >Delete</button>
      </div>
    )
  }

  sizePerPageDropDown(){
    return <div></div>
  }

  dateFilter(date_str) {
    let date = new Date(date_str)
    return date.setHours(8)
  }

  filterChange(filterValue) {
    if(filterValue.updated_at) {
      let date = filterValue.updated_at.value.date
      filterValue.updated_at.value.date = date.getTime()
    } else if(filterValue.created_at) {
      let date = filterValue.created_at.value.date
      filterValue.created_at.value.date = date.getTime()
    }
    return filterValue
  }

  render() {
    let options = {
      sizePerPage: 15,
      sizePerPageDropDown: this.sizePerPageDropDown,
      onFilterChange: this.filterChange
    }

    return (
      <div>
        <BootstrapTable data={this.state.emails_data} hover pagination options={options} striped={true}>
          <TableHeaderColumn dataField="id" dataSort={true} isKey={true} width="60"> ID </TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataSort={true}
            filter={{type: "TextFilter", placeholder: "Please enter a email name"}}>
            Name</TableHeaderColumn>
          <TableHeaderColumn dataField="template_name" dataSort={true} filter={{type: "TextFilter",
            placeholder: "Please enter a template name"}} >Template Name</TableHeaderColumn>
          <TableHeaderColumn dataField="created_at" dataSort={true} filter={{type: "DateFilter"}}
            width="250" filterValue={this.dateFilter}>Created At</TableHeaderColumn>
          <TableHeaderColumn dataField="updated_at" dataSort={true} filter={{type: "DateFilter"}}
            width="250" filterValue={this.dateFilter}>Updated At</TableHeaderColumn>
          <TableHeaderColumn columnClassName="list-action" width="420" dataFormat={this.rowActions}>
            Actions</TableHeaderColumn>
        </BootstrapTable>
        <Alert stack={true} timeout={3000} />
        {this.state.show_delete_dialog ? this.deleteEmailConfirm() : ''}
      </div>
    )
  }
} 