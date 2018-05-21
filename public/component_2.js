class Test2 extends flu.component {

    //КОНТРОЛЛЕР
    controller() {
        const reg = flu.reg(this);

        let el = null,
            val,
            i = 0,
            text = [],
            del = [],
            edit = [],
            items = [];

        reg.onEvent.keyup({
            target: "add_val",
            run: function (before) {
                val = this.value("add_val").get();

                if(el === null) {
                    el = this.append("items_wrap", "item").supplement("item_" + i);

                    text.push("text_" + i);

                    el.renameChild("text", "text_" + i);
                }

                if(val.length <= 10) {
                    el.child(text[i]).inner(val);
                } else {
                    el.child(text[i]).innerAfter("...");
                }

            }
        });

        reg.onEvent.click({
            target: "create_1",
            update: true,
            run: function () {
                this.value("add_val").set("");

                el.innerAfter(" (" + i + ")");

                items.push("item_" + i);
                del.push("del_" + i);
                edit.push("edit_" + i);

                let control = this.append(items[i], "control").supplement("control_" + i);

                control.renameChild("del", del[i]);
                control.renameChild("edit", edit[i]);

                i = this.target("items_wrap").childLength();
                el = null;

                console.log(this.fluSupply);
            }
        });

        reg.onEvent.click({
            target: "remove_1",
            run: function () {
                let reVal = this.value("remove_val").get();
                this.remove("item_" + reVal);
            }
        });

        reg.onEvent.click({
            target: del,
            run: function (i) {
                this.remove(items[i]);
            }
        });

        reg.onEvent.click({
            target: edit,
            run: function (i) {
                this.value("edit_val").set("");
                this.refactor(text[i], "edit_val");
                this.target("edit_val").attr.set("data-target", text[i]);
            }
        });

        reg.onEvent.change({
            target: "edit_val",
            run: function () {
                let elem = this.target("edit_val").attr.get("data-target");
                let newVal = this.value("edit_val").get();

                this.target(elem).inner(newVal);
                this.refactor("edit_val", elem);
            }
        });
    }
}



