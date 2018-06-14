    /*
    To draw html from an array of objects "blendSupply".
    */

    //TODO: Convert a recursive function to a loop in an array.

    function renderHTML(block, func, a) {
        function iterator (array, parent) {
            let item, index = 0, length = array.length;

            for (; index < length; index++) {
                    item = array[index];

                if(parent !== undefined) {
                    parent.append(item.element);
                }

                if (item.childElement.length !== 0) {
                    iterator(item.childElement, item.element);
                }

                if(array[index].spacesLength === 0 || a === true) {
                    func(index, item);
                }

                if(array[index].eventFunc !== null) {
                    _modelObj.eventCollection = []
                    _modelObj.eventCollection.push({
                        element: array[index].element,
                        func: array[index].eventFunc[1],
                        event: array[index].eventFunc[0]
                    });
                }
            }
        }

        iterator(block);
    }
