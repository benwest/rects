var createRenderer = require('./renderer');
var draw = require('./draw');

var defaults = {
    pixelRatio: window.devicePixelRatio || 1
}

module.exports = ( dom, root, options = {} ) => {
    
    /* global HTMLCanvasElement */
    
    if ( !dom.__rect ) {
        
        var canvas;
        
        if ( !( dom instanceof HTMLCanvasElement ) ) {
            
            canvas = document.createElement( 'canvas' );
            
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            
            dom.appendChild( canvas );
            
        } else {
            
            canvas = dom;
            
        }
        
        dom.__rect = createRenderer( Object.assign( { canvas }, defaults, options ) );
        
    }
    
    var renderer = dom.__rect;
    
    var { canvas, pixelRatio } = renderer.options;
    
    var rect = dom.getBoundingClientRect();
    
    var width = rect.width * pixelRatio;
    var height = rect.height * pixelRatio;
    
    if (
        canvas.width !== width ||
        canvas.height !== height
    ) {
        canvas.width = width;
        canvas.height = height;
    }
    
    draw( renderer, root );
    
}