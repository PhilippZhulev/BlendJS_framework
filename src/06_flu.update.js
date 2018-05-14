    this.updateEvent = new Event("flu.update");

    this.update = function () {
        return document.dispatchEvent(_this_.updateEvent);
    };