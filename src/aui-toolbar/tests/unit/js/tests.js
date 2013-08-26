YUI.add('module-tests', function(Y) {

    //--------------------------------------------------------------------------
    // AUI Toolbar Unit Tests
    //--------------------------------------------------------------------------

    var suite = new Y.Test.Suite('aui-toolbar');

    //--------------------------------------------------------------------------
    // Test Case for Toolbar Button Nodes
    //--------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: 'AUI Toolbar Render Button Tests',

        //----------------------------------------------------------------------
        // Tests
        //----------------------------------------------------------------------

        /*
         * Check if title attribute is set during the process of creation
         *
         * @tests AUI-971
         */
        'test setting title attribute': function() {
            var title,
                toolbar;

            title = 'Title should be present';

            toolbar = new Y.Toolbar({
                boundingBox: '#toolbar',
                children: [{
                    label: 'Test label',
                    title: title
                }]
            }).render();

            Y.Assert.isNotNull(Y.one('#toolbar').one('button[title="' + title + '"]'), 'Title attribute should be set to the button node.');
        },

        /*
         * Check if type attribute is defaulting to 'button' during the process of creation
         *
         * @tests AUI-974
         */
         'test default type attribute': function() {
            var toolbar;

            toolbar = new Y.Toolbar({
                boundingBox: '#toolbar',
                children: [{
                    label: 'Test label'
                }]
            }).render();

            Y.Assert.isNotNull(Y.one('#toolbar').one('button[type="button"]'), 'Type attribute of the button node should default to button');
         }
    }));

    Y.Test.Runner.add(suite);

},'', { requires: [ 'test', 'aui-toolbar' ] });
