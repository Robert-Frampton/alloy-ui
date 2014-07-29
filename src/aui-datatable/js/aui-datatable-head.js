/**
 * The Datatable Component
 *
 * @module aui-datatable
 * @submodule aui-datatable-head
 */

/**
 * An extension for A.DataTable.HeaderView that adds correct class to Table.
 *
 * @class DataTableHeader
 * @constructor
 */

function DataTableHeader() {}

/**
 * Static property provides a string to identify the class.
 *
 * @property NAME
 * @type String
 * @static
 */
DataTableHeader.NAME = 'dataTableHeader';

DataTableHeader.prototype = {
    CELL_TEMPLATE: '<th aria-sort="none" class="{className}" colspan="{_colspan}" id="{id}" role="columnheader" rowspan="{_rowspan}" scope="col" tabindex="-1" {_id}{abbr}{title}>{content}</th>'
};

A.Base.mix(A.DataTable.HeaderView, [DataTableHeader]);