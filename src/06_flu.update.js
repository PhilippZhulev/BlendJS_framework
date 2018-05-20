    this.updateEvent = new Event("flu.update");
    this.update = function () {
        _dump_ = [];
        return document.dispatchEvent(_this_.updateEvent);
    };