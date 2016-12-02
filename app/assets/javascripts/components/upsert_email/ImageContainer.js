import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import * as Service from '../shared/service';

export default class ImageContainer extends Component {
  constructor(props) {
    super(props)
  }

  onDrop(acceptedFiles) {
    acceptedFiles.forEach((file, key) => {
      this.getBase64(file)
    }, this)
  }

  getBase64 = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var _this = this
    reader.onload = function () {
      var image = new Image()
      image.src = URL.createObjectURL(file);
      image.onload = function() {
        if(this.width < 600) {
          alert('Width of your images must more than 600 pixels.')
        } else {
          let images_data = {asset: reader.result, asset_file_name: file.name, width: this.width}
          _this.props.setImagesState(images_data, _this.props.active_image_index)
        }
      };
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  handleImageClick(index) {
    this.props.setActiveImageIndex(index)
    ReactDOM.findDOMNode(this.refs.image_drop_zone).click()
  }

  renderUploadResult() {
    var total_index = this.props.images.length - 1
    return this.props.images.map((image, index) => {
      return(
        <div className="image-preview" key={index}>
          <div className="image-container">
            <a href="javascript:void(0)" onClick={this.handleImageClick.bind(this, index)}>
              <img ref="abc" className="image-thum" src={image.asset} />
            </a>
          </div>
          <div className="image-info">
            <p><b>Image Name : </b>{image.asset_file_name}</p>
            <div className="row">
              <p className="col-sm-2"><b>Sort : </b> {index + 1}</p>
              <p className="col-sm-10"><b>Width : </b> {image.width}px</p>
            </div>
            <div className="form-group row">
              <label className="control-label col-sm-1">Link:</label>
              <div className="col-sm-11">
                <input type="text" className={"form-control"} id="inputName" placeholder="Image Link"
                  onChange={this.props.setImageInfo.bind(this, 'link', index)}></input>
              </div>
            </div>
            <div className="form-group row">
              <label className="control-label col-sm-1">Alt:</label>
              <div className="col-sm-11">
                <input type="text" className={"form-control"} id="inputName" placeholder="Image Alt"
                  onChange={this.props.setImageInfo.bind(this, 'alt', index)}></input>
              </div>
            </div>
            <div className="image-action">
              <button type="button" className="btn btn-info" onClick={this.props.swapImage.bind(this, index, 'up')} 
                disabled={index == 0} >Up</button>
              <button type="button" className="btn btn-info" onClick={this.props.swapImage.bind(this, index, 'down')}
                disabled={index == total_index} >Down</button>
              <button type="button" className="btn btn-danger delete-email" 
                onClick={this.props.removeImage.bind(this, index)}>Delete</button>
            </div>
          </div>
        </div>
      )
    })
  }

  dropRejected = (file) => {
    this.props.setActiveImageIndex('')
    alert('Size of your image must less than 100Kb.')
  }

  render() {
    if (this.props.is_multiple) {
      var prompt1 = 'Dropping some images here, or click to select images to upload.'
    } else {
      var prompt1 = 'Dropping one image here, or click to select one image to upload.'
    }
    return(
      <div>
        <div className={`email-drop-zone ${this.props.image_drop_zone_class}`}>
          <Dropzone ref='image_drop_zone' onDrop={this.onDrop.bind(this)} multiple disablePreview accept="image/*" maxSize={102400}
            multiple={this.props.is_multiple} onDropRejected={this.dropRejected} >
            <p className="prompt">{ prompt1 }</p>
            <p className="prompt">Only accept file smaller than 100Kb.</p>
          </Dropzone>
        </div>
        {this.renderUploadResult()}
      </div>
    )
  }
}