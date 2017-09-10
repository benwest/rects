var REGL = require("regl");
var flatten = require('lodash/flatten');
var mapValues = require('lodash/mapValues');

var scopeCommand = require('./scope');
var defaultUniforms = require('./defaultUniforms');
var textureShader = require('./glsl/texture.glsl');
var colorShader = require('./glsl/color.glsl');

var vec2 = ( x = 0, y = 0 ) => new Float32Array([ x, y ]);
var isVec2 = x => Array.isArray( x ) && x.length === 2;

var defaults = () => ({
    position: vec2(),
    size: vec2(),
    clip: false
})

var propify = ( regl, uniforms ) => mapValues( uniforms, ( value, key ) => regl.prop( key ) );

var isNode = o => typeof o === 'object' && 'command' in o && 'uniforms' in o && 'children' in o;

// Signatures:
// component?, x, y, w, h, { ...uniforms }?, ...children
// component?, [ x, y ], [ w, h ], { ...uniforms }?, ...children
// component?, { position: [ x, y ], size: [ w, h ], ...uniforms }, ...children

var normalizeArgs = args => {
    
    var shader, component, position, size, uniforms, children;
    var idx = 0;
    
    if ( typeof args[ idx ] === 'function' ) {
        
        shader = args[ idx ];
        component = null;
        idx++;
        
    } else if ( typeof args[ idx ] === 'object' && args[ idx ].render ) {
        
        component = args[ idx ];
        shader = null;
        idx++;
        
    }
    
    if ( args.slice( idx, idx + 4 ).every( a => typeof a === 'number' ) ) {
        
        position = vec2( args[ idx ], args[ idx + 1 ] );
        size = vec2( args[ idx + 2 ], args[ idx + 3 ] );
        idx += 4;
        
    } else if ( isVec2( args[ idx ] ) && isVec2( args[ idx + 1 ] ) ) {
        
        position = args[ idx ];
        size = args[ idx + 1 ];
        idx += 2;
        
    }
    
    if ( !Array.isArray( args[ idx ] ) ) {
        
        uniforms = args[ idx ] || {};
        idx++;
        
    } else {
        
        uniforms = {};
        
    }
    
    children = args.slice( idx );
    
    if ( position && size ) {
        
        uniforms = Object.assign( { position, size }, uniforms );
        
    }
    
    children = flatten( children );
    
    return { shader, component, uniforms, children };
    
}

var createCommand = ( regl, frag ) => {
    
    var defaults = defaultUniforms( frag );
    
    var command = regl({ frag, uniforms: propify( regl, defaults ) });
    
    return ( uniforms, body ) => {
        
        command( Object.assign( {}, defaults, uniforms ), body );
        
    }
    
}

var renderNode = ( flat, node ) => {
    
    flat.scope( node.uniforms, context => {
    
        if ( node.component ) {
            
            renderNode( node.component.render({ context, uniforms: node.uniforms, children: node.children }) )
            
        } else {
            
            if ( !( node.shader in flat.commands ) ) {
                
                flat.commands[ node.shader ] = createCommand( flat.regl, node.shader )
                
            }
            
            var command = flat.commands[ node.shader ];
            
            command( node.uniforms );
            
            node.children.forEach( child => {
                
                renderNode( flat, child );
                
            });
            
        }
        
    });
    
}

var render = ( flat, scene ) => {
    
    flat.regl.clear({
        color: [ 0, 0, 0, 0 ]
    });
    
    renderNode( flat, scene );
    
}

module.exports = ( options = {} ) => {
    
    var regl = REGL( options );
    
    var flat = ( ...args ) => {
        
        var node = normalizeArgs( args )
        
        if ( node.component === null && node.shader === null ) {
            
            node.shader = 'texture' in node.uniforms ? textureShader : colorShader;
            
        }
        
        return node;
        
    }
    
    flat.scope = scopeCommand( regl );
    flat.commands = {};
    flat.regl = regl;
    flat.render = scene => render( flat, scene );
    
    return flat;
    
}