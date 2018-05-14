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