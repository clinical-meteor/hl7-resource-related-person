
RelatedPersons = new Meteor.Collection('relatedPersons');

if (Meteor.isClient){
  Meteor.subscribe('relatedPersons');
}



RelatedPersonSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "RelatedPerson"
    }
});
RelatedPersons.attachSchema(RelatedPersonSchema);
