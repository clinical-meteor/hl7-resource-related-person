describe('clinical:hl7-resources-related-persons', function () {
  var server = meteor();
  var client = browser(server);

  it('RelatedPersons should exist on the client', function () {
    return client.execute(function () {
      expect(RelatedPersons).to.exist;
    });
  });

  it('RelatedPersons should exist on the server', function () {
    return server.execute(function () {
      expect(RelatedPersons).to.exist;
    });
  });

});
