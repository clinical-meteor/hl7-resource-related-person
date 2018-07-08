import { CardActions, CardText } from 'material-ui/Card';
import { get, has, set } from 'lodash';
// import { insertRelatedPerson, removeRelatedPersonById, updateRelatedPerson } from '/imports/ui/workflows/relatedPersons/methods';
// import { insertRelatedPerson, removeRelatedPersonById, updateRelatedPerson } from 'meteor/clinical:hl7-resource-relatedPerson';
import { insertRelatedPerson, removeRelatedPersonById, updateRelatedPerson } from 'meteor/clinical:hl7-resource-related-person';


import { Bert } from 'meteor/clinical:alert';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import TextField from 'material-ui/TextField';

import { RelatedPersons } from '../../lib/RelatedPersons';
import { Session } from 'meteor/session';


let defaultRelatedPerson = {
  "resourceType" : "RelatedPerson",
  "name" : [{
    "text" : "",
    "resourceType" : "HumanName"
  }],
  "active" : true,
  "gender" : "",
  "birthDate" : '',
  "photo" : [{
    url: ""
  }],
  identifier: [{
    "use": "usual",
    "type": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/v2/0203",
          "code": "MR"
        }
      ]
    },
    "value": ""
  }],
  "test" : false
};


Session.setDefault('relatedPersonUpsert', false);
Session.setDefault('selectedRelatedPerson', false);

export default class RelatedPersonDetail extends React.Component {
  getMeteorData() {
    let data = {
      relatedPersonId: false,
      relatedPerson: defaultRelatedPerson
    };

    if (Session.get('relatedPersonUpsert')) {
      data.relatedPerson = Session.get('relatedPersonUpsert');
    } else {
      if (Session.get('selectedRelatedPerson')) {
        data.relatedPersonId = Session.get('selectedRelatedPerson');
        console.log("selectedRelatedPerson", Session.get('selectedRelatedPerson'));

        let selectedRelatedPerson = RelatedPersons.findOne({_id: Session.get('selectedRelatedPerson')});
        console.log("selectedRelatedPerson", selectedRelatedPerson);

        if (selectedRelatedPerson) {
          data.relatedPerson = selectedRelatedPerson;

          if (typeof selectedRelatedPerson.birthDate === "object") {
            data.relatedPerson.birthDate = moment(selectedRelatedPerson.birthDate).add(1, 'day').format("YYYY-MM-DD");
          }
        }
      } else {
        data.relatedPerson = defaultRelatedPerson;
      }
    }

    if(process.env.NODE_ENV === "test") console.log("RelatedPersonDetail[data]", data);
    return data;
  }

