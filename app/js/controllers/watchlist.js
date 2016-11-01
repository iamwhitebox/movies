function WatchlistController() {
	const vm = this;

	vm.title = 'Watchlist';

	vm.filtered = null;
	vm.sorted = 'title';
	vm.movies = [];
	vm.removeFromWatchlist = function() {
		// remove movie from watchlist
	};
}

export default {
	name: 'WatchlistController',
	fn: WatchlistController
};
