/**
 * The HSV Palette Accessibility Component.
 *
 * @module aui-hsv-palette-accessibility
 */

var CSS_VALUE = A.getClassName('hsv-value'),

    MAX_ALPHA = 255,
    MAX_COLOR = 255,
    MAX_HUE = 360,
    MAX_SATURATION = 100,
    MAX_VALUE = 100,

    MIN_ALPHA = 0,
    MIN_COLOR = 0,
    MIN_HUE = 0,
    MIN_SATURATION = 0,
    MIN_VALUE = 0;

function HSVPaletteAccessibility() {}

HSVPaletteAccessibility.prototype = {
    /**
     * Construction logic executed during HSVPaletteAccessibility instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance.after('render', instance._afterRender, instance);

        instance.after('colorValueChange', instance._afterColorValueChange, instance);
    },

    /**
     * Fires after 'colorValueChange' event.
     *
     * @method _afterColorValueChange
     * @protected
     */
    _afterColorValueChange: function(event) {
        var instance = this,
            containerNode = event.node,
            value = event.newValue;

        instance._setAriaAttr(value, 'valuenow', containerNode);
    },

    /**
     * Fires after 'render' event.
     *
     * @method _afterRender
     * @protected
     */
    _afterRender: function() {
        var instance = this;

        instance._setAriaElements();
    },

    /**
    * Set an 'aria-' attribute on an input node.
    *
    * @param {String} ariaVal
    * @param {String} attr
    * @param {Node} containerNode
    */
    _setAriaAttr: function(ariaVal, attr, containerNode) {
        var inputNode = containerNode.one('.' + CSS_VALUE);

        if (!inputNode) {
            inputNode = containerNode;
        }

        inputNode.setAttribute('aria-' + attr, ariaVal);
    },

    /**
    * Set the 'aria-label' attributes on input nodes.
    *
    * @method _setAriaLabelElements
    * @protected
    */
    _setAriaElements: function() {
        var instance = this,
            ariaLabels = instance.get('ariaLabels');

        instance._setAriaAttr(ariaLabels.b, 'label', instance._bContainer);
        instance._setAriaAttr(ariaLabels.g, 'label', instance._gContainer);
        instance._setAriaAttr(ariaLabels.h, 'label', instance._hContainer);
        instance._setAriaAttr(ariaLabels.hex, 'label', instance._outputContainer);
        instance._setAriaAttr(ariaLabels.r, 'label', instance._rContainer);
        instance._setAriaAttr(ariaLabels.s, 'label', instance._sContainer);
        instance._setAriaAttr(ariaLabels.v, 'label', instance._vContainer);

        instance._setAriaAttr(MAX_COLOR, 'valuemax', instance._bContainer);
        instance._setAriaAttr(MAX_COLOR, 'valuemax', instance._gContainer);
        instance._setAriaAttr(MAX_COLOR, 'valuemax', instance._rContainer);
        instance._setAriaAttr(MAX_HUE, 'valuemax', instance._hContainer);
        instance._setAriaAttr(MAX_SATURATION, 'valuemax', instance._sContainer);
        instance._setAriaAttr(MAX_VALUE, 'valuemax', instance._vContainer);

        instance._setAriaAttr(MIN_COLOR, 'valuemin', instance._bContainer);
        instance._setAriaAttr(MIN_COLOR, 'valuemin', instance._gContainer);
        instance._setAriaAttr(MIN_COLOR, 'valuemin', instance._rContainer);
        instance._setAriaAttr(MIN_HUE, 'valuemin', instance._hContainer);
        instance._setAriaAttr(MIN_SATURATION, 'valuemin', instance._sContainer);
        instance._setAriaAttr(MIN_VALUE, 'valuemin', instance._vContainer);

        if (instance._aContainer) {
            instance._setAriaAttr(ariaLabels.a, 'label', instance._aContainer);
            instance._setAriaAttr(MAX_ALPHA, 'valuemax', instance._aContainer);
            instance._setAriaAttr(MIN_ALPHA, 'valuemin', instance._aContainer);
        }
    }
};

HSVPaletteAccessibility.ATTRS = {

    /**
    * Collection of strings to be used as 'aria-label's for field inputs.
    *
    * @attribute ariaLabels
    * @type {Object}
    */
    ariaLabels: {
        validator: A.Lang.isObject,
        value: {
            a: 'Alpha',
            b: 'Blue',
            g: 'Green',
            h: 'Hue',
            hex: 'Hex',
            r: 'Red',
            s: 'Saturation',
            v: 'Value'
        }
    }
};

A.Base.mix(A.HSVPalette, [HSVPaletteAccessibility]);
