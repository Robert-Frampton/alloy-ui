/**
 * The Color Picker Component
 *
 * @module aui-color-picker
 * @submodule aui-color-palette
 */

var AArray = A.Array,
    AColor = A.Color,
    Lang = A.Lang,

    isString = Lang.isString,

    getClassName = A.getClassName,

    CSS_PALETTE_ITEM = getClassName('palette-item'),
    CSS_PALETTE_ITEM_INNER = getClassName('palette-item-inner'),
    CSS_PALETTE_ITEM_SELECTED = getClassName('palette-item-selected'),

    /**
     * A base class for `ColorPalette`.
     *
     * @class A.ColorPalette
     * @extends Widget
     * @uses A.Palette, A.WidgetCssClass, A.WidgetToggle
     * @param {Object} config Object literal specifying widget configuration
     *     properties.
     * @constructor
     */
    ColorPalette = A.Base.create('color-palette', A.Widget, [
    A.Palette,
    A.WidgetCssClass,
    A.WidgetToggle
], {
        ITEM_TEMPLATE: '<li class="' + CSS_PALETTE_ITEM +
            ' {selectedClassName}" data-column={column} data-index={index} data-row={row} data-value="{value}">' +
            '<a href="" class="' + CSS_PALETTE_ITEM_INNER +
            '" style="background-color:{value}" onclick="return false;" title="{title}" tabindex="{tabindex}"></a>' + '</li>',

        /**
         * Construction logic executed during ColorPalette instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.get('boundingBox').delegate('keydown', instance._onKeyDown, '.' + CSS_PALETTE_ITEM, instance);

            instance.after('render', instance._setAriaElements);
        },

        /**
         * Toggle 'aria-pressed' attribute on palette item.
         *
         * @method toggleAriaPressed
         * @param {Number} index
         */
        toggleAriaPressed: function(index) {
            var instance = this,
                item = instance.getItemByIndex(index),
                pressed = item.hasClass(CSS_PALETTE_ITEM_SELECTED);

            item.one('.' + CSS_PALETTE_ITEM_INNER).setAttribute('aria-pressed', pressed);
        },

        /**
         * Handles key press event and navigates left/right or selectes item.
         *
         * @param {Event} event The fired event
         * @method _onKeyDown
         * @protected
         */
        _onKeyDown: function(event) {
            var instance = this,
                keyCode = event.keyCode,
                target = event.currentTarget,
                index = parseInt(target.getData('index'));

            if (37 <= keyCode && keyCode <= 40) {
                if (keyCode === 37) {
                    index = index - 1;
                }
                else if (keyCode === 38) {
                    index = index - 10;
                }
                else if (keyCode === 39) {
                    index = index + 1;
                }
                else if (keyCode === 40) {
                    index = index + 10;
                }

                var items = instance.get('boundingBox').all('.' + CSS_PALETTE_ITEM_INNER),
                    item = instance.getItemByIndex(index);

                if (item) {
                    var toSelectItem = item.one('.' + CSS_PALETTE_ITEM_INNER);

                    if (toSelectItem) {
                        items.setAttribute('tabindex', -1);
                        toSelectItem.setAttribute('tabindex', 0);
                        toSelectItem.focus();
                    }
                }
            }
            else if (keyCode === 13) {
                instance._selectColorByIndex(index);
            }
        },

        /**
         * Select a color by index.
         *
         * @method _selectColorByIndex
         * @param {Number} toSelectIndex
         * @protected
         */
        _selectColorByIndex: function(toSelectIndex) {
            var instance = this,
                items = instance.get('items');

            AArray.each(items, function(item, index) {
                    if (index === toSelectIndex) {
                        instance.toggleSelection(index);
                    }
                    else {
                        instance.unselect(index);
                    }

                    instance.toggleAriaPressed(index);
                }
            );
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
                selectedItem = instance.getItemByIndex(selected);

            if (!selectedItem) {
                selectedItem = instance.getItemByIndex(0);
            }

            contentBox.setAttribute('aria-label', instance.get('ariaLabel'));

            itemInners.setAttribute('role', 'button');
            itemInners.setAttribute('aria-pressed', false);
            selectedItem.one('.' + CSS_PALETTE_ITEM_INNER).setAttribute('aria-labelledby', contentBoxId);

            if (selected >= 0) {
                instance.toggleAriaPressed(selected);
            }
        },

        /**
         * Sets `items` attribute of the `ColorPalette` instance.
         *
         * @method _setItems
         * @param {Array} value
         * @return {Object}
         * @protected
         */
        _setItems: function(value) {
            var instance = this,
                result;

            result = AArray.map(value, function(item) {
                var tmp = item,
                    color;

                if (Lang.isString(item)) {
                    color = AColor.toHex(item);

                    tmp = {
                        name: color,
                        value: color
                    };
                }

                return tmp;
            });

            instance._items = null;

            return result;
        },

        /**
         * Provides a default value (Function) to the `formatter` property.
         *
         * @method _valueFormatterFn
         * @return {Function} The formatter function
         * @protected
         */
        _valueFormatterFn: function() {
            return function(items, index, row, column, selected) {
                var instance = this,
                    item = items[index];

                return Lang.sub(
                    instance.ITEM_TEMPLATE, {
                        column: column,
                        index: index,
                        row: row,
                        selectedClassName: selected ? CSS_PALETTE_ITEM_SELECTED : '',
                        tabindex: index === 0 ? 0 : -1,
                        title: item.name,
                        value: item.value
                    }
                );
            };
        }

    }, {

        /**
         * Static property provides a string to identify the CSS prefix.
         *
         * @property CSS_PREFIX
         * @type {String}
         * @static
         */
        CSS_PREFIX: getClassName('color-palette'),

        /**
         * Static property provides a string to identify the class.
         *
         * @property NAME
         * @type {String}
         * @static
         */
        NAME: 'color-palette',

        /**
         * Static property used to define the default attribute
         * configuration for the `ColorPalette`.
         *
         * @property ATTRS
         * @type {Object}
         * @static
         */
        ATTRS: {
            /**
             * Sets the `aria-label` for the 'ColorPalette'.
             *
             * @attribute ariaLabel
             * @type String
             */
            ariaLabel: {
                validator: isString,
                value: 'Select a color with enter key.  Change colors with arrow keys.'
            },

            /**
             * Colors available to the `ColorPalette`.
             *
             * @attribute items
             * @type {Array}
             */
            items: {
                setter: '_setItems',
                value: [
                '#9FC6E7',
                '#5484ED',
                '#A4BDFC',
                '#51B749',
                '#FBD75B',
                '#FFB878',
                '#FF887C',
                '#DC2127',
                '#DBADFF',
                '#E1E1E1'
            ]

            }
        }
    });

A.ColorPalette = ColorPalette;
