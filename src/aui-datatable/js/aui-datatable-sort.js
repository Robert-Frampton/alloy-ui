/**
 * The Datatable Component
 *
 * @module aui-datatable
 * @submodule aui-datatable-sort
 */

/**
 * An extension for A.DataTable.Sortable that adds correct class to Table.
 *
 * @class DataTableSortable
 * @constructor
 */

function DataTableSortable() {}

/**
 * attrs...
 *
 * @property ATTRS
 * @type Object
 * @static
 */
DataTableSortable.ATTRS = {
    captionClass: {
        validator: A.Lang.isString,
        value: 'sr-only'
    },

    strings: {
        value: {
            sorted: 'sorted',
            sortedBy: 'sorted by',
            notSorted: 'not sorted'
        }
    }
};

/**
 * Static property provides a string to identify the class.
 *
 * @property NAME
 * @type String
 * @static
 */
DataTableSortable.NAME = 'dataTableSortable';

DataTableSortable.prototype = {
    CAPTION_HEADER_TEMPLATE: '<caption aria-live="polite" class="{captionClass}" role="alert">{columnName} {sorted}</caption>',

    SORTABLE_HEADER_TEMPLATE: '<div class="{className}" tabindex="1" unselectable="on">' +
            '<span aria-label="sort" class="{indicatorClass}" tabindex="-1"></span>' +
        '</div>',

    initializer: function() {
        var instance = this;

        instance.after('render', instance._addCaption, instance);
        instance.after('sort', instance._updateCaption, instance);
    },

    _addCaption: function() {
        var instance = this;

        var caption = A.Node.create(
            A.Lang.sub(
                instance.CAPTION_HEADER_TEMPLATE,
                {
                    captionClass: instance.get('captionClass'),
                    columnName: 'no column selected',
                    sorted: instance.get('strings').notSorted
                }
            )
        );

        instance._tableNode.prepend(caption);

        instance._captionNode = caption;
    },

    _getSortyByName: function() {
        var instance = this;

        return A.Object.keys(instance.get('sortBy')[0]);
    },

    _getSortyByOrder: function() {
        var instance = this;

        return A.Object.values(instance.get('sortBy')[0]);
    },

    _updateCaption: function() {
        var instance = this,
            ascending = (instance._getSortyByOrder() > 0),
            caption = instance._captionNode,
            strings = instance.get('strings');

        caption.text(
            A.Lang.sub(
                instance.get('strings').sortedBy + ' {columnName} {sorted}',
                {
                    columnName: instance._getSortyByName(),
                    sorted: ascending ? strings.asc : strings.desc
                }
            )
        );
    }
};

A.Base.mix(A.DataTable, [DataTableSortable]);