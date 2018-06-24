    /*
    controller methods
    */
    this.watch = function (Source) {

        //add ellements function.
        //for the methods "append, prepend, create"
        function addElement(mytype, input, output) {
            let _output = [];

            findBlendName (Source, output, function (item) {
                _output.push(item);
            });

            let elmClone,
                sourceClone,
                childClone;

            renderHTML(_output, function (i) {
                let elm = _output[i].element;

                sourceClone = _output[i].structure;
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
                //register in "Source" with a new name
                supplement: function (name) {
                    let block = [],
                        fsArr = [sourceClone];

                    for(let i = 0; i < childClone.length; i++) {
                        fsArr.push(childClone[i].structure);
                    }

                    createSource(fsArr, block);

                    block[0].blendName = name;
                    block[0].element = elmClone;

                    elmClone.childNodes.forEach(function (item, i) {
                        if(block[0].childElement[i] !== undefined) {
                            block[0].childElement[i].element = item;
                        }
                    });

                    findBlendName (Source, input.blendName, function (item) {
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
                                item.structure = item.structure.replace("(" + nm + ")","(" +  newName + ")");
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
                    bef = prop.before.call(_this_.watch(Source));
                }
                if(typeof target === "string") {
                    findBlendName (Source, target, function(item) {
                        return func(item, {
                            before: bef,
                            index: 0,
                            target: target
                        });
                    });
                }else if(Array.isArray(target)) {
                    for(let i = 0; i < target.length; i++) {
                        findBlendName (Source, target[i], function(item) {
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
            prop.run.call(_this_.watch(Source), e);
            if(prop.update === true) {
                _this_.update();
            }
        }

        //search
        function search(s, stype) {
            let result = undefined;
            findBlendName (Source, s, function (item) {
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
                        findBlendName (Source, BlendName[i], function (item) {
                            _input.push(item);
                        });
                    }
                }else {
                    findBlendName (Source, BlendName, function (item) {
                        _input = item;
                    });
                }

                return {
                    //draw an element
                    updateState: function() {
                        let block = [];

                        createSource(_dump_.call(_modelObj, _modelObj), block);

                        renderHTML(block, function (inc, item) {
                            function items(el) {
                                if(item.blendName === el.blendName) {
                                    el.element.replaceWith(item.element);

                                    el.id =      item.id;
                                    el.classes = item.classes;
                                    el.element = item.element;
                                    el.structure = item.structure;
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

                            createSource(typeof prop.render === "function" ? prop.render(prop.data[i], i) : prop.render, block);

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
                        findBlendName (Source, _input, function (item) {
                            item.blendName = newName;
                            item.structure = item.structure.replace("(" + _input + ")","(" +  newName + ")");
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

                        findBlendName (Source, output, function (item) {
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

                        createSource(BlendHtml, block);

                        renderHTML(block, function (i) {
                            _input.element.replaceWith(block[i].element);
                        });
                    },
                    item: _input,
                    el: _input.element
                }
            },
            updateStates: function() {
                let block = [];

                createSource(_dump_.call(_modelObj, _modelObj), block);

                let n = document.createElement("div");

                let items = element.childNodes;

                function supplyEach(a,b) {
                    for(let i = 0; i < a.length; i++) {
                        if(a[i].source === "view") {
                            if(a[i].structure !== b[i].structure) {
                                a[i].element.replaceWith(b[i].element);
                                a[i].element = b[i].element;
                                a[i].structure = b[i].structure;
                                a[i].classes = b[i].classes;
                                a[i].id = b[i].id;
                            }
                            if(a[i].childElement !== 0) {
                                supplyEach(a[i].childElement, b[i].childElement);
                            }
                        }
                    }
                }
                supplyEach(Source, block);
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
                supplyEach(Source);
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
            //create elements in "Source"
            build: function (prop) {
                if(prop.data === undefined) {
                    prop.data = [0];
                }
                for(let i = 0; i < prop.data.length; i++) {
                    let block = [];
                    if(prop.before !== undefined) {
                        prop.before(prop.data[i], i);
                    }
                    createSource(typeof prop.create === "function" ? prop.create(prop.data[i], i) : prop.create, Source);
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
            blendSource: Source
        }
    };
