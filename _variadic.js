var expandOrs = patterns => {
    
    var hasOr = str => str.indexOf('|') !== -1;
    
    return patterns.reduce( ( expanded, pattern ) => {
        
        var idx = pattern.findIndex( hasOr );
        
        if ( idx === -1 ) return expanded.concat( [ pattern ] );
        
        var opts = pattern[ idx ].split('|');
        
        return expanded.concat( expandOrs( opts.map( opt => {
            
            var copy = pattern.slice( 0 );
            
            copy[ idx ] = opt;
            
            return copy;
            
        })))
        
    }, [] );
    
}

var expandOptionals = patterns => {
    
    var isOptional = str => str.endsWith('?');
    
    return patterns.reduce( ( expanded, pattern ) => {
        
        var idx = pattern.findIndex( isOptional );
        
        if ( idx === -1 ) return expanded.concat( [ pattern ] );
        
        var withOptional = pattern.slice( 0 );
        withOptional[ idx ] = pattern[ idx ].slice( 0, -1 );
        
        var withoutOptional = pattern.slice( 0 );
        withoutOptional.splice( idx, 1 );
        
        return expanded.concat( expandOptionals( [ withOptional, withoutOptional ] ) );
        
    }, [] )
    
}

var variadic = ( tests, signatures, fn = () => {} ) => {
    
    var patterns = expandOptionals( expandOrs( signatures ) );
    
    return ( ...args ) => {
        
        var normalized;
        
        var matched = patterns.find( pattern => {
            
            normalized = {};
            
            return pattern.every( ( name, i ) => {
                
                var value, valid;
                
                if ( name.startsWith('...') ) {
                    
                    name = name.slice( 3 );
                    value = args.slice( i );
                    valid = value.every( tests[ name ] );
                    
                } else {
                    
                    value = args[ i ];
                    valid = tests[ name ]( value );
                    
                }
                
                normalized[ name ] = value;
                
                return valid;
                
            });
            
        })
        
        if ( matched === undefined ) throw new Error( 'Invalid arguments' );
        
        return fn( normalized );
        
    }
    
}