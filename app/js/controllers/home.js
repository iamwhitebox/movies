function HomeController($http) {
	'ngInject';

	// ViewModel
	const vm = this;

	vm.title = 'Disney Movies';
	vm.number = 1234;

	vm.addToWatchlist = function() {
		// add to watchlist
	};
	vm.filtered = null;
	vm.sorted = 'title';

	$http.get('localhost:3000/movies').success((data) => {
		console.log(data);
		vm.movies = data;
	}).error((err, status) => {
		console.log(err, status);
	});
}

export default {
	name: 'HomeController',
	fn: HomeController
};
