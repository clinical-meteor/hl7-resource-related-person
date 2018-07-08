

Meteor.methods({
  createRelatedPerson:function(relatedPersonObject){
    check(relatedPersonObject, Object);

    if (process.env.NODE_ENV === 'test') {
      console.log('-----------------------------------------');
      console.log('Creating RelatedPerson...');
      RelatedPersons.insert(relatedPersonObject, function(error, result){
        if (error) {
          console.log(error);
          if (typeof HipaaLogger === 'object') {
            HipaaLogger.logEvent({
              eventType: "error",
              userId: Meteor.userId(),
              userName: Meteor.user().fullName(),
              collectionName: "RelatedPersons"
            });
          }
        }
        if (result) {
          console.log('RelatedPerson created: ' + result);
          if (typeof HipaaLogger === 'object') {
            HipaaLogger.logEvent({
              eventType: "create",
              userId: Meteor.userId(),
              userName: Meteor.user().fullName(),
              collectionName: "RelatedPersons"
            });
          }
        }
      });
    } else {
      console.log('This command can only be run in a test environment.');
      console.log('Try setting NODE_ENV=test');
    }
  },
  initializeRelatedPerson:function(){
    if (RelatedPersons.find().count() === 0) {
      console.log('-----------------------------------------');
      console.log('No records found in RelatedPersons collection.  Lets create some...');

      var defaultRelatedPerson = {
        'name' : [
          {
            'text' : 'Jane Doe',
            'resourceType' : 'HumanName'
          }
        ],
        'active' : true,
        'gender' : 'female',
        'identifier' : [
          {
            'use' : 'usual',
            'type' : {
              text: 'Medical record number',
              'coding' : [
                {
                  'system' : 'http://hl7.org/fhir/v2/0203',
                  'code' : 'MR'
                }
              ]
            },
            'system' : 'urn:oid:1.2.36.146.595.217.0.1',
            'value' : '123',
            'period' : {}
          }
        ],
        'birthdate' : new Date(1970, 1, 25),
        'resourceType' : 'RelatedPerson'
      };

      Meteor.call('createRelatedPerson', defaultRelatedPerson);
    } else {
      console.log('RelatedPersons already exist.  Skipping.');
    }
  },
  dropRelatedPersons: function(query){
    console.log('-----------------------------------------');
    console.log('Dropping relatedPersons... ');

    check(query, Match.Maybe(Object));

    RelatedPersons.remove({});
  }
});
