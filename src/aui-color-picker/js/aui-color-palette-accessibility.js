/**
 * The Color Palette Accessibility Component.
 *
 * @module aui-color-palette-accessibility
 */

var Lang = A.Lang,

    getClassName = A.getClassName,

    CSS_PALETTE_ITEM_INNER = getClassName('palette-item-inner'),
    CSS_PALETTE_ITEM_SELECTED = getClassName('palette-item-selected');

function ColorPaletteAccessibility() {}

ColorPaletteAccessibility.prototype = {
    /**
     * Construction logic executed during ColorPaletteAccessibility instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance.after('render', instance._afterRender, instance);

        instance.after('selectedChange', instance._afterSelectedChangeAria, instance);
    },

    /**
     * Toggle 'aria-selected' attribute on palette item.
     *
     * @method toggleAriaSelected
     * @param {Number} index
     */
    toggleAriaSelected: function(index) {
        var instance = this,
            item = instance.getItemByIndex(index);

        if (item) {
            item.one('.' + CSS_PALETTE_ITEM_INNER).setAttribute('aria-selected', item.hasClass(CSS_PALETTE_ITEM_SELECTED));
        }
    },

    /**
     * Fires after 'selectedChange' event and updates aria-selected attributes.
     *
     * @method _afterSelectedChangeAria
     * @param {Number} index
     */
    _afterSelectedChangeAria: function(event) {
        var instance = this;

        instance.toggleAriaSelected(event.prevVal);
        instance.toggleAriaSelected(event.newVal);
    },

    /**
     * Fires after 'render' event.
     *
     * @method _afterRender
     */
    _afterRender: function() {
        var instance = this;

        instance._setAriaElements();

        instance._plugNodeFocusManager();
    },

    /**
     * Plugs the 'NodeFocusManager' into the boundingBox.
     *
     * @method _plugNodeFocusManager
     */
    _plugNodeFocusManager: function() {
        var instance = this,
            boundingBox = instance.get('boundingBox');

        boundingBox.plug(A.Plugin.NodeFocusManager, instance.get('nodeFocusManager'));
    },

    /**
     * Sets aria attributes on elements
     *
     * @method _setAriaElements
     * @protected
     */
    _setAriaElements: function() {
        var instance = this,
            contentBox = instance.get('contentBox'),
            contentBoxId = contentBox.getAttribute('id') || A.stamp(contentBox),
            itemInners = contentBox.all('.' + CSS_PALETTE_ITEM_INNER),
            selected = instance.get('selected'),
            selectedItem = instance.getItemByIndex(selected >= 0 ? selected : 0);

        instance.plug(A.Plugin.Aria, {
            attributeNode: contentBox,
            attributes: {
                ariaLabel: 'label'
            },
            roleName: 'listbox'
        });

        contentBox.setAttribute('aria-multiselectable', false);

        itemInners.setAttribute('role', 'option');
        itemInners.setAttribute('aria-selected', false);

        selectedItem.one('.' + CSS_PALETTE_ITEM_INNER).setAttribute('aria-labelledby', contentBoxId);

        if (selected >= 0) {
            instance.toggleAriaSelected(selected);
        }
    }
};

ColorPaletteAccessibility.ATTRS = {
    /**
    * Sets the `aria-label` for the 'ColorPalette'.
    *
    * @attribute ariaLabel
    * @type String
    */
    ariaLabel: {
        validator: Lang.isString,
        value: 'Select a color with enter key.  Change colors with arrow keys.'
    },

    /**
     * Configuration for the NodeFocusManager plugin.
     *
     * @attribute nodeFocusManager
     * @type Object
     */
    nodeFocusManager: {
        validator: Lang.isObject,
        value : {
            circular: true,
            descendants: '.' + CSS_PALETTE_ITEM_INNER,
            keys: { next: 'down:39', previous: 'down:37' }
        }
    }
};

A.Base.mix(A.ColorPalette, [ColorPaletteAccessibility]);
