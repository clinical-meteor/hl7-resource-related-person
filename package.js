Package.describe({
  name: 'clinical:hl7-resource-related-person',
  version: '1.1.0',
  summary: 'HL7 FHIR Resource - RelatedPerson',
  git: 'https://github.com/clinical-meteor/hl7-resource-related-person',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('mongo');

  api.use('grove:less@0.1.1');

  api.use('aldeed:simple-schema@1.3.3');
  api.use('aldeed:collection2@2.3.3');
  api.use('simple:json-routes@2.1.0');
  api.use('prime8consulting:meteor-oauth2-server@0.0.2');

  api.addFiles('lib/hl7-resource-related-person.js', ['client', 'server']);
  api.addFiles('server/rest.js', 'server');
  api.addFiles('server/initialize.js', 'server');

    api.use('clinical:router@2.0.17');
    api.use('clinical:base-model@1.3.5');
    api.use('clinical:hl7-resource-datatypes@0.4.0');

    api.addFiles('client/components/relatedPersonUpsertPage/relatedPersonUpsertPage.html', ['client']);
    api.addFiles('client/components/relatedPersonUpsertPage/relatedPersonUpsertPage.js', ['client']);
    api.addFiles('client/components/relatedPersonUpsertPage/relatedPersonUpsertPage.less', ['client']);

    api.addFiles('client/components/relatedPersonsTablePage/relatedPersonsTablePage.html', ['client']);
    api.addFiles('client/components/relatedPersonsTablePage/relatedPersonsTablePage.js', ['client']);
    api.addFiles('client/components/relatedPersonsTablePage/relatedPersonsTablePage.less', ['client']);
    api.addFiles('client/components/relatedPersonsTablePage/jquery.tablesorter.js', ['client']);

    api.addFiles('client/components/relatedPersonPreviewPage/relatedPersonPreviewPage.html', ['client']);
    api.addFiles('client/components/relatedPersonPreviewPage/relatedPersonPreviewPage.js', ['client']);
    api.addFiles('client/components/relatedPersonPreviewPage/relatedPersonPreviewPage.less', ['client']);

    api.addFiles('client/components/relatedPersonsListPage/relatedPersonsListPage.html', ['client']);
    api.addFiles('client/components/relatedPersonsListPage/relatedPersonsListPage.js', ['client']);
    api.addFiles('client/components/relatedPersonsListPage/relatedPersonsListPage.less', ['client']);

  api.export('RelatedPersons');
  api.export('RelatedPersonSchema');
});
