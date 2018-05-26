    this.component = function () {

        let _this = this,
            _view = [],
            _modelObj = {};

        if(_this.model !== undefined) {
            _this.model.call(_modelObj);
        }

        if(_this.view !== undefined) {
            createfluSupply(_this.view.call(_modelObj, _modelObj), _view);
        }

        return {
            render: function (el) {
                element = document.querySelector(el);

                renderHTML(_view, function (i) {
                    element.append(_view[i].element);
                });

                if(_this.supply !== undefined) {
                    createfluSupply(_this.supply.call(_modelObj), fluSupply);
                }

                fluSupply = fluSupply.concat(_view);

                if(_this.controller !== undefined) {
                    _this.controller.call(fluSupply, _modelObj);
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