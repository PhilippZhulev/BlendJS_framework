
    /*
    Update Event.
    */
    this.updateEvent = new Event("Blend.update");
    this.update = function () {
        document.dispatchEvent(_this_.updateEvent);
        eventCoolection();
    };
