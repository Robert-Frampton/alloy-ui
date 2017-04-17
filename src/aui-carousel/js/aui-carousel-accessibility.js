/**
 * The Carousel Accessibility Component.
 *
 * @module aui-carousel-accessibility
 */

var Lang = A.Lang;

function CarouselAccessibility() {}

CarouselAccessibility.prototype = {
    /**
     * Holds the event handles for any bind event from the internal
     * implementation.
     *
     * @property _eventHandles
     * @type {Array}
     * @protected
     */
    _eventHandles: null,

    /**
     * Construction logic executed during instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        this._setARIAElements();
        this._bindKeypress();
    },

    /**
     * Destructor lifecycle implementation for the CarouselAccessibility class.
     * Purges events attached to the node (and all child nodes).
     *
     * @method destroy
     * @protected
     */
    destroy: function() {
        (new A.EventHandle(this._eventHandles)).detach();
    },

    /**
     * Binds the keydown event related to the carousel's controls.
     *
     * @method _bindKeypress
     * @protected
     */
    _bindKeypress: function() {
        this._eventHandles = [
            this.get('boundingBox').on('keydown', A.bind(this._handleKeypressEvent, this))
        ];
    },

    /**
     * Fired on keydown event on carousel.
     *
     * @method _handleKeypressEvent
     * @param event
     * @protected
     */
    _handleKeypressEvent: function(event) {
        var keyCode = event.keyCode;

        if (keyCode === 37) {
            this.prev();
        }
        else if (keyCode === 39) {
            this.next();
        }
        else if (keyCode === 32) {
            if (this.get('playing')) {
                this.pause();
            }
            else {
                this.play();
            }
        }
    },

    /**
     * Set the ARIA Elements of the carousel.
     *
     * @method _setARIAElements
     * @protected
     */
    _setARIAElements: function() {
        this.plug(A.Plugin.Aria, {
            attributes: {
                ARIALabel: 'label'
            },
            roleName: 'presentation'
        });
    }
};

CarouselAccessibility.ATTRS = {
    /**
     * Sets the `aria-label` for the carousel.
     *
     * @attribute ARIALabel
     * @type String
     */
    ARIALabel: {
        validator: Lang.isString,
        value: 'Toggle play and pause with spacebar.  Navigate left and right with arrow keys'
    },

    /**
     * Specify the tab order of elements.
     *
     * @attribute tabIndex
     * @default 1
     * @type Number
     */
    tabIndex: {
        validator: Lang.isNumber,
        value: 1
    }
};

A.Base.mix(A.Carousel, [CarouselAccessibility]);