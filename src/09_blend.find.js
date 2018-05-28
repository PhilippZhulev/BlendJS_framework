    this.reg = function (BlendSupply) {

        function addElement(mytype, input, output) {
            let _input = null,
                _output = [];

            findBlendName (BlendSupply, input, function (item) {
                _input = item;
            });

            findBlendName (BlendSupply, output, function (item) {
                _output.push(item);
            });

            let elmClone,
                BlendSupplyClone,
                childClone;

            renderHTML(_output, function (i) {
                let elm = _output[i].element;

                BlendSupplyClone = _output[i].BlendSupply;
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
                        fsArr = [BlendSupplyClone];

                    for(let i = 0; i < childClone.length; i++) {
                        fsArr.push(childClone[i].BlendSupply);
                    }

                    createBlendSupply(fsArr, block);

                    block[0].BlendName = name;
                    block[0].element = elmClone;

                    elmClone.childNodes.forEach(function (item, i) {
                        if(block[0].childElement[i] !== undefined) {
                            block[0].childElement[i].element = item;
                        }
                    });

                    findBlendName (BlendSupply, input, function (item) {
                        item.childElement.push(block[0]);
                    });

                    return {
                        deliver: function () {
                            block[0].element.setAttribute("data-Blend-name", block[0].BlendName);
                        },
                        renameChild: function (nm, newName) {
                            findBlendName (block[0].childElement, nm, function (item) {
                                item.BlendName = newName;
                                item.BlendSupply = item.BlendSupply.replace("(" + nm + ")","(" +  newName + ")");
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
                    childIndex : function (name) {
                        let index;
                        for(let i = 0; i <  _input.childElement.length; i++) {
                            if(_input.childElement[i].BlendName === name) {
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
            refactor: function (input, output) {

                let _input = null,
                    _output = [];

                findBlendName (BlendSupply, input, function (item) {
                    _input = item;
                });

                findBlendName (BlendSupply, output, function (item) {
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
                findBlendName (BlendSupply, input, function (item) {
                    item.BlendName = newName;
                });
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
            remove: function (input) {
                let _input = null;

                findBlendName (BlendSupply, input, function (item) {
                    _input = item;
                });

                _input.element.remove();
            },
            value: function (input) {
                let _input = null;
                findBlendName (BlendSupply, input, function (item) {
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
            build: function (arr) {
                let result = [];
                let target = element;
                createBlendSupply(arr, result);

                return {
                    to: function (name) {
                        findBlendName (BlendSupply, name, function (item) {
                            target = item;
                        });
                    },
                    inner: function () {
                        renderHTML(result, function (i) {
                            element.innerHTML = result[i].element;
                        });
                    },
                    innerBefore: function () {
                        renderHTML(result, function (i) {
                            element.prepend(result[i].element);
                        });
                    },
                    innerAfter: function () {
                        renderHTML(result, function (i) {
                            element.append(result[i].element);
                        });
                    },
                }
            },
            BlendSupply: BlendSupply
        }
    };
