var canvasSize = ( ctx, props ) => {
            
    var w = ctx.drawingBufferWidth;
    var h = ctx.drawingBufferHeight;
    var px = ctx.pixelRatio;
    
    return [ w / px, h / px ];
    
}

module.exports = regl => regl({
    
    context: {
        
        canvasSize,
        
        clip: ( ctx, props ) => ({
            position: [ 0, 0 ],
            size: canvasSize( ctx )
        }),
        
        position: [ 0, 0 ]
        
    },
    
    vert: `
        precision mediump float;
        
        attribute vec2 position;
        varying vec2 uv;
        
        uniform vec2 canvasSize;
        uniform float pixelRatio;
        
        uniform vec2 size;
        uniform vec2 u_position;
        
        void main () {
            
            uv = position;
            
            vec2 p = position;
            p *= size;
            p += u_position;
            p.y = canvasSize.y - p.y;
            p -= canvasSize / 2.;
            p /= canvasSize;
            p *= 2.;
            
            gl_Position = vec4( p, 0., 1. );
            
        }`,
    
    attributes: {
        
        position: [
            0, 0,
            0, 1,
            1, 0,
            1, 1
        ]
        
    },
    
    uniforms: {
        
        canvasSize: regl.context( 'canvasSize' )
        
    },
    
    depth: {
        
        enable: false
        
    },
    
    scissor: {
        
        enable: true,
        
        box: ctx => {
            
            return {
                x: ctx.clip.position[ 0 ] * ctx.pixelRatio,
                y: ctx.clip.position[ 1 ] * ctx.pixelRatio,
                width: ctx.clip.size[ 0 ] * ctx.pixelRatio,
                height: ctx.clip.size[ 1 ] * ctx.pixelRatio
            }
            
        }
        
    },
    
    blend: {
        
        enable: true,
    
        func: {
            srcRGB: 'src alpha',
            srcAlpha: 1,
            dstRGB: 'one minus src alpha',
            dstAlpha: 1
        },
        
        equation: {
            rgb: 'add',
            alpha: 'add'
        },
        
        color: [0, 0, 0, 0]
        
    },
    
    primitive: 'triangle strip',
    
    count: 4
    
})