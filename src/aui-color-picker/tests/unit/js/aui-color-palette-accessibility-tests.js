YUI.add('aui-color-palette-accessibility-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-color-palette-accessibility');

    suite.add(new Y.Test.Case({

        name: 'ColorPaletteAccessibility tests',

        setUp: function() {
            this.colorPalette = new Y.ColorPalette().render('#colorPalette');
        },

        tearDown: function() {
            this.colorPalette.destroy();
        },

        'assert color palatte is keyboard accessible': function() {
            var instance = this,
                colorPalette = this.colorPalette,
                colorPaletteContainer = Y.one('#colorPalette');

            colorPaletteContainer.one('li > a').focus();

            Y.one(document.activeElement).simulate('keydown', { keyCode: 39 });
            Y.one(document.activeElement).simulate('keypress', { keyCode: 13 });

            Y.Assert.areEqual(colorPalette.get('selected'), 1);

            Y.one(document.activeElement).simulate('keydown', { keyCode: 37 });
            Y.one(document.activeElement).simulate('keypress', { keyCode: 13 });

            Y.Assert.areEqual(colorPalette.get('selected'), 0);
        },

        'assert color palatte has audio feedback' : function() {
            var instance = this,
                colorPalette = this.colorPalette,
                colorPaletteContainer = Y.one('#colorPalette'),
                paletteItems = colorPaletteContainer.all('li > a');

            paletteItems.each(function(item, index) {
                Y.Assert.isTrue(item.hasAttribute('aria-selected'));
                Y.Assert.isTrue(item.hasAttribute('tabindex'));
            });
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'node-event-simulate', 'aui-color-palette-accessibility']
});
