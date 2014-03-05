YUI().use('aui-base', function(Y) {
	var navCollapse = Y.one('.nav-collapse.collapse');

	Y.one('.btn-navbar.collapsed').on(
		'click',
		function(event) {
			navCollapse.toggleClass('expanded');
		}
	);
});