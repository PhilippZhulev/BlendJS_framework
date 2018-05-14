    function findFluName (supply, prop, fn) {

        let result = 0;
        (supply.childElement || supply).forEach(function (item, inc) {


            if(item.fluName === prop || prop === null) {
                if(fn !== undefined) {
                    fn(item);
                }
                result =  item;
            }

            if(item.childElement !== 0) {
                findFluName(item, prop, fn);
            }

        });

        return result;
    }