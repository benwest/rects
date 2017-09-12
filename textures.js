var loadImage = url => new Promise( resolve => {
    
    /* global Image */
    
    var img = new Image();
    
    img.crossOrigin = '';
    
    img.onload = () => resolve( img );
    
    img.src = url;
    
})

var loadSVG = ({ url, size: [ w, h ] }) => loadImage( url ).then( img => {
    
    var canvas = document.createElement( 'canvas' );
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext( '2d' );
    ctx.drawImage( img, 0, 0, w, h );
    
    return canvas;
    
})

var texOptions = data => ({ data, min: 'linear', mag: 'linear' });

var texture = ( renderer, src ) => {
    
    /* global Image, HTMLImageElement, HTMLCanvasElement */
    
    if ( src instanceof HTMLImageElement || src instanceof HTMLCanvasElement ) {
        
        return renderer.regl.texture( texOptions( src ) );
        
    } else if ( typeof src === 'string' ) {
        
        var img = new Image();
        
        img.src = src;
        
        return renderer.regl.texture( texOptions( img ) );
        
    }
    
}

module.exports = renderer => {
    
    var textures = new WeakMap();

    return src => {
        
        if ( !textures.has( src ) ) {
            
            textures.set( src, texture( renderer, src ) );
            
        }
        
        return textures.get( src );
        
    }
    
}