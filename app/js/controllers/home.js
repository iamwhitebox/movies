import watchlist from '../services/watchlist';

function HomeController($http) {
	'ngInject';

	// ViewModel
	const vm = this;

	vm.title = 'Disney Movies';
	vm.number = 1234;

	vm.addToWatchlist = function(movie) {
		// add to watchlist
	};
	vm.filtered = null;
	vm.sorted = 'title';

	$http.get('https://raw.githubusercontent.com/iamwhitebox/movies/master/movies.json').success((data) => {
		vm.movies = data;
	}).error((err, status) => {
		consoe.log(err);
	});
}

export default {
	name: 'HomeController',
	fn: HomeController
};
