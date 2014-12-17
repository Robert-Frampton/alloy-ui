/**
 * The Pagination Accessibility Plugin.
 *
 * @module aui-pagination-accessibility
 */

var Lang = A.Lang,
    
    KEY_ARROW_LEFT = 37,
    KEY_ARROW_RIGHT = 39,
    LABEL_NEXT = 'Go to next page.',
    LABEL_PREV = 'Go to previous page.',

    PaginationAccessibility = function() {
        PaginationAccessibility.superclass.constructor.apply(this, arguments);
    };

PaginationAccessibility.ATTRS = {

    /**
    * `aria-label` for the Pagination.
    *
    * @attribute ariaLabel
    * @type String
    */
    ariaLabel: {
        validator: Lang.isString,
        value: 'Navigate pages with arrow keys. Select a page with enter key.'
    },

    /**
     * Define the keyboard configuration object for
     * `Plugin.NodeFocusManager`.
     *
     * @attribute focusmanager
     * @default {
     *     descendants: 'li > a',
     *     keys: {
     *         next: 'down:39',
     *         previous: 'down:37'
     *     }
     * }
     * @type {Object}
     */
    focusmanager: {
        value: {
            descendants: 'li > a',
            focusClass: 'focus',
            keys: {
                next: 'down:' + KEY_ARROW_RIGHT,
                previous: 'down:' + KEY_ARROW_LEFT
            }
        },
        writeOnce: 'initOnly'
    }
};

A.extend(PaginationAccessibility, A.Plugin.Base, {

    /**
     * Construction logic executed during instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function(config) {
        this._bindFocusManager();
        this._setAriaElements();
    },

    /**
     * Add aria-label to pagination controls.
     *
     * @method _addControlLabel
     * @protected
     */
    _addControlLabel: function() {
        var instance = this,
            host = instance.get('host');

        if (host.get('showControls')) {
            var items = host.get('items').all('a');

            instance.aria.setAttribute('label', LABEL_NEXT, items.last());
            instance.aria.setAttribute('label', LABEL_PREV, items.first());
        }

        instance._updateControls();
    },

    /**
     * Set the descendant anchor elements to unfocusable after the pagination
     * has lost focus.
     *
     * @method _afterFocusedChange
     * @param {EventFacade} event
     * @protected
     */
    _afterFocusedChange: function(event) {
        if (!event.newVal) {
            var instance = this,
                host = instance.get('host');
                boundingBox = host.get('boundingBox');

            boundingBox.focusManager.set('activeDescendant', -1);
        }
    },

    /**
     * Update ARIA attributes after pageChange.
     *
     * @method _afterPageChange
     * @param {EventFacade} event
     * @protected
     */
    _afterPageChange: function(event) {
        if (event.prevVal !== event.newVal) {
            var instance = this,
                host = instance.get('host'),
                prevItem = host.getItem(event.prevVal).one('a'),
                newItem = host.getItem(event.newVal).one('a');

            instance.aria.setAttribute('selected', true, newItem);

            if (prevItem) {
                instance.aria.setAttribute('selected', false, prevItem);
            }

            instance._updateControls();
        }
    },

    /**
     * Bind the `Plugin.NodeFocusManager` that handles keyboard
     * navigation.
     *
     * @method _bindFocusManager
     * @protected
     */
    _bindFocusManager: function() {
        var instance = this,
            host = instance.get('host'),
            boundingBox = host.get('boundingBox'),
            focusmanager = instance.get('focusmanager'),
            keys = [KEY_ARROW_LEFT, KEY_ARROW_RIGHT],
            keyEventSpec = 'down: ' + keys.join(', ');

        focusmanager.circular = host.get('circular');

        boundingBox.on('key',instance._setFocus, keyEventSpec, instance);
        boundingBox.plug(A.Plugin.NodeFocusManager, focusmanager);

        boundingBox.focusManager.set('activeDescendant', -1);

        instance.afterHostEvent('focusedChange', instance._afterFocusedChange);
    },

    /**
     * Set the aria-label for Pagination.
     *
     * @method _setAriaElements
     * @protected
     */
    _setAriaElements: function() {
        var instance = this,
            host = instance.get('host'),
            boundingBox = instance.get('host').get('boundingBox');

        boundingBox.set('tabIndex', 0);

        instance.plug(A.Plugin.Aria, {
            attributes: {
                ariaLabel: 'label'
            },
            attributeNode: boundingBox,
            roleName: 'navigation',
            roleNode: boundingBox
        });

        var controls = host.get('items').all('a'),
            items = controls.splice(1, host.get('total')),
            selectedPageItem = host.getItem(host.get('page')).one('a');
        
        // add ARIA attributes to page items
        instance.aria.setAttribute('selected', false, items);
        instance.aria.setAttribute('selected', true, selectedPageItem);
        instance.aria.setRole('select', items);

        // add ARIA attributes to controls items
        instance.aria.setRole('command', controls);

        instance.afterHostEvent('pageChange', instance._afterPageChange);
        instance.afterHostEvent('render', instance._addControlLabel, instance);
    },

    /**
     * Set focus to active page.
     *
     * @method _setFocus
     * @protected
     */
    _setFocus: function() {
        var instance = this,
            host = instance.get('host'),
            boundingBox = host.get('boundingBox');

        // if focus manager is not currently in focus, set focus to
        // selected page or the first item if no page is selected
        if (!boundingBox.focusManager.get('focused')) {
            var page = host.get('page');

            if (!host.get('showControls')) {
                page = page === 0 ? page : page - 1;
            }

            boundingBox.focusManager.focus(page);
        }
    },

    /**
     * Update aria-disabled for pagination controls.
     *
     * @method _updateControls
     * @protected
     */
    _updateControls: function() {
        var instance = this,
            host = instance.get('host');

        if (!host.get('circular')) {
            var items = host.get('items'),
                page = host.get('page');

            instance.aria.setAttribute('disabled', page === 1, items.first().one('a'));
            instance.aria.setAttribute('disabled', page === host.get('total'), items.last().one('a'));
        }
    }
});

PaginationAccessibility.NAME = 'paginationAccessibility';
PaginationAccessibility.NS = 'accessibility';

A.Plugin.PaginationAccessibility = PaginationAccessibility;