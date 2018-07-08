import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { Session } from 'meteor/session';
import { has, get } from 'lodash';
import { TableNoData } from 'meteor/clinical:glass-ui'


flattenRelatedPerson = function(relatedPerson){
  let result = {
    _id: relatedPerson._id,
    id: relatedPerson.id,
    active: true,
    gender: relatedPerson.gender,
    name: '',
    mrn: '',
    birthDate: '',
    photo: "/thumbnail-blank.png",
    initials: 'abc'
  };

  // // there's an off-by-1 error between momment() and Date() that we want
  // // to account for when converting back to a string
  // result.birthDate = moment(relatedPerson.birthDate).add(1, 'days').format("YYYY-MM-DD")
  // result.photo = get(relatedPerson, 'photo[0].url', '');
  // result.mrn = get(relatedPerson, 'identifier[0].value', '');

  if(has(relatedPerson, 'name.text')){
    result.name = get(relatedPerson, 'name.text');    
  } else {
    result.name = get(relatedPerson, 'name.given[0]') + ' ' + get(relatedPerson, 'name.family[0]');
  }

  return result;
}

export class RelatedPersonTable extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    let data = {
      style: {
        hideOnPhone: {
          visibility: 'visible',
          display: 'table'
        },
        cellHideOnPhone: {
          visibility: 'visible',
          display: 'table',
          paddingTop: '16px',
          maxWidth: '120px'
        },
        cell: {
          paddingTop: '16px'
        },
        avatar: {
          // color: rgb(255, 255, 255);
          backgroundColor: 'rgb(188, 188, 188)',
          userSelect: 'none',
          borderRadius: '2px',
          height: '40px',
          width: '40px'
        }
      },
      selected: [],
      relatedPersons: []
    };

    let query = {};
    let options = {};

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }
    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    if(this.props.data){
      // console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(relatedPerson){
          data.relatedPersons.push(flattenRelatedPerson(relatedPerson));
        });  
      }
    } else {
      data.relatedPersons = RelatedPersons.find().map(function(relatedPerson){
        return flattenRelatedPerson(relatedPerson);
      });
    }


    if (Session.get('appWidth') < 768) {
      data.style.hideOnPhone.visibility = 'hidden';
      data.style.hideOnPhone.display = 'none';
      data.style.cellHideOnPhone.visibility = 'hidden';
      data.style.cellHideOnPhone.display = 'none';
    } else {
      data.style.hideOnPhone.visibility = 'visible';
      data.style.hideOnPhone.display = 'table-cell';
      data.style.cellHideOnPhone.visibility = 'visible';
      data.style.cellHideOnPhone.display = 'table-cell';
    }

    // console.log("RelatedPersonTable[data]", data);
    return data;
  }
  imgError(avatarId) {
    this.refs[avatarId].src = Meteor.absoluteUrl() + 'noAvatar.png';
  }
  rowClick(id){
    Session.set('relatedPersonsUpsert', false);
    Session.set('selectedRelatedPerson', id);
    Session.set('relatedPersonPageTabIndex', 2);
  }
  renderRowAvatarHeader(){
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <th className='avatar'>photo</th>
      );
    }
  }
  renderRowAvatar(relatedPerson, avatarStyle){
    console.log('renderRowAvatar', relatedPerson, avatarStyle)
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <td className='avatar'>
          <img src={relatedPerson.photo} ref={relatedPerson._id} onError={ this.imgError.bind(this, relatedPerson._id) } style={avatarStyle}/>
        </td>
      );
    }
  }
  renderSendButtonHeader(){
    if (this.props.showSendButton === true) {
      return (
        <th className='sendButton' style={this.data.style.hideOnPhone}></th>
      );
    }
  }
  renderSendButton(relatedPerson, avatarStyle){
    if (this.props.showSendButton === true) {
      return (
        <td className='sendButton' style={this.data.style.hideOnPhone}>
          <FlatButton label="send" onClick={this.onSend.bind('this', this.data.relatedPersons[i]._id)}/>
        </td>
      );
    }
  }
  onSend(id){
    let relatedPerson = RelatedPersons.findOne({_id: id});

    console.log("RelatedPersonTable.onSend()", relatedPerson);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/RelatedPerson', {
      data: relatedPerson
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  selectRelatedPersonRow(relatedPersonId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(relatedPersonId);
    }
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.relatedPersons.length === 0){
      footer = <TableNoData noDataPadding={ this.props.noDataPadding } />
    } else {
      for (var i = 0; i < this.data.relatedPersons.length; i++) {
        tableRows.push(
          <tr key={i} className="relatedPersonRow" style={{cursor: "pointer"}} onClick={this.selectRelatedPersonRow.bind(this, this.data.relatedPersons[i].id )} >
  
            { this.renderRowAvatar(this.data.relatedPersons[i], this.data.style.avatar) }
  
            <td className='name' onClick={ this.rowClick.bind('this', this.data.relatedPersons[i]._id)} style={this.data.style.cell}>{this.data.relatedPersons[i].name }</td>
            <td className='gender' onClick={ this.rowClick.bind('this', this.data.relatedPersons[i]._id)} style={this.data.style.cell}>{this.data.relatedPersons[i].gender}</td>
            <td className='birthDate' onClick={ this.rowClick.bind('this', this.data.relatedPersons[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.relatedPersons[i].birthDate }</td>
            <td className='isActive' onClick={ this.rowClick.bind('this', this.data.relatedPersons[i]._id)} style={this.data.style.cellHideOnPhone}>{this.data.relatedPersons[i].active}</td>
            <td className='mrn' style={this.data.style.cellHideOnPhone}>{this.data.relatedPersons[i].mrn}</td>
            <td className='id' onClick={ this.rowClick.bind('this', this.data.relatedPersons[i].id)} style={this.data.style.cellHideOnPhone}><span className="barcode">{this.data.relatedPersons[i].id}</span></td>            

              { this.renderSendButton(this.data.relatedPersons[i], this.data.style.avatar) }
          </tr>
        );
      }
    }
    


    return(
      <div>
        <Table id='relatedPersonsTable' hover >
          <thead>
            <tr>
              { this.renderRowAvatarHeader() }

              <th className='name'>name</th>
              <th className='gender'>gender</th>
              <th className='birthdate' style={{minWidth: '100px'}}>birthdate</th>
              <th className='isActive' style={this.data.style.hideOnPhone}>active</th>
              <th className='mrn' style={this.data.style.hideOnPhone}>mrn</th>
              <th className='id' style={this.data.style.hideOnPhone}>_id</th>
              
              { this.renderSendButtonHeader() }
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </Table>
        { footer }
      </div>
    );
  }
}


ReactMixin(RelatedPersonTable.prototype, ReactMeteorData);
export default RelatedPersonTable;