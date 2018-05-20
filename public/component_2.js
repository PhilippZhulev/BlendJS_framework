class Test2 extends flu.component {

    //КОНТРОЛЛЕР
    controller(data) {
        const fluData = flu.find(data);

        let i = 0,
            el = null;


        fluData.onEvent("keyup", "add_val", function () {
            let val = this.getValue("add_val");

            if(el === null) {
                el = this.append("items_wrap", "item").supplement("item_" + i);
                el.renameChild("text", "text_"  +  i);
            }

            if(val.length < 8) {
                el.child("text_"  +  i).inner(val);
            }else if (val.length === 8){
                el.innerAfter("...");
            }
        });

        //добавить элемент
        fluData.click("create_1", function () {

            el.innerAfter(" (" + i + ")");
            el.attr("data-index", i);
            el = null;

            let control = this.append("item_" + i, "control").supplement("control_" + i);

            control.renameChild("edit", "edit_"  + i);
            control.renameChild("del", "del_"  + i);

            flu.update();
            i++;
        });

        //удалить элемент
        fluData.click("remove_1", function () {
            let val = this.getValue("remove_val");
            this.remove("item_" + val);
        });

        fluData.click("del_0", function () {
            this.remove("item_0");
        });
    }
}



