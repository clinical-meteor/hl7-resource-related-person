
Router.map(function(){
  this.route('relatedPersonPreviewPage', {
    path: '/relatedPerson/:id',
    template: 'relatedPersonPreviewPage',
    data: function () {
      return RelatedPersons.findOne({_id: this.params.id});
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


Template.relatedPersonPreviewPage.rendered = function(){
  Template.appLayout.layout();
};



Template.relatedPersonPreviewPage.events({
  "click .listButton": function(event, template){
    Router.go('/list/relatedPersons');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/relatedPersons');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/relatedPersons');
  },
  "click .indexButton": function(event, template){
    Router.go('/list/relatedPersons');
  },
  "click .relatedPersonId": function(){
    Router.go('/upsert/relatedPerson/' + this._id);
  }
});
