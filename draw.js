var draw = ( renderer, context, node ) => {
    
    if ( node.component !== null ) {
        
        draw( renderer, context, node.component.render({
            context,
            uniforms: node.uniforms,
            children: node.children
        }))
    
    } else if ( node.shader !== null ) {
        
        var command = renderer.shader( node.shader );
        
        renderer.scope( node.uniforms, context => {
            
            command( node.uniforms );
            
            node.children.forEach( child => draw( renderer, context, child ) );
            
        })
        
    }
    
}

module.exports = ( renderer, root ) => {
    
    renderer.regl.poll();
    
    renderer.regl.clear({
        color: [ 0, 0, 0, 0 ],
        depth: 1,
        stencil: 0
    });
    
    renderer.scene( context => {
        
        draw( renderer, context, root )
        
    });
    
    renderer.regl._gl.flush();
    
};