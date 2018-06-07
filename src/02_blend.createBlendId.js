    /*
    Create an id for items. 
    */
    function createBlendId () {
        return "blend_" + String(Math.floor(Math.random() * 1000)).substring(0, 5) + "_elm" + String(Math.floor(Math.random() * 2300)).substring(0, 5);
    }
