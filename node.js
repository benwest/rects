var Color = require('./shaders/color');
var Texture = require('./shaders/texture');
var Nothing = require('./shaders/nothing');

var flatten = arr => {
    
    if ( !Array.isArray( arr ) ) return [ arr ];
    
    return arr.reduce( ( flat, x ) => flat.concat( flatten( x ) ), [] );
    
}

var Default = {
    
    render: ({ uniforms, children }) => {
        
        if ( 'texture' in uniforms ) {
            
            return rect( Texture, uniforms, children );
            
        } else if ( 'color' in uniforms ) {
            
            return rect( Color, uniforms, children );
            
        } else {
            
            return rect( Nothing, uniforms, children );
            
        }
        
    }
    
}

var rect = ( ...args ) => {
    
    var shader = null, component = null, uniforms, children;
    
    var idx = 0;
    
    if ( typeof args[ 0 ] === 'string' || 'frag' in args[ 0 ] ) {
        
        [ shader, uniforms, ...children ] = args;
        
    } else if ( 'render' in args[ 0 ] ) {
        
        [ component, uniforms, ...children ] = args;
        
    } else {
        
        component = Default;
        
        [ uniforms, ...children ] = args;
        
    }
    
    children = flatten( children );
    
    return { shader, component, uniforms, children };
    
}

module.exports = rect;