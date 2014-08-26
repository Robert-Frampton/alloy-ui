/**
* The SchedulerViewAccessibility Component
*
* @module aui-scheduler
* @submodule aui-scheduler-view-accessibility
*/

var DateMath = A.DataType.DateMath,
    Lang = A.Lang,

    CSS_SCHEDULER_VIEW_DAY_HEADER_DAY = A.getClassName('scheduler-view', 'day', 'header', 'day');

var SchedulerViewAccessibility = function() {};

SchedulerViewAccessibility.ATTRS = {

    /**
    * Contains the function that formats the aria label date.
    *
    * @attribute ariaLabelDateFormatter
    * @type {Function}
    */
    ariaLabelDateFormatter: {
        value: function(date) {
            var instance = this,
                scheduler = instance.get('scheduler');

            return A.DataType.Date.format(
                date, {
                    format: '%A %B %d %Y',
                    locale: scheduler.get('locale')
                }
            );
        },
        validator: Lang.isString
    }
};

A.mix(SchedulerViewAccessibility.prototype, {

    /**
     * Construction logic executed during `SchedulerViewAccessibility` instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance.after('render', instance._afterRendered, instance);
    },

    /**
     * Binds the accessibility events.
     *
     * @method bindAccessibilityEvents
     */
    bindAccessibilityEvents: function() {
        this.on('accessibilityKeyDown', this._onAccessibilityKeyDown, this);
        this.on('accessibilityKeyUp', this._onAccessibilityKeyUp, this);
        this.on('accessibilityActiveDescendantChange', this._onAccessibilityActiveDescendantChange, this);
    },

    /**
     * Binds applicable key events.
     *
     * @method bindKeyEvents
     */
    bindKeyEvents: function() {
        var instance = this,
            markerNodeClass = instance.get('markerNodeClass'),
            boundingBox = instance.get('boundingBox'),
            scheduler = instance.get('scheduler');

        scheduler.after('dateChange', instance.syncAriaLabelsForHeaders, instance);

        boundingBox.delegate(
            'key', A.bind(instance._onEnterKeyHeader, instance), 'down:13', '.' + CSS_SCHEDULER_VIEW_DAY_HEADER_DAY);

        boundingBox.delegate(
            'key', A.bind(instance._onEnterKeyDown, instance), 'down:13,16', markerNodeClass);

        boundingBox.delegate(
            'key', A.bind(instance._onEnterKeyUp, instance), 'up:13,16', markerNodeClass);

        instance._bindFocusManager(instance.get('visible'));
    },

    /**
     * Syncs the 'aria-label' attribute on column headers.
     *
     * @method syncAriaLabelsForHeaders
     */
    syncAriaLabelsForHeaders: function() {
        var instance = this,
            ariaLabelDateFormatter = instance.get('ariaLabelDateFormatter'),
            viewDate = instance.get('scheduler').get('viewDate');

        instance.colHeaderDaysNode.all('a').each(
            function(columnNode, i) {
                var columnDate = DateMath.add(viewDate, DateMath.DAY, i);

                columnNode.setAttribute('aria-label', ariaLabelDateFormatter.call(instance, columnDate));
            }
        );
    },

    /**
     * Handles 'activeDescendantChange' events coming from the
     * NodeFocusManager.
     *
     * @method _afterActiveDescendantChange
     * @param {EventFacade} event
     * @protected
     */
    _afterActiveDescendantChange: function(event) {
        var instance = this,
            newVal = event.newVal,
            focusManager = event.target,
            activeDescendant = focusManager.get('descendants').item(newVal);

        if (instance._enterKeyDown) {
            var centerXY = activeDescendant.getCenterXY(),
                colNumber = parseInt(activeDescendant.getData('colnumber')),
                activeColumn = null;

            if (Lang.isNumber(colNumber)){
                activeColumn = instance.colDaysNode.item(colNumber);
            }

            instance.fire('accessibilityActiveDescendantChange', {
                activeColumn: activeColumn,
                centerXY: centerXY
            });
        }
    },

    /**
     * Fires after 'render' event.
     *
     * @method _afterRendered
     * @protected
     */
    _afterRendered: function() {
        var instance = this;

        instance.bindKeyEvents();

        instance.bindAccessibilityEvents();

        instance.syncAriaLabelsForHeaders();
    },

    /**
     * Binds the `Plugin.NodeFocusManager` that handles day view
     * table node keyboard navigation.
     *
     * @method _bindDayFocusManager
     * @protected
     */
    _bindFocusManager: function(visible) {
        var instance = this,
            nodeToPlug = instance.getFocusManagerNode(),
            focusManagerConfig = instance.get('focusManagerConfig');

        if (visible) {
            if (nodeToPlug) {
                nodeToPlug.plug(A.Plugin.NodeFocusManager, focusManagerConfig);

                instance.descendantChangeHandler = nodeToPlug.focusManager.after(
                    'activeDescendantChange', instance._afterActiveDescendantChange, instance);

                instance._bindFocusOnRecorderSave();
            }
        }
        else if (instance.descendantChangeHandler) {
            instance.descendantChangeHandler.detach();

            nodeToPlug.unplug(A.Plugin.NodeFocusManager);
        }
    },

    /**
     * Binds the listener that focuses the last focused tableNode element after
     * `recorder` fires `save`.
     *
     * @method _bindFocusOnRecorderSave
     * @protected
     */
    _bindFocusOnRecorderSave: function() {
        var instance = this,
            focusManagerNode = instance.getFocusManagerNode(),
            scheduler = instance.get('scheduler'),
            recorder = scheduler.get('eventRecorder');

        recorder.on('save', function() {
            if (instance._lastFocusedNode && focusManagerNode.contains(instance._lastFocusedNode)) {
                instance._lastFocusedNode.focus();
            }
        });
    },

    /**
     * Handles 'keyDown' event on the tableNode.
     *
     * @method _onEnterKeyDown
     * @param {EventFacade} event
     * @protected
     */
    _onEnterKeyDown: function(event) {
        var instance = this,
            target = event.target,
            colNumber = parseInt(target.getData('colnumber'));

        instance._enterKeyDown = true;

        instance.fire('accessibilityKeyDown', {
            centerXY: target.getCenterXY(),
            colNumber: colNumber,
            node: target
        });
    },

    /**
     * Handles 'keyDown' event on the tableNodeHeader.
     *
     * @method _onEnterKeyHeader
     * @param {EventFacade} event
     * @protected
    */
    _onEnterKeyHeader: function(event) {
        var instance = this;

        instance._onClickDaysHeader(event);
    },

    /**
     * Handles 'keyUp' event on the tableNode.
     *
     * @method _onEnterKeyUp
     * @param {EventFacade} event
     * @protected
     */
    _onEnterKeyUp: function(event) {
        var instance = this;

        if (instance._enterKeyDown) {
            instance._enterKeyDown = false;

            instance._lastFocusedNode = event.target;

            instance.fire('accessibilityKeyUp');
        }
    }
});

A.SchedulerDayView.SchedulerViewAccessibility = SchedulerViewAccessibility;

A.Base.mix(A.SchedulerView, [SchedulerViewAccessibility]);