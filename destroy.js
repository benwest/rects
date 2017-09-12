module.exports = dom => {
    
    if ( !dom.__rect ) return;
    
    var renderer = dom.__rect;
    
    renderer.regl.destroy();
    
    var canvas = renderer.options.canvas;
    
    if ( canvas !== dom && canvas.parentNode ) {
        
        canvas.parentNode.removeChild( canvas );
        
    }
    
    delete dom.__rect;
    
}