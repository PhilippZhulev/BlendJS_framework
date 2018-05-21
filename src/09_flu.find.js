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
                        if(block[0].childElement[i] !== undefined) {
                            block[0].childElement[i].element = item;
                        }
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
                if(typeof prop.target === "string") {
                    findFluName (fluSupply, prop.target, function(item) {
                        return func(item, bef);
                    });
                }else if(Array.isArray(prop.target)) {
                    for(let i = 0; i < prop.target.length; i++) {
                        findFluName (fluSupply, prop.target[i], function(item) {
                            return func(item, i);
                        });
                    }
                }
            });

            _this_.update();
        }
        function eventProp (prop, i) {
            prop.run.call(_this_.reg(fluSupply), i);
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
                    }
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
                    return getEvent(prop, function (item, i) {
                        item.element.onclick = function () {
                            eventProp (prop, i);
                        };
                    });
                },
                keyup: function (prop) {
                    return getEvent(prop, function (item, i) {
                        item.element.onkeyup = function () {
                            eventProp (prop, i);
                        };
                    });
                },
                change: function (prop) {
                    return getEvent(prop, function (item, i) {
                        item.element.onchange = function () {
                            eventProp (prop, i);
                        };
                    });
                },
                keydown: function (prop) {
                    return getEvent(prop, function (item, i) {
                        item.element.onkeydown = function () {
                            eventProp (prop, i);
                        };
                    });
                }
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