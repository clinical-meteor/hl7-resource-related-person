Session.setDefault('relatedPersonReadOnly', true);


Router.map(function () {
  this.route('newRelatedPersonRoute', {
    path: '/insert/relatedPerson',
    template: 'relatedPersonUpsertPage',
    onAfterAction: function () {
      Session.set('relatedPersonReadOnly', false);
    }
  });

});
Router.route('/upsert/relatedPerson/:id', {
  name: 'upsertRelatedPersonRoute',
  template: 'relatedPersonUpsertPage',
  data: function () {
    return RelatedPersons.findOne(this.params.id);
  },
  onAfterAction: function () {
    Session.set('relatedPersonReadOnly', false);
  }
});
Router.route('/view/relatedPerson/:id', {
  name: 'viewRelatedPersonRoute',
  template: 'relatedPersonUpsertPage',
  data: function () {
    return RelatedPersons.findOne(this.params.id);
  },
  onAfterAction: function () {
    Session.set('relatedPersonReadOnly', true);
  }
});


//-------------------------------------------------------------


Template.relatedPersonUpsertPage.rendered = function () {
  Template.appLayout.layout();
};


Template.relatedPersonUpsertPage.helpers({
  getName: function(){
    return this.name[0].text;
  },
  getEmailAddress: function () {
    if (this.telecom && this.telecom[0] && (this.telecom[0].system === "email")) {
      return this.telecom[0].value;
    } else {
      return "";
    }
  },
  isNewRelatedPerson: function () {
    if (this._id) {
      return false;
    } else {
      return true;
    }
  },
  isReadOnly: function () {
    if (Session.get('relatedPersonReadOnly')) {
      return 'readonly';
    }
  },
  getRelatedPersonId: function () {
    if (this._id) {
      return this._id;
    } else {
      return '---';
    }
  }
});

Template.relatedPersonUpsertPage.events({
  'click #removeUserButton': function () {
    RelatedPersons.remove(this._id, function (error, result) {
      if (error) {
        console.log("error", error);
      };
      if (result) {
        Router.go('/list/relatedPersons');
      }
    });
  },
  'click #saveUserButton': function () {
    //console.log( 'this', this );

    Template.relatedPersonUpsertPage.saveRelatedPerson(this);
    Session.set('relatedPersonReadOnly', true);
  },
  'click .barcode': function () {
    // TODO:  refactor to Session.toggle('relatedPersonReadOnly')
    if (Session.equals('relatedPersonReadOnly', true)) {
      Session.set('relatedPersonReadOnly', false);
    } else {
      Session.set('relatedPersonReadOnly', true);
      console.log('Locking the relatedPerson...');
      Template.relatedPersonUpsertPage.saveRelatedPerson(this);
    }
  },
  'click #lockRelatedPersonButton': function () {
    //console.log( 'click #lockRelatedPersonButton' );

    if (Session.equals('relatedPersonReadOnly', true)) {
      Session.set('relatedPersonReadOnly', false);
    } else {
      Session.set('relatedPersonReadOnly', true);
    }
  },
  'click #relatedPersonListButton': function (event, template) {
    Router.go('/list/relatedPersons');
  },
  'click .imageGridButton': function (event, template) {
    Router.go('/grid/relatedPersons');
  },
  'click .tableButton': function (event, template) {
    Router.go('/table/relatedPersons');
  },
  'click #previewRelatedPersonButton': function () {
    Router.go('/customer/' + this._id);
  },
  'click #upsertRelatedPersonButton': function () {
    console.log('creating new RelatedPersons...');
    Template.relatedPersonUpsertPage.saveRelatedPerson(this);
  }
});


Template.relatedPersonUpsertPage.saveRelatedPerson = function (relatedPerson) {
  // TODO:  add validation functions

  if (relatedPerson._id) {
    var relatedPersonOptions = {
      relatedPersonname: $('#relatedPersonnameInput').val(),
      emails: [{
        address: $('#relatedPersonEmailInput').val()
      }],
      profile: {
        fullName: $('#relatedPersonFullNameInput').val(),
        avatar: $('#relatedPersonAvatarInput').val(),
        description: $('#relatedPersonDescriptionInput').val()
      }
    };

    RelatedPersons.update({
      _id: relatedPerson._id
    }, {
      $set: relatedPersonOptions
    }, function (error, result) {
      if (error) console.log(error);
      Router.go('/view/relatedPerson/' + relatedPerson._id);
    });

    if (relatedPerson.emails[0].address !== $('#relatedPersonEmailInput')
      .val()) {
      var options = {
        relatedPersonId: relatedPerson._id,
        email: $('#relatedPersonEmailInput')
          .val()
      };
      Meteor.call('updateEmail', options);
    }


  } else {
    var relatedPersonOptions = {
      relatedPersonname: $('#relatedPersonnameInput').val(),
      email: $('#relatedPersonEmailInput').val(),
      profile: {
        fullName: $('#relatedPersonFullNameInput').val(),
        avatar: $('#relatedPersonAvatarInput').val(),
        description: $('#relatedPersonDescriptionInput').val()
      }
    };
    //console.log( 'relatedPersonOptions', relatedPersonOptions );

    relatedPersonOptions.password = $('#relatedPersonnameInput')
      .val();
    Meteor.call('addUser', relatedPersonOptions, function (error, result) {
      if (error) {
        console.log('error', error);
      }
      if (result) {
        console.log('result', result);
        Router.go('/view/relatedPerson/' + result);
      }
    });

  }
};
