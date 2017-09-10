var shader = require('./shader');

var draw = ( renderer, node ) => {
    
    renderer.scope( node.uniforms, context => {
        
        if ( node.component !== null ) {
        
            draw( renderer, node.component.render({
                context,
                uniforms: node.uniforms,
                children: node.children
            }))
            
        } else if ( node.shader !== null ) {
            
            var frag = typeof node.shader === 'string' ? node.shader : node.shader.frag;
            
            if ( !( frag in renderer.commands ) ) {
                
                renderer.commands[ frag ] = shader( renderer.regl, node.shader );
                
            }
            
            renderer.commands[ frag ]( node.uniforms );
            
            node.children.forEach( child => draw( renderer, child ) );
            
        }
        
    })
    
}

module.exports = draw;