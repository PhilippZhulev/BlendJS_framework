class Test2 extends flu.component {

    //КОНТРОЛЛЕР
    controller() {
        const reg = flu.reg(this);

        let el = null,
            val,
            i = 0;

        reg.onEvent.keyup({
            target: "add_val",
            run: function (before) {
                val = this.value("add_val").get();

                if(el === null) {
                    el = this.append("items_wrap", "item").supplement("item_" + i);
                }

                if(val.length <= 10) {
                    el.child("text").inner(val);
                }
                if(val.length === 10) {
                    el.child("text").innerAfter("...");
                }

            }
        });

        reg.onEvent.click({
            target: "create_1",
            update: true,
            run: function () {
                this.value("add_val").set("");

                el.innerAfter(" (" + i + ")");
                i = this.target("items_wrap").childLength();
                el = null;
            }
        });

        reg.onEvent.click({
            target: "remove_1",
            run: function () {
                let reVal = this.value("remove_val").get();
                this.remove("item_" + reVal);
            }
        });

        reg .onEvent.click({
            target: "del_0",
            run: function () {

            }
        });
    }
}



