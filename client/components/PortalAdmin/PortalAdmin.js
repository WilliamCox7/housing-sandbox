import React, { Component } from 'react';
import { connect } from 'react-redux';
import FaqItem from './FaqItem/FaqItem';
import TourPhoto from './TourPhoto/TourPhoto';
import { addFAQ, addPhoto } from '../../reducers/portalReducer';
import axios from 'axios';
import './PortalAdmin.scss';

/* manages tour photos and faq's */
class PortalAdmin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      q: '',
      a: '',
      curImg: undefined,
      imgName: ''
    }
    this.addPhoto = this.addPhoto.bind(this);
    this.addFAQ = this.addFAQ.bind(this);
    this.updateQ = this.updateQ.bind(this);
    this.updateA = this.updateA.bind(this);
    this.openLocal = this.openLocal.bind(this);
    this.storeFile = this.storeFile.bind(this);
  }

  /* adds a photo to the tour */
  addPhoto() {
    var imageExtension = this.state.curImg.split(';')[0].split('/')
    imageExtension = imageExtension[imageExtension.length - 1];
    // axios.post('/portal/insertS3', {
    //   insert: {
    //     imageName: this.state.imgName,
    //     imageBody: this.state.curImg,
    //     imageExtension: imageExtension,
    //   },
    //   campus: this.props.campus.city
    // }).then((result) => {
    //   this.props.addPhoto(result.data.ops[0]);
    //   this.setState({curImg: undefined, imgName: ''});
    // });
  }

  /* adds a faq to the list of faqs */
  addFAQ() {
    axios.post('/portal/insert', {
      collection: 'faq',
      insert: {
        q: this.state.q,
        a: this.state.a,
        campus: this.props.campus.city
      }
    }).then((result) => {
      this.props.addFAQ(result.data.ops[0]);
      this.setState({q: '', a: ''});
    });
  }

  /* stores the user input for a new question */
  updateQ(e) {
    this.setState({q: e.target.value});
  }

  /* stores the user input for a new answer */
  updateA(e) {
    this.setState({a: e.target.value});
  }

  /* opens the file system local to the users computer */
  openLocal() {
    document.getElementById('inputButton').click();
  }

  /* saves file upload information to state */
  storeFile(e) {
    var imgName = e.currentTarget.files[0].name;
    var reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        curImg: reader.result,
        imgName: imgName
      });
    }
    reader.readAsDataURL(e.currentTarget.files[0]);
  }

  render() {

    /* filters out photos not applicable to the selected campus */
    var filteredPhotos = this.props.portal.tour.filter((photo) => {
      if (photo.campus === this.props.campus.city) { return true; }
    });

    /* gets the tour photos */
    var photos = filteredPhotos.map((photo, i) => {
      return <TourPhoto key={i} photo={photo} />;
    });

    /* filters out faqs not applicable to the selected campus */
    var filteredFAQ = this.props.portal.faq.filter((faq) => {
      if (faq.campus === this.props.campus.city) { return true; }
    });

    /* gets the faqs */
    var faq = filteredFAQ.map((item, i) => {
      return <FaqItem item={item} key={i} />;
    });

    return (
      <div className="PortalAdmin">
        <h1>Tour Photos <span>(connected to S3 on live site. ability to upload photos disabled in sandbox)</span></h1>
        <div className="tour-photos">
          {photos}
          <div className="tour-photo">
            {this.state.curImg ? (
              <img src={this.state.curImg} />
            ) : (
              <div className="upload-photo">
                <input id="inputButton" type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={this.storeFile} />
                <h2 onClick={this.openLocal}>
                  <i className="fa fa-upload" aria-hidden="true"></i>
                </h2>
              </div>
            )}
            {this.state.curImg ? (
              <i onClick={this.addPhoto} className="fa fa-plus canhover"
                aria-hidden="true"></i>
            ) : (
              <i className="fa fa-plus" aria-hidden="true"></i>
            )}
          </div>
        </div>
        <h1>FAQ</h1>
        <div className="add-faq">
          <textarea onChange={this.updateQ} value={this.state.q}
            type="text" placeholder="question..." />
          <textarea onChange={this.updateA} value={this.state.a}
            type="text" placeholder="answer..." />
          <i onClick={this.addFAQ} className="fa fa-plus canhover"
            aria-hidden="true"></i>
        </div>
        <div className="faq-items">
          {faq}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    portal: state.portal,
    campus: state.campus
  }
};

const mapDispatchToProps = {
  addFAQ: addFAQ,
  addPhoto: addPhoto
}

export default connect(mapStateToProps, mapDispatchToProps)(PortalAdmin);
