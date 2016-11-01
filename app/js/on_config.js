function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider) {
  'ngInject';

  if (process.env.NODE_ENV === 'production') {
    $compileProvider.debugInfoEnabled(false);
  }

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $stateProvider
    .state('Home', {
      url: '/',
      controller: 'HomeController as home',
      templateUrl: 'home.html',
      title: 'Home'
    })
    .state('Watchlist', {
      url: '/watchlist',
      controller: 'WatchlistController as watchlist',
      templateUrl: 'watchlist.html',
      title: 'Watchlist'
    })
    .state('Detail', {
      url: '/movie/:id',
      controller: 'MovieController as movie',
      templateUrl: 'movie.html',
      title: 'Movie'
    });

  $urlRouterProvider.otherwise('/');

}

export default OnConfig;
