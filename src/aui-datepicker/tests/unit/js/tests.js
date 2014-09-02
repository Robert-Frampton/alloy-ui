YUI.add('aui-datepicker-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-datepicker');

    suite.add(new Y.Test.Case({
        name: 'DatePicker',

        setUp: function() {
            this.datePicker = new Y.DatePicker({
                on: {
                    selectionChange: function(event) {
                        Y.log(event.newSelection);
                    }
                },
                popover: {
                    zIndex: 1
                },
                panes: 1,
                trigger: '#trigger'
            });
        },

        tearDown: function() {
            this.datePicker.destroy();
        },

        'datepicker accessible': function() {
            var datePicker = this.datePicker,
                button = Y.one('#trigger'),
                popover = datePicker.getPopover(),
                popoverNode = popover.get('boundingBox');

            button.setAttribute('tabindex', 1).focus();
            button.simulate('keyup', { keyCode: 13 });

            //ensure popover is visible
            Y.Assert.isTrue(popover.get('visible'));
            Y.Assert.isFalse(popoverNode.hasClass('popover-hidden'));

            this.wait(function() {
                popoverNode.one('table').focus();

                this.wait(function() {
                    Y.one(document.activeElement).simulate('keydown', { keyCode: 39 });
                    Y.one(document.activeElement).simulate('keydown', { keyCode: 13 });

                    var activeCell = Y.one(document.activeElement),
                        selectedDate = datePicker.getSelectedDates()[0];

                    //ensure arrow key navigation of calendar grid
                    Y.Assert.areEqual(activeCell.html(), selectedDate.getDate());

                    Y.one(document.activeElement).simulate('keydown', { keyCode: 27 });

                    //ensure escape key hides popover
                    Y.Assert.isTrue(popoverNode.hasClass('popover-hidden'));
                }, 10);
            }, 10);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'node-event-simulate', 'aui-datepicker', 'aui-datepicker-accessibility']
});
