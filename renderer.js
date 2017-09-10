var REGL = require('regl');
var scopeCommand = require('./scope');

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
    
    var regl = REGL( opts );
    var scope = scopeCommand( regl );
    var commands = {};
    
    return { regl, scope, commands, options };
    
}