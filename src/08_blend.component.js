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
            createSource(_dump_.call(_modelObj, _modelObj), _view, "view");
        }

        return {
            render: function (el) {
                element = document.querySelector(el);

                renderHTML(_view, function (i) {
                    element.append(_view[i].element);
                });

                if(_this.supply !== undefined) {
                    createSource(_this.supply.call(_modelObj), Source);
                }

                Source = Source.concat(_view);

                if(_this.controller !== undefined) {
                    _this.controller.call(_modelObj, Source);
                    eventCoolection();
                }


                if(_this.onEvent !== undefined) {
                    _this.event.call(Source);
                }

                _this.Source = Source;

                return Source;
            },
            inheritance : function () {
                return Source;
            },
            clear: function () {
                Source = [];
                _this.Source = [];
                return _this.Source;
            }
        }
    };
