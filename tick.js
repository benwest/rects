var render = require('./render');

module.exports = ( dom, root, options ) => {
    
    var frame;
    
    var tick = () => {
        render( dom, root, options );
        frame = window.requestAnimationFrame( tick );
    }
    
    tick();
    
    return () => window.cancelAnimationFrame( frame );
    
}