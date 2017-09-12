var rect = require('./index');

var texture = 'http://brody-cms.bong.international/assets/content/_phone/BA.Web.TestStories.Channel4.Image.21.jpg';

var scene = () => {
    
    return rect( { position: [ 100, 100 ], size: [ 100, 100 ], color: [ 0, 0, 1 ] },
        rect( { position: [ 20, 20 ], size: [ 300, 1000 ], texture } )
    )
    
}

var render = () => rect.render( document.body, scene() );

window.addEventListener('resize', render);

render();