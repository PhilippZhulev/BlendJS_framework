    function findBlendName (supply, prop, fn) {

        let result = 0;
        (supply.childElement || supply).forEach(function (item, inc) {


            if(item.blendName === prop || prop === null) {
                if(fn !== undefined) {
                    fn(item);
                }
                result =  item;
            }

            if(item.childElement !== 0) {
                findBlendName(item, prop, fn);
            }

        });

        return result;
    }