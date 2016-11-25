import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as Service from './shared/service';

export default class UpsertTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      templates_data: this.props.templates_data
    }

    this.rowActions = this.rowActions.bind(this)
    this.sizePerPageDropDown = this.sizePerPageDropDown.bind(this)
    this.delete = this.delete.bind(this)
    this.successfulCallback = this.successfulCallback.bind(this)
  }

  delete(cell, row) {
    if (confirm(`Are you sure you want to delete this template`) == true) {
      Service.destroy(`/templates/${cell.id}`, {}, this.successfulCallback)
    }
  }

  editTemplate(cell, row) {
    location.href = `/templates/${cell.id}/edit`
  }

  successfulCallback(result) {
    this.setState({templates_data: result.templates_data})
    alert(result.message)
  }

  rowActions(cell, row){
    return (
      <div>
        <button type="button" className="btn btn-info">Preview</button>
        <button type="button" className="btn btn-info">Download</button>
        <button type="button" className="btn btn-info" onClick={this.editTemplate.bind(cell, row)}>Edit</button>
        <button type="button" className="btn btn-danger delete-template" onClick={this.delete.bind(cell, row)} >Delete</button>
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

    return(
      <BootstrapTable data={this.state.templates_data} hover pagination options={options} striped={true} >
        <TableHeaderColumn dataField="id" dataSort={true} isKey={true} width="50"> ID </TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataSort={true}
          filter={{type: "TextFilter", placeholder: "Please enter a value"}}>
          Name</TableHeaderColumn>
        <TableHeaderColumn filterValue={this.dateFilter} dataField="created_at" dataSort={true}
          filter={{type: "DateFilter"}} width="250">
          Created At</TableHeaderColumn>
        <TableHeaderColumn filterValue={this.dateFilter} dataField="updated_at" dataSort={true}
          filter={{type: "DateFilter"}} width="250">
          Updated At</TableHeaderColumn>
        <TableHeaderColumn columnClassName="list-action" width="320" dataFormat={this.rowActions}>
          Actions</TableHeaderColumn>
      </BootstrapTable>
    )
  }
}