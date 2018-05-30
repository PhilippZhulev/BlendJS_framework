    function findBlendName (supply, prop, fn, type) {
        let searchType,
            result = 0;
        (supply.childElement || supply).forEach(function (item, inc) {

            if(type === undefined) {
                searchType = item.blendName;
            }else if (type === "id") {
                searchType = item.id;
            }else if (type === "blendId") {
                searchType = item.blend_id;
            }

            if (type !== "class") {
                if(searchType === prop || prop === null) {
                    if(fn !== undefined) {
                        fn(item);
                    }
                    result =  item;
                }
            }else {
                for(let i = 0; i < item.classes.length; i++) {
                    if(item.classes[i] === prop) {
                        if(fn !== undefined) {
                            fn(item);
                        }
                        result =  item;
                    }
                }
            }


            if(item.childElement !== 0) {
                findBlendName(item, prop, fn);
            }

        });

        return result;
    }