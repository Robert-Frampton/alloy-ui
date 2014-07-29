/**
 * A set of utility methods to the Node to allow 'hiding'
 * while still allowing screen readers access.
 *
 * @module aui-node-accessible
 * @submodule aui-node-accessible
 */

var getClassName = A.getClassName,

    CSS_BOOTSTRAP_SR_ONLY = getClassName('sr-only'),

    NODE_PROTO = A.Node.prototype;

A.mix(
    NODE_PROTO, {

        /**
         * Hides the node.
         *
         * @method hideAccessible
         */
        hideAccessible: function() {
            this.addClass(CSS_BOOTSTRAP_SR_ONLY);

            this.after(this.showAccessible, this, 'show');
        },

        /**
         * Shows the node.  Fires after the node-base 'show' method.
         *
         * @method showAccessible
         */
        showAccessible: function() {
            this.removeClass(CSS_BOOTSTRAP_SR_ONLY);
        },

        /**
         * If the node is hidden then it will be shown, if it is visible then it will be hidden.
         *
         * @param force
         * @method toggleAccessible
         */
        toggleAccessible: function(force) {
            var hide = (force !== undefined) ? force :
                    !(this.hasClass(CSS_BOOTSTRAP_SR_ONLY));

            if (hide) {
                this.hideAccessible();
            } else {
                this.showAccessible();
            }
        }
    }
);