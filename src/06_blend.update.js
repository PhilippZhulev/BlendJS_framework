
    /*
    Update Event.
    */
    this.updateEvent = new Event("Blend.update");
    this.update = function () {
        return document.dispatchEvent(_this_.updateEvent);
    };
