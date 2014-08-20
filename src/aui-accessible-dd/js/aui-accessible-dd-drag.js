/**
 * The Accessible Drag Component
 *
 * @module aui-accessible-drag
 */

var DDM = A.DD.DDM,
    DOC = A.config.doc,
    Lang = A.Lang,

    KEY_ARROW_LEFT = 37,
    KEY_ARROW_RIGHT = 39,
    KEY_SPACE_BAR = 32;

var Drag = A.Component.create({

    NAME: A.DD.Drag.NAME,

    ATTRS: {
        keys: {
            value: {
                next: KEY_ARROW_RIGHT,
                previous: KEY_ARROW_LEFT,
                select: KEY_SPACE_BAR                
            }
        }
    },

    EXTENDS: A.DD.Drag,

    prototype: {
        /**
         * Index of current drop target in `_targets`
         * @type Number
         */
        _currentTarget: null,

        /**
         * Array of event handles
         * @type Array
         */
        _eventHandles: null,

        /**
         * Index of drag object in `_targets`
         * @type Number
         */
        _index: null,

        /**
         * Boolean indicating the dragging state
         * @type Boolean
         */
        _isDragging: null,
     
        /**
         * Index of previous drop target in `_targets`
         * @type Number
         */
        _prevTarget: null,

        /**
         * List of valid drop targets for the drag object
         * @type A.NodeList
         */
        _targets: null,

        /**
         * Construction logic executed during `A.DD.Drag` instantiation.
         * Lifecycle.
         *
         * @method initializer
         */
        initializer: function() {
            var instance = this,
                node = instance.get('node');

            // add drag object to the tab order
            node.set('tabIndex', 0);

            instance._eventHandles = [];
            instance._isDragging = false;

            instance._bindKeyEvents();
        },

        /**
         * Subscribe drag object to key events.
         *
         * @method _bindKeyEvents
         * @protected
         */
        _bindKeyEvents: function() {
            var instance = this,
                node = instance.get('node'),
                selectKey = instance.get('keys.select') || KEY_SPACE_BAR;
            
            instance.once('drag:keyDown', A.bind(instance._defKeyDownFn, instance));
            instance.once('drag:start', A.bind(instance._onDragStart, instance));
            node.once('key', A.bind(instance._onTriggerKeyDown, instance), 'down:' + selectKey);
        },

        /**
         * Default function for drag:keyDown. Fired from _onTriggerKeyDown.
         * 
         * @method _defKeyDownFn
         * @param {EventFacade} event
         * @protected
         */
        _defKeyDownFn: function(event) {
            var instance = this,
                doc = A.one(DOC),
                node = instance.get('node');

            instance._handleMouseDownEvent(event.ev);
            instance._eventHandles.push(
                doc.on('keydown', A.bind(instance._onSelectionKeyDown, instance))
            );
        },

        /**
         * Get a list of valid drop targets for the drag object.
         *
         * @method _getDropTargets
         * @protected
         * @return {A.NodeList}
         */
        _getDropTargets: function() {           
            return A.all('.' + DDM.CSS_PREFIX + '-drop-active-valid');
        },

        /**
         * Return the index of next target.
         *
         * @method _nextTarget
         * @protected
         */
        _getNextTarget: function() {
            var instance = this,
                currentTarget = instance._currentTarget + 1;

            return currentTarget < instance._targets.size() ? currentTarget : 0;
        },

        /**
         * Return the index of previous target.
         *
         * @method _prevTarget
         * @protected
         */
        _getPrevTarget: function() {
            var instance = this,
                currentTarget = instance._currentTarget - 1;

            return currentTarget >= 0 ? currentTarget : instance._targets.size() - 1;
        },

        /**
         * Handle previous drop target. Derive from _handleOut in dd-drop.js
         *
         * @method _handleOut
         * @param {Node} dropNode
         * @protected
         */
        _handleOut: function(dropNode) {
            var drop = DDM.getDrop(dropNode);
     
            if (drop && drop.overTarget) {
                drop.overTarget = false;
                DDM._removeActiveShim(drop);
                dropNode.removeClass(DDM.CSS_PREFIX + '-drop-over');
                DDM.activeDrag.get('node').removeClass(DDM.CSS_PREFIX + '-drag-over');
                drop.fire('drop:exit', { drop: drop, drag: DDM.activeDrag });
                DDM.activeDrag.fire('drag:exit', { drop: drop, drag: DDM.activeDrag });
            }
        },
     
        /**
         * Handle current drop target. Derive from _handleTargetOver in dd-drop.js
         *
         * @method _handleTargetOver
         * @param {Node} dropNode
         * @protected
         */
        _handleTargetOver: function(dropNode) {
            var drop = DDM.getDrop(dropNode);
     
            dropNode.addClass(DDM.CSS_PREFIX + '-drop-over');
            DDM.activeDrop = drop;
            drop.overTarget = true;

            drop.fire('drop:enter', { drop: drop, drag: DDM.activeDrag });
            drop.fire('drop:over', { drop: drop, drag: DDM.activeDrag });

            DDM.activeDrag.fire('drag:enter', { drop: drop, drag: DDM.activeDrag });
            DDM.activeDrag.fire('drag:over', { drop: drop, drag: DDM.activeDrag });
            DDM.activeDrag.get('node').addClass(DDM.CSS_PREFIX + '-drag-over');
        },

        /**
         * Trigger when the drag event starts.
         *
         * @method _onDragStart
         * @param {EventFacade} event
         * @protected
         */
        _onDragStart: function(event) {
            var instance = this;

            if (!instance._isDragging) {
                var doc = A.one(DOC),
                    dragNode = DDM.activeDrag.get('node'),
                    nextKey = instance.get('keys.next') || KEY_ARROW_RIGHT,
                    prevKey = instance.get('keys.previous') || KEY_ARROW_LEFT;

                instance._targets = instance._getDropTargets();
                
                // finds the index of the drag node and removes it from the drop targets list
                instance._currentTarget = instance._targets.indexOf(dragNode);
                instance._targets.splice(instance._currentTarget, 1);
                instance._currentTarget = instance._currentTarget ? instance._currentTarget - 1 : instance._currentTarget;

                instance._eventHandles.push(
                    doc.on('key', A.bind(instance._setTarget, instance), 'down:' + nextKey + ',' + prevKey)
                );
                
                instance._isDragging = true;
            }
        },

        /**
         * End drag operation when selection key is pressed.
         *
         * @method _end
         * @param {EventFacade} event
         * @protected
         */
        _onSelectionKeyDown: function(event) {
            var instance = this,
                selectKey = instance.get('keys.select') || KEY_SPACE_BAR;

            event.preventDefault();

            if (event.charCode === selectKey && instance._isDragging) {
                instance._handleMouseUp(event);

                (new A.EventHandle(instance._eventHandles)).detach();
                instance._eventHandles = [];

                instance._bindKeyEvents();

                // set focus back to dragged object after drop
                instance.get('node').focus();

                instance._isDragging = false;
            }
        },

        /**
         * Start drag operation when the trigger key is pressed.
         *
         * @method _start
         * @param {EventFacade} event
         * @protected
         */     
        _onTriggerKeyDown: function(event) {
            event.preventDefault();

            if (event.target === event.currentTarget) {
                var instance = this;

                event.button = 1;
                instance.fire('drag:keyDown', {ev: event});
            }
        },

        /**
         * Set the current drop target.
         *
         * @method _setTarget
         * @param {EventFacade} event
         * @protected
         */
        _setTarget: function(event) {
            var instance = this,
                key = event.charCode,
                nextKey = instance.get('keys.next') || KEY_ARROW_RIGHT,
                prevKey = instance.get('keys.previous') || KEY_ARROW_LEFT;

            event.preventDefault();

            instance._prevTarget = instance._currentTarget;

            if (key === prevKey) {
                instance._currentTarget = instance._getPrevTarget();
            }
            else if (key === nextKey) {
                instance._currentTarget = instance._getNextTarget();
            }

            var prevDrop = instance._targets.item(instance._prevTarget),
                currentDrop = instance._targets.item(instance._currentTarget);

            instance._handleOut(prevDrop);
            instance._handleTargetOver(currentDrop);
        }
    }
});

A.DD.Drag = A.mix(Drag, A.DD.Drag);