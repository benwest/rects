module.exports = {
    
    frag: `
        precision mediump float;
        
        uniform vec3 color;
        uniform float alpha;
        
        void main () {
            
            gl_FragColor = vec4( color, alpha );
            
        }
    `,
    
    uniforms: {
        color: [ 0, 1, 0 ],
        alpha: 1
    }
    
}



