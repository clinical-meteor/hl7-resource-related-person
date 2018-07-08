import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';
import { GlassCard, VerticalCanvas } from 'meteor/clinical:glass-ui';

import Glass from './Glass';
//import GlassCard from './GlassCard';
import RelatedPersonDetail from './RelatedPersonDetail';
import RelatedPersonTable from './RelatedPersonTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
//import { VerticalCanvas } from './VerticalCanvas';

// import { RelatedPersons } from '../lib/RelatedPersons';
import { Session } from 'meteor/session';

let defaultRelatedPerson = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('relatedPersonFormData', defaultRelatedPerson);
Session.setDefault('relatedPersonSearchFilter', '');

export class RelatedPersonsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('relatedPersonPageTabIndex'),
      relatedPerson: defaultRelatedPerson,
      relatedPersonSearchFilter: '',
      currentRelatedPerson: null
    };

    if (Session.get('relatedPersonFormData')) {
      data.relatedPerson = Session.get('relatedPersonFormData');
    }
    if (Session.get('relatedPersonSearchFilter')) {
      data.relatedPersonSearchFilter = Session.get('relatedPersonSearchFilter');
    }
    if (Session.get("selectedRelatedPerson")) {
      data.currentRelatedPerson = Session.get("selectedRelatedPerson");
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("RelatedPersonsPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('relatedPersonPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedRelatedPerson', false);
    Session.set('relatedPersonUpsert', false);
  }

  render() {
    console.log('React.version: ' + React.version);
    return (
      <div id="relatedPersonsPage">
        <VerticalCanvas>
          <GlassCard height="auto">
            <CardTitle
              title="RelatedPersons"
            />
            <CardText>
              <Tabs id='relatedPersonsPageTabs' default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                 <Tab className="newRelatedPersonTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                   <RelatedPersonDetail id='newRelatedPerson' />
                 </Tab>
                 <Tab className="relatedPersonListTab" label='RelatedPersons' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                   <RelatedPersonTable showBarcodes={true} showAvatars={true} />
                 </Tab>
                 <Tab className="relatedPersonDetailTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                   <RelatedPersonDetail id='relatedPersonDetails' currentRelatedPerson={this.data.currentRelatedPerson} />
                 </Tab>
             </Tabs>


            </CardText>
          </GlassCard>
        </VerticalCanvas>
      </div>
    );
  }
}



ReactMixin(RelatedPersonsPage.prototype, ReactMeteorData);

export default RelatedPersonsPage;