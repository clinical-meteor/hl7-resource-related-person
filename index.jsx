

import RelatedPersonsPage from './client/react/RelatedPersonsPage';
import RelatedPersonTable from './client/react/RelatedPersonTable';
import RelatedPersonDetail from './client/react/RelatedPersonDetail';

import { RelatedPerson, RelatedPersons, RelatedPersonSchema } from './lib/RelatedPersons';

var DynamicRoutes = [{
  'name': 'RelatedPersonPage',
  'path': '/related-persons',
  'component': RelatedPersonsPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Related Persons',
  'to': '/related-persons',
  'href': '/related-persons'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  RelatedPersonsPage,
  RelatedPersonTable,
  RelatedPersonDetail,
  RelatedPersonCard
};


