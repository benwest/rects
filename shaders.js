var mapValues = require('lodash/mapValues');

var getUniforms = frag => {
    
    var re = /\buniform\s+([a-zA-Z_$][a-zA-Z_$0-9]*)\s+([a-zA-Z_$][a-zA-Z_$0-9, ]*)\s*;/g;
    
    var uniforms = {};
    
    var matches;
    
    while ( ( matches = re.exec( frag ) ) !== null ) {
        
        var [ , type, names ] = matches;
        
        names.split(',').forEach( name => {
            
            uniforms[ name.trim() ] = type;
            
        })
        
    }
    
    return uniforms;
    
}

var createShader = ( renderer, shader ) => {
    
    var frag = typeof shader === 'string' ? shader : shader.frag;
    var uniformTypes = getUniforms( frag );
    var uniformDefaults = shader.uniforms || {};
    
    var command = renderer.regl({
        frag,
        uniforms: mapValues( uniformTypes, ( value, key ) => renderer.regl.prop( key ) )
    })
    
    return ( passedUniforms, body ) => {
        
        var uniforms = {};
        
        for ( var name in uniformTypes ) {
            
            var type = uniformTypes[ name ];
            var value;
            
            if ( name in passedUniforms ) {
                
                value = passedUniforms[ name ];
                
            } else if ( name in uniformDefaults ) {
                
                value = uniformDefaults[ name ];
                
            } else {
                
                throw new Error( 'Missing uniform ' + name );
                
            }
            
            if ( type === 'sampler2D' ) value = renderer.texture( value );
            
            uniforms[ name ] = value;
            
        }
        
        command( uniforms, body );
        
    }
    
}

module.exports = renderer => {
    
    var commands = {};
    
    return shader => {
        
        var frag = typeof shader === 'string' ? shader : shader.frag;
        
        if ( !( frag in commands ) ) {
            
            commands[ frag ] = createShader( renderer, shader );
            
        }
        
        return commands[ frag ];
        
    }
    
}