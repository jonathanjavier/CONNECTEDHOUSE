'use strict';

describe('Directive: users', function () {

  // load the directive's module and view
  beforeEach(module('connectedHouseApp'));
  beforeEach(module('app/users/users.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<users></users>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the users directive');
  }));
});