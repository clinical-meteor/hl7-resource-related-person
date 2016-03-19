
RelatedPersons = new Meteor.Collection('RelatedPersons');

if (Meteor.isClient){
  Meteor.subscribe('RelatedPersons');
}



RelatedPersonSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "RelatedPerson"
    }
});
RelatedPersons.attachSchema(RelatedPersonSchema);
