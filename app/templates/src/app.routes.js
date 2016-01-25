module.exports = ['$httpProvider', '$stateProvider', '$urlRouterProvider',
    function( $httpProvider, $stateProvider, $urlRouterProvider ) {
    // register $http interceptors, if any. e.g.
    // $httpProvider.interceptors.push('interceptor-name');

    // Application routing
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: '/main/main.html',
        controller: 'MainController as vm'
      })
      .state('app.home', {
        url: '/home',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: '/home/home.html',
            controller: 'HomeController as vm'
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: '/settings/settings.html',
            controller: 'SettingsController as vm'
          }
        }
      });


    // redirects to default route for undefined routes
    $urlRouterProvider.otherwise('/app/home');
  }
];
