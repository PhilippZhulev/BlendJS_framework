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
            document.addEventListener("flu.update", function () {
                findFluName (fluSupply, prop.target, function(item) {
                    return func(item);
                });
            });

            _this_.update();
        }
        function eventProp (prop) {
            prop.run.call(_this_.reg(fluSupply));
            if(prop.update === true) {
                _this_.update();
            }
        }

        return {
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
                    return getEvent(prop, function (item) {
                        item.element.onclick = function () {
                            eventProp (prop);
                        };
                    });
                },
                keyup: function (prop) {
                    return getEvent(prop, function (item) {
                        item.element.onkeyup = function () {
                            eventProp (prop);
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
            getValue: function (input) {
                let _input = null;
                findFluName (fluSupply, input, function (item) {
                    _input = item;
                });
                return _input.element.value;
            },
            fluSupply : fluSupply
        }
    };