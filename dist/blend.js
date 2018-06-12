/*
* Copyright (c) 2018, Philipp Zhulev.
*/

function Blend () {

    //IE forEach FIX
    (function () {
        if ( typeof NodeList.prototype.forEach === "function" ) return false;
        NodeList.prototype.forEach = Array.prototype.forEach;
    })();

    this.version = '0.1.6';

    const _this_ = this;

    let BlendSupply = [],
        element,
        _modelObj = {},
        _dump_ = [];

    /*
    Create an id for items. 
    */
    function createBlendId () {
        return "blend_" + String(Math.floor(Math.random() * 1000)).substring(0, 5) + "_elm" + String(Math.floor(Math.random() * 2300)).substring(0, 5);
    }


    /*
    Generate "blendSupply" objects from an array of strings
    */
    function createBlendSupply(arr, b) {

        let proto_model = [];

        for(let i = 0; i < arr.length; i++) {

            function genElements (i) {
                let item = arr[i].split(">")[0] + ">",
                    itemContent = arr[i].split(">")[1],
                    sim = item.match(/[+*?$^(\(\).#\[\]>)]/g);

                let tag  = item.split(sim[0])[0],
                    id = 0,
                    className  = [],
                    ref = 0,
                    attr = 0,
                    content = 0,

                    blendId = createBlendId(),

                    classLength = 0;

                for(let inc = 0; inc < sim.length; inc++) {

                    function htmlElement(inc) {
                        return item.split(sim[inc])[1].split(sim[inc + 1])[0];
                    }

                    switch (sim[inc]) {
                        case ".":
                            classLength = inc + 1;
                            className.push(item.split(sim[inc])[classLength].split(sim[inc + 1])[0]);
                            break;
                        case "#": id = htmlElement(inc);
                            break;
                        case "[": attr = htmlElement(inc);
                            break;
                        case "(": ref = htmlElement(inc);
                            break;
                    }
                }

                if(itemContent !== undefined) {
                    content = itemContent;
                }

                let el = document.createElement(tag.replace(/^\s+/, ""));

                if(className.length > 0) {
                    className.forEach(function (value) {
                        el.classList.add(value);
                    });
                }

                if(id !== 0) {
                    el.id = id;
                }

                if(attr !== 0) {
                    let attrArr = attr.split(", " || ",") || attr;

                    attrArr.forEach(function (value) {
                        let attrItems = value.split("=");
                        el.setAttribute(attrItems[0], attrItems[1]);
                    });
                }

                if(content !== 0) {
                    el.innerHTML = content;
                }

                let spacesLen = arr[i].split(sim[0])[0].match(/ /g);

                if(spacesLen === null) {
                    spacesLen = 0;
                }

                let indexVal = 1;

                b.forEach(function (item, inc) {
                    if(item.blendName === ref && ref !== 0) {
                        ref = ref.replace("_" + (indexVal - 1), "") + "_" + indexVal;
                        indexVal++;
                    }
                });

                proto_model.push({
                    blendName: ref,
                    id: id,
                    blend_id: blendId,
                    childElement: [],
                    spacesLength: spacesLen.length || 0,
                    element: el,
                    classes: className,
                    sim: sim,
                    blendSupply: arr[i]
                });

                if(proto_model[i - 1] !== undefined && proto_model[i - 1].spacesLength !== undefined) {
                    if(proto_model[i].spacesLength > proto_model[i - 1].spacesLength) {
                        proto_model[i - 1].childElement.push(proto_model[i]);
                    }
                    for(let inr = 0; inr < proto_model.length; inr++) {
                        if(proto_model[i].spacesLength === proto_model[inr].spacesLength && proto_model[i].blend_id !==  proto_model[inr].blend_id  && proto_model[i].spacesLength !== 0) {
                            proto_model[inr -1].childElement.push(proto_model[i]);
                        }
                    }
                }

                proto_model.forEach(function (item, inc) {
                    if(item.spacesLength === 0 && arr.length - 1 === i) {
                        b.push(item);
                    }
                });
            }

            if(typeof arr[i] === "string") {
                genElements (i);
            }else {
                console.error("Parsing error: Error parsing line");
            }
        }
    }

    /*
    To draw html from an array of objects "blendSupply".
    */

    //TODO: Convert a recursive function to a loop in an array.

    function renderHTML(block, func, a) {
        function iterator (array, parent) {
            let item, index = 0, length = array.length;

            for (; index < length; index++) {
                    item = array[index];

                if(parent !== undefined) {
                    parent.append(item.element);
                }

                if (item.childElement.length !== 0) {
                    iterator(item.childElement, item.element);
                }

                if(array[index].spacesLength === 0 || a === true) {
                    func(index, item);
                }
            }
        }

        iterator(block);
    }


    /*
    Find the element by "blendName" in "blendSupply". 
    */
    function findBlendName (supply, prop, fn, type) {
        let searchType,
            result = 0;
        (supply.childElement || supply).forEach(function (item, inc) {

            if(type === undefined) {
                searchType = item.blendName;
            }else if (type === "id") {
                searchType = item.id;
            }else if (type === "blendId") {
                searchType = item.blend_id;
            }

            if (type !== "class") {
                if(searchType === prop || prop === null) {
                    if(fn !== undefined) {
                        fn(item);
                    }
                    result =  item;
                }
            }else {
                for(let i = 0; i < item.classes.length; i++) {
                    if(item.classes[i] === prop) {
                        if(fn !== undefined) {
                            fn(item);
                        }
                        result =  item;
                    }
                }
            }


            if(item.childElement !== 0) {
                findBlendName(item, prop, fn);
            }

        });

        return result;
    }


    /*
    Update Event.
    */
    this.updateEvent = new Event("Blend.update");
    this.update = function () {
        return document.dispatchEvent(_this_.updateEvent);
    };

    /*
    Init class function.
    */
    this.class = function (el) {
        return new el();
    };

    /*
    blend.component
    */
    this.component = function () {

        let _this = this,
            _view = [];


        if(_this.model !== undefined) {
            _this.model.call(_modelObj);
        }

        _dump_ = _this.view;

        if(_this.view !== undefined) {
            createBlendSupply(_dump_.call(_modelObj, _modelObj), _view); 
        }

        return {
            render: function (el) {
                element = document.querySelector(el);

                renderHTML(_view, function (i) {
                    element.append(_view[i].element);
                });

                if(_this.supply !== undefined) {
                    createBlendSupply(_this.supply.call(_modelObj), BlendSupply);
                }

                BlendSupply = BlendSupply.concat(_view);

                if(_this.controller !== undefined) {
                    _this.controller.call(BlendSupply, _modelObj);
                }

                if(_this.onEvent !== undefined) {
                    _this.event.call(BlendSupply);
                }

                _this.BlendSupply = BlendSupply;

                return BlendSupply;
            },
            inheritance : function () {
                return BlendSupply;
            },
            clear: function () {
                BlendSupply = [];
                _this.BlendSupply = [];
                return _this.BlendSupply;
            }
        }
    };

    /*
    controller methods
    */
    this.watch = function (BlendSupply) {

        //add ellements function.
        //for the methods "append, prepend, create"
        function addElement(mytype, input, output) {
            let _output = [];

            findBlendName (BlendSupply, output, function (item) {
                _output.push(item);
            });

            let elmClone,
                BlendSupplyClone,
                childClone;

            renderHTML(_output, function (i) {
                let elm = _output[i].element;

                BlendSupplyClone = _output[i].blendSupply;
                childClone = _output[i].childElement;
                elmClone = elm.cloneNode(true);

                if(mytype === "append") {
                    input.element.append(elmClone);
                }else if (mytype === "prepend") {
                    input.element.prepend(elmClone);
                }else if(mytype === "create") {
                    input.element.innerHTML = elmClone;
                }
            });

            return {
                //register in "blendSupply" with a new name
                supplement: function (name) {
                    let block = [],
                        fsArr = [BlendSupplyClone];

                    for(let i = 0; i < childClone.length; i++) {
                        fsArr.push(childClone[i].blendSupply);
                    }

                    createBlendSupply(fsArr, block);

                    block[0].blendName = name;
                    block[0].element = elmClone;

                    elmClone.childNodes.forEach(function (item, i) {
                        if(block[0].childElement[i] !== undefined) {
                            block[0].childElement[i].element = item;
                        }
                    });

                    findBlendName (BlendSupply, input.blendName, function (item) {
                        let clones = 0;
                        for(let ind = 0; ind < item.childElement.length; ind++) {
                            if(item.childElement[ind].blendName.indexOf(name) !== -1) {
                                block[0].blendName = name + "_" + clones++;
                            }
                        }

                        item.childElement.push(block[0]);
                    });

                    return {
                        //Save name in attribute
                        deliver: function () {
                            block[0].element.setAttribute("data-blend-name", block[0].blendName);
                        },
                        //rename children element
                        renameChild: function (nm, newName) {
                            findBlendName (block[0].childElement, nm, function (item) {
                                item.blendName = newName;
                                item.blendSupply = item.blendSupply.replace("(" + nm + ")","(" +  newName + ")");
                            });
                        },
                        //rename children element
                        innerBefore: function (text) {
                            block[0].element.prepend(text);
                        },
                        //insert content after
                        innerAfter: function (text) {
                            block[0].element.append(text);
                        },
                        //insert content for children
                        child: function (name) {
                            return {
                                inner: function (content) {
                                    findBlendName (block[0].childElement, name, function (item) {
                                        item.element.innerHTML = content;
                                    });
                                },
                                innerAfter: function (content) {
                                    findBlendName (block[0].childElement, name, function (item) {
                                        item.element.append(content);
                                    });
                                },
                                innerBefore: function (content) {
                                    findBlendName (block[0].childElement, name, function (item) {
                                        item.element.prepend(content);
                                    });
                                }
                            }
                        },
                        //Attribute
                        attr: {
                            set : function (name, value) {
                                block[0].element.setAttribute(name, value);
                            },
                            get : function (name) {
                                return block[0].element.getAttribute(name);
                            }
                        },
                        //Add css class
                        addClass: function (className) {
                            block[0].element.classList.add(className);
                        },
                        //remove css class
                        removeClass: function (className) {
                            block[0].element.classList.remove(className);
                        },
                        //insert content
                        inner: function (content) {
                            block[0].element.innerHTML = content;
                        },
                    }
                }
            }
        }
        //Event handling function
        function getEvent(target, prop, func) {
            let bef = null;

            function scope() {
                if(prop.before !== undefined) {
                    bef = prop.before.call(_this_.watch(BlendSupply));
                }
                if(typeof target === "string") {
                    findBlendName (BlendSupply, target, function(item) {
                        return func(item, {
                            before: bef,
                            index: 0,
                            target: target
                        });
                    });
                }else if(Array.isArray(target)) {
                    for(let i = 0; i < target.length; i++) {
                        findBlendName (BlendSupply, target[i], function(item) {
                            return func(item, {
                                before: bef,
                                index: i,
                                target: target[i]
                            });
                        });
                    }
                }
            }

            document.addEventListener("Blend.update", function () {
                if(prop.update === true) {
                    scope();
                }
            });
            scope();
        }

        //Event handling function lvl2
        function eventProp (prop, e) {
            prop.run.call(_this_.watch(BlendSupply), e);
            if(prop.update === true) {
                _this_.update();
            }
        }

        //search
        function search(s, stype) {
            let result = undefined;
            findBlendName (BlendSupply, s, function (item) {
                result = item;
            }, stype);

            return result;
        }

        return {
            //Filter by name
            it: function(BlendName) {
                let _input = null;

                if(Array.isArray(BlendName)) {
                    _input = [];
                    for(let i = 0; i < BlendName.length; i++) {
                        findBlendName (BlendSupply, BlendName[i], function (item) {
                            _input.push(item);
                        });
                    }
                }else {
                    findBlendName (BlendSupply, BlendName, function (item) {
                        _input = item;
                    });
                }

                return {
                    //draw an element
                    updateState: function() {
                        let block = [];

                        createBlendSupply(_dump_.call(_modelObj, _modelObj), block);

                        renderHTML(block, function (inc, item) {
                            function items(el) {
                                if(item.blendName === el.blendName) {
                                    el.element.replaceWith(item.element);

                                    el.id =      item.id;
                                    el.classes = item.classes;
                                    el.element = item.element;
                                }
                            }

                            if(Array.isArray(_input)) {
                                for(var i = 0; i < _input.length; i++) {
                                    items(_input[i]);
                                }
                            }else {
                                items(_input);
                            }

                        }, true);
                    },
                    draw : function (prop) {
                        if(prop.data === undefined) {
                            prop.data = [0];
                        }
                        for(let i = 0; i < prop.data.length; i++) {
                            let block = [];

                            if(prop.before !== undefined) {
                                prop.before(prop.data[i], i);
                            }

                            createBlendSupply(typeof prop.render === "function" ? prop.render(prop.data[i], i) : prop.render, block);

                            if(prop.after !== undefined) {
                                prop.after(prop.data[i], i);
                            }

                            if(prop.type === undefined) {
                                prop.type = "append";
                            }

                            renderHTML(block, function (inc) {
                                switch (prop.type) {
                                    case "append": _input.element.append(block[inc].element);
                                    break;
                                    case "prepend": _input.element.prepend(block[inc].element);
                                    break;
                                    case "rewrite": _input.element.innerHTML = block[inc].element.outerHTML;
                                    break;
                                }
                            });
                        }
                    },
                    //rename element
                    rename: function (newName) {
                        findBlendName (BlendSupply, _input, function (item) {
                            item.blendName = newName;
                            item.blendSupply = item.blendSupply.replace("(" + _input + ")","(" +  newName + ")");
                        });
                    },
                    //get the value of the field
                    value: {
                        get: function () {
                            return _input.element.value;
                        },
                        set: function (val) {
                            return _input.element.value = val;
                        }
                    },
                    //remove element in html
                    remove: function () {
                        _input.element.remove();
                    },
                    //create element
                    create: function (output) {
                        return addElement("create", _input, output);
                    },
                    //create element after
                    append: function (output) {
                        return addElement("append", _input, output);
                    },
                    //create element before
                    prepend: function (output) {
                        return addElement("prepend", _input, output);
                    },
                    //replace element
                    refactor: function (output) {

                        let _output = [];

                        findBlendName (BlendSupply, output, function (item) {
                            _output = item;
                        });

                        _input.element.replaceWith(_output.element);
                    },
                    //get element index
                    childIndex : function (name) {
                        let index;
                        for(let i = 0; i <  _input.childElement.length; i++) {
                            if(_input.childElement[i].blendName === name) {
                                index = i
                            }
                        }
                        return i;
                    },
                    //get amount of elements
                    childLength : function () {
                        return _input.childElement.length;
                    },
                    //get, set attribute
                    attr: {
                        set : function (name, value) {
                            _input.element.setAttribute(name, value);
                        },
                        get : function (name) {
                            return _input.element.getAttribute(name);
                        }
                    },
                    //insert content
                    inner: function (content) {
                        _input.element.innerHTML = content;
                    },
                    //insert content after
                    innerAfter: function (content) {
                        _input.element.append(content);
                    },
                    //insert content before
                    innerBefore: function (content) {
                        _input.element.prepend(content);
                    },
                    //redraw element in html
                    redraw: function (BlendHtml) {
                        let block = [];

                        createBlendSupply(BlendHtml, block);

                        renderHTML(block, function (i) {
                            _input.element.replaceWith(block[i].element);
                        });
                    },
                    item: _input,
                    el: _input.element
                }
            },
            //each function
            each: function (func) {
                function supplyEach(bs) {
                    for(let i = 0; i < bs.length; i++) {
                        func(bs[i], i);
                        if(bs[i].childElement !== 0) {
                            supplyEach(bs[i].childElement);
                        }
                    }
                }
                supplyEach(BlendSupply);
            },
            //get id
            searchId: function (id) {
                return search(id, "id");
            },
            //get className
            searchClass: function (className) {
                return search(className, "class");
            },
            //get element id
            searchBlendId: function (id) {
                return search(id, "blendId");
            },
            //create elements in "blendSupply"
            build: function (prop) {
                if(prop.data === undefined) {
                    prop.data = [0];
                }
                for(let i = 0; i < prop.data.length; i++) {
                    let block = [];
                    if(prop.before !== undefined) {
                        prop.before(prop.data[i], i);
                    }
                    createBlendSupply(typeof prop.create === "function" ? prop.create(prop.data[i], i) : prop.create, BlendSupply);
                    if(prop.after !== undefined) {
                        prop.after(prop.data[i], i);
                    }
                }
            },
            //events
            onEvent: function (target) {
                return {
                    click: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onclick = function (ev) {
                                e.mouse = ev;
                                eventProp(prop, e);
                            };
                        });
                    },
                    keyup: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onkeyup = function (ev) {
                                e.mouse = ev;
                                eventProp(prop, e);
                            };
                        });
                    },
                    change: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onchange = function (ev) {
                                e.mouse = ev;
                                eventProp(prop, e);
                            };
                        });
                    },
                    keydown: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onkeydown = function (ev) {
                                e.mouse = ev;
                                eventProp(prop, e);
                            };
                        });
                    },
                    mouseOver: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onmouseover = function (ev) {
                                e.mouse = ev;
                                eventProp(prop, e);
                            };
                        });
                    },
                    onmouseOut: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onmouseout = function (ev) {
                                e.mouse = ev;
                                eventProp(prop, e);
                            };
                        });
                    }
                }
            },
            blendSupply: BlendSupply
        }
    };

}

//init
const blend = new Blend();
