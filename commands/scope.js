var canvasSize = ctx => {
            
    var w = ctx.drawingBufferWidth;
    var h = ctx.drawingBufferHeight;
    var px = ctx.pixelRatio;
    
    return [ w / px, h / px ];
    
}

var boxToMinMax = ({ position, size }) => ({
    min: position,
    max: [ position[ 0 ] + size[ 0 ], position[ 1 ] + size[ 1 ] ]
});

var minMaxToBox = ({ min, max }) => ({
    position: min,
    size: [ max[ 0 ] - min[ 0 ], max[ 1 ] - min[ 1 ] ]
});

var intersect = ( a, b ) => {
    
    a = boxToMinMax( a );
    b = boxToMinMax( b );
    
    return minMaxToBox({
        min: [
            Math.max( a.min[ 0 ], b.min[ 0 ] ),
            Math.max( a.min[ 1 ], b.min[ 1 ] ),
        ],
        max: [
            Math.min( a.max[ 0 ], b.max[ 0 ] ),
            Math.max( a.max[ 1 ], b.max[ 1 ] )
        ]
    });
    
}

module.exports = regl => regl({
    
    context: {
        
        resolution: ctx => {
            
            var w = ctx.drawingBufferWidth;
            var h = ctx.drawingBufferHeight;
            
            return [ w, h ];
            
        },
        
        canvasSize,
        
        clip: ( ctx, props ) => {
            
            var prev = ctx.clip || {
                position: [ 0, 0 ],
                size: canvasSize( ctx )
            }
            
            var next = props.clip;
            
            if ( !next ) return prev;
            
            if ( next === true ) next = { position: props.position, size: props.size };
            
            return intersect( prev, next );
            
        },
        
        position: ( ctx, props ) => {
            
            var prev = ctx.position || [ 0, 0 ];
            
            return [
                prev[ 0 ] + props.position[ 0 ],
                prev[ 1 ] + props.position[ 1 ]
            ]
            
        }
        
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
        
        canvasSize: regl.context( 'canvasSize' ),
        
        u_position: regl.context( 'position' ),
        
        size: regl.prop( 'size' )
        
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