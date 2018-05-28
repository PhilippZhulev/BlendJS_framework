/*
* Copyright (c) 2018, Philipp Zhulev.
*/

function Blend () {

    this.version = '0.0.8';

    const _this_ = this;

    let BlendSupply = [],
        element,
        _dump_ = [];


    function createBlendId () {
        return "Blend_" + String(Math.floor(Math.random() * 1000)).substring(0, 5) + "_elm" + String(Math.floor(Math.random() * 2000)).substring(0, 5);
    }
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
                    content = 0;

                let blendId = createBlendId();

                let classLength = 0;

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
                    if(item.blendName === ref) {
                        ref = ref.replace("_" + (indexVal - 1), "") + "_" + indexVal;
                        indexVal++;
                        console.log(item.blendName);
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
                        parentMem = proto_model[i - 1];
                    }
                    if(proto_model[i].spacesLength === proto_model[i - 1].spacesLength && proto_model[i].spacesLength !== 0) {
                        parentMem.childElement.push(proto_model[i]);
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
    function renderHTML(block, func) {
        for(let i = 0; i < block.length; i++) {

            function eachBlendSupply (supply) {
                supply.childElement.forEach(function (item, inc) {
                    supply.element.append(item.element);
                    if(item.childElement !== 0) {
                        eachBlendSupply(item);
                    }
                });
            }

            if(block[i].childElement.length !== 0) {
                eachBlendSupply(block[i]);
            }

            if(block[i].spacesLength === 0) {
                func(i);
            }
        }
    }
    function findBlendName (supply, prop, fn) {

        let result = 0;
        (supply.childElement || supply).forEach(function (item, inc) {


            if(item.blendName === prop || prop === null) {
                if(fn !== undefined) {
                    fn(item);
                }
                result =  item;
            }

            if(item.childElement !== 0) {
                findBlendName(item, prop, fn);
            }

        });

        return result;
    }
    this.updateEvent = new Event("Blend.update");
    this.update = function () {
        _dump_ = [];
        return document.dispatchEvent(_this_.updateEvent);
    };
    this.class = function (el) {
        return new el();
    };
    this.component = function () {

        let _this = this,
            _view = [],
            _modelObj = {};

        if(_this.model !== undefined) {
            _this.model.call(_modelObj);
        }

        if(_this.view !== undefined) {
            createBlendSupply(_this.view.call(_modelObj, _modelObj), _view);
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
    this.reg = function (BlendSupply) {

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
                        item.childElement.push(block[0]);
                    });

                    return {
                        deliver: function () {
                            block[0].element.setAttribute("data-blend-name", block[0].blendName);
                        },
                        renameChild: function (nm, newName) {
                            findBlendName (block[0].childElement, nm, function (item) {
                                item.blendName = newName;
                                item.blendSupply = item.blendSupply.replace("(" + nm + ")","(" +  newName + ")");
                            });
                        },
                        innerBefore: function (text) {
                            block[0].element.prepend(text);
                        },
                        innerAfter: function (text) {
                            block[0].element.append(text);
                        },
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
                        attr : function (key, val) {
                            block[0].element.setAttribute(key, val);
                        },
                        addClass: function (className) {
                            block[0].element.classList.add(className);
                        },
                        removeClass: function (className) {
                            block[0].element.classList.remove(className);
                        },
                        inner: function (content) {
                            block[0].element.innerHTML = content;
                        },
                    }
                }
            }
        }
        function getEvent(target, prop, func) {
            let bef = null;
            document.addEventListener("Blend.update", function () {
                if(prop.before !== undefined) {
                    bef = prop.before.call(_this_.reg(BlendSupply));
                }
                if(typeof target === "string") {
                    findBlendName (BlendSupply, target, function(item) {
                        return func(item, bef);
                    });
                }else if(Array.isArray(target)) {
                    for(let i = 0; i < target.length; i++) {
                        findBlendName (BlendSupply, target[i], function(item) {
                            return func(item, i);
                        });
                    }
                }
            });

            _this_.update();
        }
        function eventProp (prop, i) {
            prop.run.call(_this_.reg(BlendSupply), i);
            if(prop.update === true) {
                _this_.update();
            }
        }

        return {
            it: function(BlendName) {
                let _input = null;

                findBlendName (BlendSupply, BlendName, function (item) {
                    _input = item;
                });

                return {
                    rename: function (newName) {
                        findBlendName (BlendSupply, _input, function (item) {
                            item.blendName = newName;
                            item.blendSupply = item.blendSupply.replace("(" + _input + ")","(" +  newName + ")");
                        });
                    },
                    value: {
                        get: function () {
                            return _input.element.value;
                        },
                        set: function (val) {
                            return _input.element.value = val;
                        }
                    },
                    remove: function () {
                        _input.element.remove();
                    },
                    create: function (output) {
                        return addElement("create", _input, output);
                    },
                    append: function (output) {
                        return addElement("append", _input, output);
                    },
                    prepend: function (output) {
                        return addElement("prepend", _input, output);
                    },
                    refactor: function (output) {

                        let _output = [];

                        findBlendName (BlendSupply, output, function (item) {
                            _output = item;
                        });

                        _input.element.replaceWith(_output.element);
                    },
                    childIndex : function (name) {

                        let index;

                        for(let i = 0; i <  _input.childElement.length; i++) {
                            if(_input.childElement[i].blendName === name) {
                                index = i
                            }
                        }

                        return i;
                    },
                    childLength : function () {
                        return _input.childElement.length;
                    },
                    attr: {
                        set : function (name, value) {
                            _input.element.setAttribute(name, value);
                        },
                        get : function (name) {
                            return _input.element.getAttribute(name);
                        }
                    },
                    inner: function (content) {
                        _input.element.innerHTML = content;
                    },
                    innerAfter: function (content) {
                        _input.element.append(content);
                    },
                    innerBefore: function (content) {
                        _input.element.prepend(content);
                    },
                    redraw: function (BlendHtml) {
                        let block = [];

                        createBlendSupply(BlendHtml, block);

                        renderHTML(block, function (i) {
                            _input.element.replaceWith(block[i].element);
                        });
                    }
                }
            },
            build: function (arr) {
                createBlendSupply(arr, BlendSupply);
            },
            onEvent: function (target) {
                return {
                    click: function (prop) {
                        return getEvent(target, prop, function (item, i) {
                            item.element.onclick = function () {
                                eventProp(prop, i);
                            };
                        });
                    },
                    keyup: function (prop) {
                        return getEvent(target, prop, function (item, i) {
                            item.element.onkeyup = function () {
                                eventProp(prop, i);
                            };
                        });
                    },
                    change: function (prop) {
                        return getEvent(target, prop, function (item, i) {
                            item.element.onchange = function () {
                                eventProp(prop, i);
                            };
                        });
                    },
                    keydown: function (prop) {
                        return getEvent(target, prop, function (item, i) {
                            item.element.onkeydown = function () {
                                eventProp(prop, i);
                            };
                        });
                    }
                }
            },
            blendSupply: BlendSupply
        }
    };

}

const blend = new Blend();