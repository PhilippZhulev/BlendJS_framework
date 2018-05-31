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
                        let clones = 0;
                        for(let ind = 0; ind < item.childElement.length; ind++) {
                            if(item.childElement[ind].blendName.indexOf(name) !== -1) {
                                block[0].blendName = name + "_" + clones++;
                            }
                        }

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
                        attr: function (key, val) {
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
            });

            _this_.update();
        }
        function eventProp (prop, e) {
            prop.run.call(_this_.reg(BlendSupply), e);
            if(prop.update === true) {
                _this_.update();
            }
        }
        function search(s, stype) {
            let result = undefined;
            findBlendName (BlendSupply, s, function (item) {
                result = item;
            }, stype);

            return result;
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
                    },
                    item: _input,
                    element: _input.element
                }
            },
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
            searchId: function (id) {
                return search(id, "id");
            },
            searchClass: function (className) {
                return search(className, "class");
            },
            searchBlendId: function (id) {
                return search(id, "blendId");
            },
            build: function (arr) {
                createBlendSupply(arr, BlendSupply);
            },
            onEvent: function (target) {
                return {
                    click: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onclick = function () {
                                eventProp(prop, e);
                            };
                        });
                    },
                    keyup: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onkeyup = function () {
                                eventProp(prop, e);
                            };
                        });
                    },
                    change: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onchange = function () {
                                eventProp(prop, e);
                            };
                        });
                    },
                    keydown: function (prop) {
                        return getEvent(target, prop, function (item, e) {
                            item.element.onkeydown = function () {
                                eventProp(prop, e);
                            };
                        });
                    }
                }
            },
            blendSupply: BlendSupply
        }
    };
