
    /*
    Update Event.
    */
    function createNewEvent(eventName) {
        if(typeof(Event) === 'function') {
            return event = new Event(eventName);
        }else{
            var event = document.createEvent('Event');
            return event.initEvent(eventName, true, true);
        }
    }

    this.updateEvent = createNewEvent("Blend.update");
    this.update = function () {
        document.dispatchEvent(_this_.updateEvent);
        eventCoolection();
    };
