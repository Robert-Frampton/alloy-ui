/**
 * The DatePicker Accessibility Component.
 *
 * @module aui-datepicker-accessibility
 */

var Lang = A.Lang,
    KeyMap = A.Event.KeyMap;

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

        instance._setARIAElements();

        instance._eventHandles.push(
            A.after(instance._onUseInputNode, instance, 'useInputNode'),
            instance.after('calendarChange', instance._afterCalendarChange, instance)
        );

        instance.inputNodeKeyupHandlers = {};
    },

    /**
     * Fires after Calendar change.
     *
     * @method _afterCalendarChange
     * @protected
     */
    _afterCalendarChange: function() {
        var instance = this;

        instance._setARIAElements();
    },

    /**
     * Sets the ARIA-WAI attributes on the 'DatePicker' popover.
     *
     * @method _setARIAElements
     * @protected
     */
    _setARIAElements: function() {
        var instance = this,
            calendar = instance.getCalendar(),
            contentBox = calendar.get('contentBox');

        instance.plug(A.Plugin.Aria, {
            attributes: {
                ariaLabel: 'label'
            },
            attributeNode: contentBox
        });
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
    _onUseInputNode: function(node) {
        var instance = this,
            nodeId = node.guid(),
            listener = instance.inputNodeKeyupHandlers[nodeId];

        if (!listener) {
            var popover = instance.getPopover(),
                tagName = node.get('tagName').toLowerCase(),
                type = node.get('type'),
                text = (((tagName === 'input' && type === 'text') || (tagName === 'textarea')) && node.compareTo(document.activeElement));

            instance.inputNodeKeyupHandlers[nodeId] = node.on(
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