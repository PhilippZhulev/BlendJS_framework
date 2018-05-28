    this.updateEvent = new Event("Blend.update");
    this.update = function () {
        _dump_ = [];
        return document.dispatchEvent(_this_.updateEvent);
    };