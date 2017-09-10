var createRenderer = require('./renderer');
var draw = require('./draw');

var defaults = {
    resize: true,
    pixelRatio: window.devicePixelRatio || 1
}

module.exports = ( dom, root, options = {} ) => {
    
    /* global HTMLCanvasElement */
    
    if ( !dom.__rect ) {
        
        var canvas;
        
        if ( !( dom instanceof HTMLCanvasElement ) ) {
            
            canvas = document.createElement( 'canvas' );
            
            dom.appendChild( canvas );
            
        } else {
            
            canvas = dom;
            
        }
        
        dom.__rect = createRenderer( Object.assign( { canvas }, defaults, options ) );
        
    }
    
    var renderer = dom.__rect;
    
    if ( renderer.options.resize ) {
        
        var { width, height } = dom.getBoundingClientRect();
        
        var { canvas, pixelRatio } = renderer.options;
        
        if (
            canvas.width !== width * pixelRatio ||
            canvas.height !== height * pixelRatio
        ) {
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
        }
        
    }
    
    renderer.regl.clear({
        color: [ 0, 0, 0, 0 ],
        depth: 1,
        stencil: 0
    });
    
    renderer.regl.draw( () => draw( renderer, root ) );
    
}