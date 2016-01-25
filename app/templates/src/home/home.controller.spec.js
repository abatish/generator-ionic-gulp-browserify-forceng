describe('home.controller', function(){
  var vm;

  beforeEach(function () {
    angular.mock.module('<%= ngModulName %>');

    angular.mock.inject(function($controller) {
      vm = $controller('HomeController');
    });
  });

  it('should define the user ID', function() {
    expect(vm.userId).toBeNull();
  });

});
