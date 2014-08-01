/**
 * The DatePicker Accessibility Component.
 *
 * @module aui-datepicker-accessibility
 */

var Lang = A.Lang,
    KeyMap = {
        DOWN: 40,
        ENTER: 13,
        LEFT: 37,
        RIGHT: 39,
        SPACE: 32,
        UP: 38
    };

function DatePickerAccessibility() {}

DatePickerAccessibility.prototype = {
    /**
     * Construction logic executed during instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance._setAriaElements();

        instance.after('calendarChange', instance._afterCalendarChange, instance);
        instance.on('useInputNode', instance._onUseInputNode, instance);
    },

    /**
     * Fires after a focus on an active input element (textarea or text).
     *
     * @method _activeInputFocusHandler
     * @protected
     */
    _activeInputFocusHandler: function(event) {
        var instance = this,
            popover = instance.getPopover();

        if (!popover.get('visible')) {
            popover.show();
        }

        instance._focusPopover();
    },

    /**
     * Fires after Calendar change.
     *
     * @method _afterCalendarChange
     * @protected
     */
    _afterCalendarChange: function() {
        var instance = this;

        instance._setAriaElements();
    },

    /**
     * Sets the aria-label on the 'DatePicker' popover.
     *
     * @method _setAriaElements
     * @protected
     */
    _setAriaElements: function() {
        var instance = this,
            calendar = instance.getCalendar(),
            contentBox = calendar.get('contentBox');

        instance.plug(A.Plugin.Aria, {
                attributes: {
                    ariaLabel: 'label'
                },
                attributeNode: contentBox
            }
        );
    },

    /**
     * Focuses the popover and binds keyups to calendar.
     *
     * @method _focusPopover
     * @protected
     */
    _focusPopover: function() {
        var instance = this,
            popover = instance.getPopover();

        if (!popover.get('visible')) {
            popover.show();
        }

        setTimeout(
            function() {
                var calendar = instance.getCalendar(),
                    contentBox = calendar.get('contentBox');

                contentBox.setAttribute('tabindex', 1);
                contentBox.focus();

                contentBox.once(
                    'keyup',
                    function(event) {
                        var keyCode = event.keyCode;

                        if (keyCode === KeyMap.UP ||
                            keyCode === KeyMap.DOWN ||
                            keyCode === KeyMap.LEFT ||
                            keyCode === KeyMap.RIGHT ||
                            keyCode === KeyMap.ENTER ||
                            keyCode === KeyMap.SPACE) {

                            contentBox.one('table').focus();
                        }
                    }
                );
            },
            10
        );
    },

    /**
     * Fires on the 'useInputNode' event.
     *
     * @method _onUseInputNode
     * @protected
     */
    _onUseInputNode: function(event) {
        var instance = this,
            node = event.node,
            popover = instance.getPopover(),
            tagName = node.get('tagName').toLowerCase(),
            type = node.get('type'),
            text = (((tagName === 'input' && type === 'text') ||(tagName === 'textarea')) && node.compareTo(document.activeElement));

        node.on(
            'keyup',
            function(event) {
                var keyCode = event.keyCode;

                if (((keyCode === KeyMap.ENTER || keyCode === KeyMap.SPACE) && !text) || (text && (keyCode === KeyMap.ENTER))) {
                    event.preventDefault();

                    instance._focusPopover();
                }
            }
        );

        node.setAttribute('aria-haspopup', 'true');
        node.setAttribute('aria-owns', popover.get('id'));
    }
};

DatePickerAccessibility.ATTRS = {
   /**
    * Sets the `aria-label` for the 'DatePicker'.
    *
    * @attribute ariaLabel
    * @type String
    */
    ariaLabel: {
        validator: Lang.isString,
        value: 'Navigate dates with arrow keys. Select a date with spacebar or enter key. Exit Date Picker with escape key.'
    }
};

A.Base.mix(A.DatePicker, [DatePickerAccessibility]);