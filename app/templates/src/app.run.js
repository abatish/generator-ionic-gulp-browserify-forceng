module.exports = [ '$ionicPlatform', '$location', 'force',
  function( $ionicPlatform, $location, force ) {

    $ionicPlatform.ready(function() {
      // safe to use plugins here
    });

    force.init({
      appId: '<%= sfAppId %>',
      apiVersion: '<%= sfApiVersion %>',
      loginURL: '<%= sfLoginUrl %>'  ,
      oauthCallbackURL: $location.protocol() + '://'+ $location.host() + ($location.port() ? ':' + $location.port() : ''),
      proxyURL: $location.protocol() + '://'+ $location.host()
    });

  }
];