  render() {
    return (
      <div id={this.props.id} className="relatedPersonDetail">
        <CardText>
          <TextField
            id='nameInput'
            ref='name'
            name='name'
            floatingLabelText='name'
            value={ get(this, 'data.relatedPerson.name[0].text', '')}
            onChange={ this.changeState.bind(this, 'name')}
            fullWidth
            /><br/>
          <TextField
            id='genderInput'
            ref='gender'
            name='gender'
            floatingLabelText='gender'
            hintText='male | female | other | indeterminate | unknown'
            value={ get(this, 'data.relatedPerson.gender', '')}
            onChange={ this.changeState.bind(this, 'gender')}
            fullWidth
            /><br/>
          <TextField
            id='birthdateInput'
            ref='birthdate'
            name='birthdate'
            floatingLabelText='birthdate'
            hintText='YYYY-MM-DD'
            value={ get(this, 'data.relatedPerson.birthDate', '')}
            onChange={ this.changeState.bind(this, 'birthDate')}
            fullWidth
            /><br/>
          <TextField
            id='photoInput'
            ref='photo'
            name='photo'
            floatingLabelText='photo'
            value={ get(this, 'data.relatedPerson.photo[0].url', '')}
            onChange={ this.changeState.bind(this, 'photo')}
            floatingLabelFixed={false}
            fullWidth
            /><br/>
          <TextField
            id='mrnInput'
            ref='mrn'
            name='mrn'
            floatingLabelText='medical record number'
            value={ get(this, 'data.relatedPerson.identifier[0].value', '')}
            onChange={ this.changeState.bind(this, 'mrn')}
            fullWidth
            /><br/>
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.relatedPersonId) }
        </CardActions>
      </div>
    );
  }
  determineButtons(relatedPersonId){
    if (relatedPersonId) {
      return (
        <div>
          <RaisedButton id='saveRelatedPersonButton' className='saveRelatedPersonButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveRelatedPersonButton'  className='saveRelatedPersonButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  changeState(field, event, value){
    let relatedPersonUpdate;

    if(process.env.TRACE) console.log("relatedPersonDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new relatedPerson
    if (Session.get('relatedPersonUpsert')) {
      relatedPersonUpdate = Session.get('relatedPersonUpsert');
    } else {
      relatedPersonUpdate = defaultRelatedPerson;
    }



    // if there's an existing relatedPerson, use them
    if (Session.get('selectedRelatedPerson')) {
      relatedPersonUpdate = this.data.relatedPerson;
    }

    switch (field) {
      case "name":
        relatedPersonUpdate.name[0].text = value;
        break;
      case "gender":
        relatedPersonUpdate.gender = value.toLowerCase();
        break;
      case "birthDate":
        relatedPersonUpdate.birthDate = value;
        break;
      case "photo":
        relatedPersonUpdate.photo[0].url = value;
        break;
      case "mrn":
        relatedPersonUpdate.identifier[0].value = value;
        break;
      default:

    }
    // relatedPersonUpdate[field] = value;
    process.env.TRACE && console.log("relatedPersonUpdate", relatedPersonUpdate);

    Session.set('relatedPersonUpsert', relatedPersonUpdate);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let relatedPersonUpdate = Session.get('relatedPersonUpsert', relatedPersonUpdate);


    if (relatedPersonUpdate.birthDate) {
      relatedPersonUpdate.birthDate = new Date(relatedPersonUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("relatedPersonUpdate", relatedPersonUpdate);

    if (Session.get('selectedRelatedPerson')) {
      if(process.env.NODE_ENV === "test") console.log("Updating relatedPerson...");

      delete relatedPersonUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      relatedPersonUpdate.resourceType = 'RelatedPerson';

      RelatedPersons.update({_id: Session.get('selectedRelatedPerson')}, {$set: relatedPersonUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("RelatedPersons.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "RelatedPersons", recordId: Session.get('selectedRelatedPerson')});
          // Session.set('relatedPersonUpdate', defaultRelatedPerson);
          Session.set('relatedPersonUpsert', false);
          Session.set('selectedRelatedPerson', false);
          Session.set('relatedPersonPageTabIndex', 1);
          Bert.alert('RelatedPerson added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new relatedPerson...", relatedPersonUpdate);

      RelatedPersons.insert(relatedPersonUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('RelatedPersons.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "RelatedPersons", recordId: result});
          Session.set('relatedPersonPageTabIndex', 1);
          Session.set('selectedRelatedPerson', false);
          Session.set('relatedPersonUpsert', false);
          Bert.alert('RelatedPerson added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('relatedPersonPageTabIndex', 1);
  }

  handleDeleteButton(){
    RelatedPersons.remove({_id: Session.get('selectedRelatedPerson')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('RelatedPersons.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "RelatedPersons", recordId: Session.get('selectedRelatedPerson')});
        // Session.set('relatedPersonUpdate', defaultRelatedPerson);
        Session.set('relatedPersonUpsert', false);
        Session.set('relatedPersonPageTabIndex', 1);
        Session.set('selectedRelatedPerson', false);
        Bert.alert('RelatedPerson removed!', 'success');
      }
    });
  }
}


ReactMixin(RelatedPersonDetail.prototype, ReactMeteorData);
