YUI.add('aui-hsv-palette-accessibility-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-hsv-palette-accessibility');

    suite.add(new Y.Test.Case({

        name: 'HSVPaletteAccessibility tests',

        setUp: function() {
            this.hsvPalette = new Y.HSVPalette().render('#hsvPalette');
        },

        tearDown: function() {
            this.hsvPalette.destroy();
        },

        'assert hsv palatte has audio feedback': function() {
            var instance = this,
                hsvPalette = instance.hsvPalette,
                bInput = hsvPalette._bContainer.one('input'),
                gInput = hsvPalette._gContainer.one('input'),
                hInput = hsvPalette._hContainer.one('input'),
                rInput = hsvPalette._rContainer.one('input'),
                sInput = hsvPalette._sContainer.one('input'),
                vInput = hsvPalette._vContainer.one('input'),
                outputInput = hsvPalette._outputContainer.one('input');

            Y.Assert.isTrue(bInput.hasAttribute('aria-valuenow'));
            Y.Assert.isTrue(bInput.hasAttribute('aria-valuemax'));
            Y.Assert.isTrue(bInput.hasAttribute('aria-valuemin'));
            Y.Assert.isTrue(bInput.hasAttribute('aria-label'));

            Y.Assert.isTrue(gInput.hasAttribute('aria-valuenow'));
            Y.Assert.isTrue(gInput.hasAttribute('aria-valuemax'));
            Y.Assert.isTrue(gInput.hasAttribute('aria-valuemin'));
            Y.Assert.isTrue(gInput.hasAttribute('aria-label'));

            Y.Assert.isTrue(hInput.hasAttribute('aria-valuenow'));
            Y.Assert.isTrue(hInput.hasAttribute('aria-valuemax'));
            Y.Assert.isTrue(hInput.hasAttribute('aria-valuemin'));
            Y.Assert.isTrue(hInput.hasAttribute('aria-label'));

            Y.Assert.isTrue(rInput.hasAttribute('aria-valuenow'));
            Y.Assert.isTrue(rInput.hasAttribute('aria-valuemax'));
            Y.Assert.isTrue(rInput.hasAttribute('aria-valuemin'));
            Y.Assert.isTrue(rInput.hasAttribute('aria-label'));

            Y.Assert.isTrue(sInput.hasAttribute('aria-valuenow'));
            Y.Assert.isTrue(sInput.hasAttribute('aria-valuemax'));
            Y.Assert.isTrue(sInput.hasAttribute('aria-valuemin'));
            Y.Assert.isTrue(sInput.hasAttribute('aria-label'));

            Y.Assert.isTrue(vInput.hasAttribute('aria-valuenow'));
            Y.Assert.isTrue(vInput.hasAttribute('aria-valuemax'));
            Y.Assert.isTrue(vInput.hasAttribute('aria-valuemin'));
            Y.Assert.isTrue(vInput.hasAttribute('aria-label'));

            Y.Assert.isTrue(outputInput.hasAttribute('aria-valuenow'));
            Y.Assert.isTrue(outputInput.hasAttribute('aria-label'));
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'node-event-simulate', 'aui-hsv-palette-accessibility']
});
