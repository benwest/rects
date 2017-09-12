var REGL = require('regl');
var sceneCommand = require('./commands/scene');
var scopeCommand = require('./commands/scope');
var shaders = require('./shaders');
var textures = require('./textures');

var reglOptions = [
    'gl',
    'canvas',
    'container',
    'attributes',
    'pixelRatio',
    'extensions',
    'optionalExtensions',
    'profile',
    'onDone'
];

module.exports = options => {
    
    var opts = {};
    
    reglOptions.forEach( key => key in options && ( opts[ key ] = options[ key ] ) );
    
    var renderer = { options };
    
    renderer.regl = REGL( opts );
    renderer.scene = sceneCommand( renderer.regl );
    renderer.scope = scopeCommand( renderer.regl );
    renderer.shader = shaders( renderer );
    renderer.texture = textures( renderer );
    renderer.root = null;
    
    return renderer;
    
}