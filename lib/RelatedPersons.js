
// create the object using our BaseModel
RelatedPerson = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
RelatedPerson.prototype._collection = RelatedPersons;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
RelatedPersons = new Mongo.Collection('RelatedPersons');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
RelatedPersons._transform = function (document) {
  return new RelatedPerson(document);
};



RelatedPersonSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "RelatedPerson"
  },
  "identifier" : {
    optional: true,
    type: [ IdentifierSchema ]
  }, // A human identifier for this person
  "patient" : {
    optional: true,
    type: ReferenceSchema
  }, // (Patient) R!  The patient this person is related to
  "relationship" : {
    optional: true,
    type: CodeableConceptSchema
  }, // The nature of the relationship
  "name" : {
    optional: true,
    type: HumanNameSchema
  }, // A name associated with the person
  "telecom" : {
    optional: true,
    type: [ ContactPointSchema ]
  }, // A contact detail for the person
  "gender" : {
    optional: true,
    type: Code
  }, // male | female | other | unknown
  "birthDate" : {
    optional: true,
    type: Date
  }, // The date on which the related person was born
  "address" : {
    optional: true,
    type: [ AddressSchema ]
  }, // Address where the related person can be contacted or visited
  "photo" : {
    optional: true,
    type: [ AttachmentSchema ]
  }, // Image of the person
  "period" : {
    optional: true,
    type: PeriodSchema
  } // Period of time that this relationship is considered valid
});
RelatedPersons.attachSchema(RelatedPersonSchema);
