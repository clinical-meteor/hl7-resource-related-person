Session.setDefault( 'relatedPersonSearchFilter', '' );
Session.setDefault( 'tableLimit', 20 );
Session.setDefault( 'paginationCount', 1 );
Session.setDefault( 'selectedPagination', 0 );
Session.setDefault( 'skipCount', 0 );



//------------------------------------------------------------------------------
// ROUTING

Router.route( '/list/relatedPersons/', {
  name: 'relatedPersonsListPage',
  template: 'relatedPersonsListPage',
  data: function () {
    return RelatedPersons.find();
  }
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.relatedPersonsListPage.events( {
  'click .addRecordIcon': function () {
    Router.go( '/insert/relatedPerson' );
  },
  'click .relatedPersonItem': function () {
    Router.go( '/view/relatedPerson/' + this._id );
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #relatedPersonSearchInput': function () {
    Session.set( 'relatedPersonSearchFilter', $( '#relatedPersonSearchInput' ).val() );
  }
} );


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.relatedPersonsListPage.rendered = function () {
  console.log( 'trying to update layout...' );

  Template.appLayout.delayedLayout( 20 );
};


Template.relatedPersonsListPage.helpers( {
  hasNoContent: function () {
    if ( RelatedPersons.find()
      .count() === 0 ) {
      return true;
    } else {
      return false;
    }
  },
  relatedPersonsList: function () {
    Session.set( 'receivedData', new Date() );

    Template.appLayout.delayedLayout( 20 );

    return RelatedPersons.find( {
      'profile.fullName': {
        $regex: Session.get( 'relatedPersonSearchFilter' ),
        $options: 'i'
      }
    } );
  }
} );
