    this.item = function (fluSupplyElement) {
        return {
            click : function(func) {
                fluSupplyElement.element.onclick = function () {
                    console.log(1);
                    func.call(fluSupplyElement);
                };
            },
            className : function (className, func) {
                if(fluSupplyElement.classes !== 0) {
                    for(let i = 0; i < fluSupplyElement.classes.length; i++) {
                        if(fluSupplyElement.classes[i] === className) {
                            func(fluSupplyElement);
                        }
                    }
                }
            }
        }
    }