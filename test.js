var regl = require("regl")()

debugger;
regl.frame( c => console.log( c.drawingBufferWidth ));
// var rect = require('./index');

// debugger;

// var scene = () => {
    
//     return rect( { position: [ 100, 100 ], size: [ 100, 100 ], color: [ 0, 0, 1 ], clip: true },
//         rect( { position: [ 20, 20 ], size: [ 150, 20 ], color: [ 1, 0, 0 ] } )
//     )
    
// }

// rect.render( document.body, scene() );

// // var rect = require('./index');

