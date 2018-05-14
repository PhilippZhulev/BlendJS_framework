    this.find = function (fluSupply) {

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
                }
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
                    let block = [],
                        fsArr = [fluSupplyClone];

                    for(let i = 0; i < childClone.length; i++) {
                        fsArr.push(childClone[i].fluSupply);
                    }

                    createfluSupply(fsArr, block);

                    block[0].fluName = name;
                    block[0].element = elmClone;

                    findFluName (fluSupply, input, function (item) {
                        item.childElement.push(block[0]);
                    });

                    return {
                        deliver: function () {
                            elmClone.setAttribute("data-flu-name", block[0].fluName);
                        },
                        renameChild: function (nm, newName) {
                            findFluName (block[0].childElement, nm, function (item) {
                                item.fluName = newName;
                            });
                        }
                    }
                }
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
                    _output.push(item);
                });

                renderHTML(_output, function (i) {
                    _input.element.replaceWith(_output[i].element);
                });
            },
            append: function (input, output) {
                return addElement("append", input, output);
            },
            rename: function (input, newName) {
                findFluName (fluSupply, input, function (item) {
                    item.fluName = newName;
                });
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
            fluSupply : fluSupply
        }
    };