function Flu () {
    const _this_ = this;

    let fluSupply = [];

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

    this.version = '1.0.2';

    this.updateEvent = new Event("flu.update");

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

    this.find = function (fluSupply) {
        return {
            refactor: function (input, output) {

                let _input = null,
                    _output = [];

                findFluName (fluSupply, input, function (item) {
                    _input = item;
                });

                findFluName (fluSupply, output, function (item) {
                    _output.push(item);
                });

                renderHTML(_output, function (i) {
                    _input.element.replaceWith(_output[i].element);
                });
            },
            append: function (input, output) {

                let _input = null,
                    _output = [];

                findFluName (fluSupply, input, function (item) {
                    _input = item;
                });

                findFluName (fluSupply, output, function (item) {
                    _output.push(item);
                });

                let elmClone,
                    fluSupplyClone;

                renderHTML(_output, function (i) {
                    let elm = _output[i].element;
                    fluSupplyClone = _output[i].fluSupply;

                    elmClone = elm.cloneNode(true);

                    _input.element.append(elmClone);
                });

                return {
                    innerBefore: function (text) {
                        elmClone.prepend(text);
                    },
                    attr : function (key, val) {
                        elmClone.setAttribute(key, val);
                    },
                    addClass: function (className) {
                        elmClone.add.classList(className);
                    },
                    removeClass: function (className) {
                        elmClone.remove.classList(className);
                    },
                    supplement: function (name) {
                        let block = [];
                        createfluSupply([fluSupplyClone], block);

                        block[0].fluName = name;
                        block[0].element = elmClone;

                        fluSupply.push(block[0]);

                        document.dispatchEvent(_this_.updateEvent);

                        return {
                            deliver: function () {
                                elmClone.setAttribute("data-flu-name", block[0].fluName);
                            }
                        }
                    }
                }
            },
            click : function(target, func) {
                findFluName (fluSupply, target, function(item) {
                    item.element.onclick = function () {
                        func.call(_this_.find(fluSupply));
                    };
                });
            },
            each: function(func) {
                let thisElement = this;
                document.addEventListener("flu.update", function() {
                    findFluName (fluSupply, null, function(item) {
                        func.call(_this_.find(fluSupply), item);
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
                return _input.element.value;
            },
            modify: function(input) {

            },
            fluSupply : fluSupply
        }
    };

    this.item = function (fluSupplyElement) {
        return {
            click : function(func) {
                fluSupplyElement.element.onclick = function () {
                    func.call(fluSupplyElement);
                };
            },
            className : function (className, func) {
                if(fluSupplyElement.classes !== 0) {
                    for(let i = 0; i < fluSupplyElement.classes.length; i++) {
                        if(fluSupplyElement.classes[i] === className) {
                            func(fluSupplyElement);
                        }
                    }
                }
            }
        }
    }
}

const flu = new Flu();



