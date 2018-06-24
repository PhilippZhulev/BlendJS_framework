/*
* Copyright (c) 2018, Philipp Zhulev.
*/

function Blend () {

    //IE forEach FIX
    (function () {
        if ( typeof NodeList.prototype.forEach === "function" ) return false;
        NodeList.prototype.forEach = Array.prototype.forEach;
    })();

    this.version = '0.1.9';

    const _this_ = this;

    let Source = [],
        element,
        _modelObj = {},
        _dump_ = [];


function eventCoolection() {
    if(_modelObj.eventCollection !== undefined) {
        for(let i = 0;i < _modelObj.eventCollection.length;i++) {
            _modelObj.eventCollection[i].element.addEventListener(
                _modelObj.eventCollection[i].event,
                _modelObj[_modelObj.eventCollection[i].func]
            );
        }
    }
}
