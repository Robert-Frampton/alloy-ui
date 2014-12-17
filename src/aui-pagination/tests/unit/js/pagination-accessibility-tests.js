YUI.add('aui-pagination-accessibility-tests', function(Y) {

    //--------------------------------------------------------------------------
    // PaginationAccessibility Tests
    //--------------------------------------------------------------------------

    var suite = new Y.Test.Suite('aui-pagination-accessibility');

    var pagination = new Y.Pagination({
        boundingBox: '#pagination',
        circular: false,
        page: 1,
        showControls: true,
        total: 10
    }).render();

    var KEY_NEXT = 39,
        KEY_PREV = 37,
        KEY_SELECT = 13;

    suite.add(new Y.Test.Case({

        name: 'Pagination keyboard navigation tests',

        'Assert pages can be navigated with keys': function() {
            var boundingBox = pagination.get('boundingBox'),
                page = pagination.get('page');

            // focus current page
            boundingBox.focus();
            boundingBox.simulate('keydown', {keyCode: KEY_NEXT});

            this._assertNItemsCanBeSelectedWithKeys(KEY_NEXT);
            this._assertNItemsCanBeSelectedWithKeys(KEY_PREV);
        },

        _assertNItemsCanBeSelectedWithKeys: function(key) {
            var page = pagination.get('page'),
                item = pagination.getItem(page).one('a'),
                newPage = key === KEY_NEXT ? page + 1 : page - 1,
                newItem = pagination.getItem(newPage).one('a');

            item.simulate('keydown', {keyCode: key});

            Y.Test.Assert.isTrue(newItem.hasClass('focus'));
            Y.Test.Assert.isFalse(item.hasClass('focus'));

            newItem = Y.one('.focus').ancestor('li');
            newItem.simulate('keypress', {charCode: KEY_SELECT});

            Y.Test.Assert.isTrue(pagination.get('page') === newPage);
        }
    }));

    suite.add(new Y.Test.Case({

        name: 'Pagination ARIA attributes tests',

        'Assert controls have correct ARIA attributes': function() {
            if (pagination.get('showControls')) {
                var controls = Y.all('.pagination-control a'),
                    disabled = Y.one('.disabled a');

                Y.Assert.isTrue(controls.item(0).hasAttribute('role'));
                Y.Assert.isTrue(controls.item(0).hasAttribute('aria-label'));
                Y.Assert.isTrue(controls.item(0).hasAttribute('aria-disabled'));
                Y.Assert.isTrue(controls.item(1).hasAttribute('role'));
                Y.Assert.isTrue(controls.item(1).hasAttribute('aria-label'));
                Y.Assert.isTrue(controls.item(1).hasAttribute('aria-disabled'));

                Y.Assert.isTrue(disabled.getAttribute('aria-disabled') === 'true');
            }
        },

        'Assert page items have correct ARIA attributes': function() {
            var items = pagination.get('boundingBox').all('li:not(.pagination-control) a');

            items.each(function(item) {
                if (item.hasClass('focus')) {
                    Y.Assert.isTrue(item.getAttribute('aria-selected') === 'true');
                }
                else {
                    Y.Assert.isTrue(item.getAttribute('aria-selected') === 'false');
                }
            });
        },

        'Assert pagination has correct ARIA attributes': function() {
            var boundingBox = pagination.get('boundingBox');

            Y.Assert.isTrue(boundingBox.hasAttribute('role'));
            Y.Assert.isTrue(boundingBox.hasAttribute('aria-label'));
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-pagination', 'node-event-simulate']
});