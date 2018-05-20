    this.item = function (fluSupplyElement) {
        return {
            filterByClass : function (className, func) {
                if(fluSupplyElement.classes !== 0) {
                    for(let i = 0; i < fluSupplyElement.classes.length; i++) {
                        if(fluSupplyElement.classes[i] === className) {
                            func({
                                element : fluSupplyElement,
                                getAttr: function(name) {
                                    return fluSupplyElement.element.getAttribute(name);
                                }
                            });
                        }
                    }

                }
            }
        }
    };
