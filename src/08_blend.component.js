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
