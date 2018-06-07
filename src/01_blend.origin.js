/*
* Copyright (c) 2018, Philipp Zhulev. 
*/

function Blend () {

    //IE forEach FIX
    (function () {
        if ( typeof NodeList.prototype.forEach === "function" ) return false;
        NodeList.prototype.forEach = Array.prototype.forEach;
    })();

    this.version = '0.1.5';

    const _this_ = this;

    let BlendSupply = [],
        element,
        _modelObj = {},
        _dump_ = [];
