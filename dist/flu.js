/*
* Copyright (c) 2018, Philipp Zhulev.
*/

function Flu () {

    this.version = '0.0.8';

    const _this_ = this;

    let fluSupply = [],
        _dump_ = [];


    function createFluId () {
        return "flu_" + String(Math.floor(Math.random() * 1000)).substring(0, 5) + "_elm" + String(Math.floor(Math.random() * 2000)).substring(0, 5);
    }
    function createfluSupply(arr, b) {

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

                let fluId = createFluId();

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
                    let attrArr = attr.split(",") || attr;

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

                proto_model.push({
                    fluName: ref,
                    id: id,
                    flu_id: fluId,
                    childElement: [],
                    spacesLength: spacesLen.length || 0,
                    element: el,
                    classes: className,
                    sim: sim,
                    fluSupply: arr[i]
                });

                if(proto_model[i - 1] !== undefined && proto_model[i - 1].spacesLength !== undefined) {
                    if(proto_model[i].spacesLength > proto_model[i - 1].spacesLength) {
                        proto_model[i - 1].childElement.push(proto_model[i]);
                        parentMem = proto_model[i - 1];
                    }
                    if(proto_model[i].spacesLength === proto_model[i - 1].spacesLength) {
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

            function eachFluSupply (supply) {
                supply.childElement.forEach(function (item, inc) {
                    supply.element.append(item.element);
                    if(item.childElement !== 0) {
                        eachFluSupply(item);
                    }
                });
            }

            if(block[i].childElement.length !== 0) {
                eachFluSupply(block[i]);
            }

            if(block[i].spacesLength === 0) {
                func(i);
            }
        }
    }
    function findFluName (supply, prop, fn) {

        let result = 0;
        (supply.childElement || supply).forEach(function (item, inc) {


            if(item.fluName === prop || prop === null) {
                if(fn !== undefined) {
                    fn(item);
                }
                result =  item;
            }

            if(item.childElement !== 0) {
                findFluName(item, prop, fn);
            }

        });

        return result;
    }
    this.updateEvent = new Event("flu.update");
    this.update = function () {
        _dump_ = [];
        return document.dispatchEvent(_this_.updateEvent);
    };
    this.class = function (el) {
        return new el();
    };
    this.component = function () {

        let _this = this,
            _view = [];

        if(this.view !== undefined) {
            createfluSupply(this.view(), _view);
        }

        return {
            render: function (el) {
                let element = document.querySelector(el);

                renderHTML(_view, function (i) {
                    element.append(_view[i].element);
                });

                if(_this.supply !== undefined) {
                    createfluSupply(_this.supply(), fluSupply);
                }

                fluSupply = fluSupply.concat(_view);

                if(_this.controller !== undefined) {
                    _this.controller.call(fluSupply, fluSupply);
                }

                if(_this.onEvent !== undefined) {
                    _this.event.call(fluSupply);
                }

                _this.fluSupply = fluSupply;

                return fluSupply;
            },
            inheritance : function () {
                return fluSupply;
            },
            clear: function () {
                fluSupply = [];
                _this.fluSupply = [];
                return _this.fluSupply;
            }
        }
    };
    this.reg = function (fluSupply) {

        function addElement(mytype, input, output) {
            let _input = null,
                _output = [];

            findFluName (fluSupply, input, function (item) {
                _input = item;
            });

            findFluName (fluSupply, output, function (item) {
                _output.push(item);
            });

            let elmClone,
                fluSupplyClone,
                childClone;

            renderHTML(_output, function (i) {
                let elm = _output[i].element;

                fluSupplyClone = _output[i].fluSupply;
                childClone = _output[i].childElement;
                elmClone = elm.cloneNode(true);

                if(mytype === "append") {
                    _input.element.append(elmClone);
                }else if(mytype === "create") {
                    _input.element.innerHTML = elmClone;
                }
            });

            return {
                supplement: function (name) {
                    let block = [],
                        fsArr = [fluSupplyClone];

                    for(let i = 0; i < childClone.length; i++) {
                        fsArr.push(childClone[i].fluSupply);
                    }

                    createfluSupply(fsArr, block);

                    block[0].fluName = name;
                    block[0].element = elmClone;

                    elmClone.childNodes.forEach(function (item, i) {
                        block[0].childElement[i].element = item;
                    });

                    findFluName (fluSupply, input, function (item) {
                        item.childElement.push(block[0]);
                    });

                    return {
                        deliver: function () {
                            block[0].element.setAttribute("data-flu-name", block[0].fluName);
                        },
                        renameChild: function (nm, newName) {
                            findFluName (block[0].childElement, nm, function (item) {
                                item.fluName = newName;
                                item.fluSupply = item.fluSupply.replace("(" + nm + ")","(" +  newName + ")");
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
                                    findFluName (block[0].childElement, name, function (item) {
                                        item.element.innerHTML = content;
                                    });
                                },
                                innerAfter: function (content) {
                                    findFluName (block[0].childElement, name, function (item) {
                                        item.element.append(content);
                                    });
                                },
                                innerBefore: function (content) {
                                    findFluName (block[0].childElement, name, function (item) {
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
        function getEvent(prop, func) {
            let bef = null;
            if(prop.before !== undefined) {
                bef = prop.before.call(_this_.reg(fluSupply));
            }
            document.addEventListener("flu.update", function () {
                findFluName (fluSupply, prop.target, function(item) {
                    return func(item, bef);
                });
            });

            _this_.update();
        }
        function eventProp (prop, before) {
            prop.run.call(_this_.reg(fluSupply), before);
            if(prop.update === true) {
                _this_.update();
            }
        }

        return {
            target: function(fluName) {
                let _input = null;
                findFluName (fluSupply, fluName, function (item) {
                    _input = item;
                });

                return {
                    childIndex : function (name) {
                        let index;
                        for(let i = 0; i <  _input.childElement.length; i++) {
                            if(_input.childElement[i].fluName === name) {
                                index = i
                            }
                        }

                        return i;
                    },
                    childLength : function () {
                        return _input.childElement.length;
                    },
                }
            },
            refactor: function (input, output) {

                let _input = null,
                    _output = [];

                findFluName (fluSupply, input, function (item) {
                    _input = item;
                });

                findFluName (fluSupply, output, function (item) {
                    _output = item;
                });

                _input.element.replaceWith(_output.element);
            },
            append: function (input, output) {
                return addElement("append", input, output);
            },
            create: function (input, output) {
                return addElement("create", input, output);
            },
            rename: function (input, newName) {
                findFluName (fluSupply, input, function (item) {
                    item.fluName = newName;
                });
            },
            onEvent : {
                click: function (prop) {
                    return getEvent(prop, function (item, before) {
                        item.element.onclick = function () {
                            eventProp (prop, before);
                        };
                    });
                },
                keyup: function (prop) {
                    return getEvent(prop, function (item, before) {
                        item.element.onkeyup = function () {
                            eventProp (prop, before);
                        };
                    });
                },
            },
            levelUp: function(func) {
                let thisElement = this;
                document.addEventListener("flu.update", function() {
                    findFluName (fluSupply, null, function(item) {
                        func.call(_this_.item(item), item);
                    });
                });
            },
            remove: function (input) {
                let _input = null;

                findFluName (fluSupply, input, function (item) {
                    _input = item;
                });

                _input.element.remove();
            },
            value: function (input) {
                let _input = null;
                findFluName (fluSupply, input, function (item) {
                    _input = item;
                });
                return {
                    get: function () {
                        return _input.element.value;
                    },
                    set: function (val) {
                        return _input.element.value = val;
                    }
                };
            },
            fluSupply : fluSupply
        }
    };
    this.item = function (fluSupplyElement) {
        return {
            filterByClass : function (className, func) {
                if(fluSupplyElement.classes !== 0) {
                    for(let i = 0; i < fluSupplyElement.classes.length; i++) {
                        if(fluSupplyElement.classes[i] === className) {
                            func({
                                element : fluSupplyElement,
                                getAttr: function(name) {
                                    return fluSupplyElement.element.getAttribute(name);
                                }
                            });
                        }
                    }

                }
            }
        }
    };

}

const flu = new Flu();