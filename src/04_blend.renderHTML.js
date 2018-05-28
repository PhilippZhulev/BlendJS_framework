    function renderHTML(block, func) {
        for(let i = 0; i < block.length; i++) {

            function eachBlendSupply (supply) {
                supply.childElement.forEach(function (item, inc) {
                    supply.element.append(item.element);
                    if(item.childElement !== 0) {
                        eachBlendSupply(item);
                    }
                });
            }

            if(block[i].childElement.length !== 0) {
                eachBlendSupply(block[i]);
            }

            if(block[i].spacesLength === 0) {
                func(i);
            }
        }
    }