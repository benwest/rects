module.exports = {
    
    frag: `
        precision mediump float;
        varying vec2 uv;
        
        uniform sampler2D texture;
        uniform float alpha;
        
        void main () {
            
            gl_FragColor = texture2D( texture, uv ) * alpha;
            
        }
    `,
    
    uniforms: {
        alpha: 1
    }
    
}