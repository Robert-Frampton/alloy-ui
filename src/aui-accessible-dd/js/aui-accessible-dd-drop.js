/**
 * The Accessible Drop Component
 *
 * @module aui-accessible-drop
 */

var DDM = A.DD.DDM,
    Lang = A.Lang;

var Drop = A.Component.create({

    NAME: A.DD.Drop.NAME,

    ATTRS: {},

    EXTENDS: A.DD.Drop,

    prototype: {
        /**
         * Overrides the _activateShim. 
         *
         * @private
         * @method _activateShim
         */
        _activateShim: function() {
            if (!DDM.activeDrag) {
                return false;
            }
            if (this.get('lock')) {
                return false;
            }
            var node = this.get('node'),
                dragNode = DDM.activeDrag.get('node');

            // Adds check for nested nodes
            // A drop target should not be considered valid if it's nested under the drag node.
            if (this.inGroup(DDM.activeDrag.get('groups')) && (!dragNode.contains(node) || dragNode.compareTo(node))) {
                node.removeClass(DDM.CSS_PREFIX + '-drop-active-invalid');
                node.addClass(DDM.CSS_PREFIX + '-drop-active-valid');
                DDM._addValid(this);
                this.overTarget = false;
                if (!this.get('useShim')) {
                    this.shim = this.get('node');
                }
                this.sizeShim();
            } else {
                DDM._removeValid(this);
                node.removeClass(DDM.CSS_PREFIX + '-drop-active-valid');
                node.addClass(DDM.CSS_PREFIX + '-drop-active-invalid');
            }
        }
    }
});

A.DD.Drop = A.mix(Drop, A.DD.Drop);