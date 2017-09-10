var getDefault = type => {
    
    switch ( type ) {
        
        case 'int':
        case 'float':
            return 1;
            
        case 'bool':
            return false;
            
        case 'vec2':
            return new Float32Array( 2 );
            
        case 'vec3':
            return new Float32Array( 3 );
            
        case 'vec4':
            return new Float32Array( 4 );
        
    }
    
}

var getDefaults = frag => {
    
    var re = /\buniform\s+([a-zA-Z_$][a-zA-Z_$0-9]*)\s+([a-zA-Z_$][a-zA-Z_$0-9, ]*)\s*;/g;
    
    var uniforms = {};
    
    var matches;
    
    while ( ( matches = re.exec( frag ) ) !== null ) {
        
        var [ , type, names ] = matches;
        
        names.split(',').forEach( name => {
            
            uniforms[ name.trim() ] = getDefault( type );
            
        })
        
    }
    
    return uniforms;
    
}

var propify = ( regl, uniforms ) => {
    
    var ret = {};
    
    for ( var key in uniforms ) {
        
        ret[ key ] = regl.prop( key );
        
    }
    
    return ret;
    
}

module.exports = ( regl, shader ) => {
    
    var frag, defaults;
    
    if ( typeof shader === 'string' ) {
        
        frag = shader;
        defaults = getDefaults( frag );
        
    } else {
        
        frag = shader.frag;
        defaults = Object.assign( getDefaults( frag ), shader.uniforms );
        
    }
    
    var command = regl({
        frag,
        uniforms: propify( regl, defaults )
    })
    
    return ( uniforms, body ) => command( Object.assign( {}, defaults, uniforms ), body );
    
}