class Test2 extends flu.component {

    //КОНТРОЛЛЕР
    controller(data) {
        let i = 0;

        //добавить элемент
        flu.find(data).click("create_1", function () {

            i++;
            let el  = this.append("items_wrap", "item"),
                val = this.value("add_val");

            el.innerBefore(val);

            //добавить новый элемент во flu.component
            el.supplement("new_" + i).renameChild("edit", "edit_" + i);

            flu.update();
        });

        //удалить элемент
        flu.find(data).click("remove_1", function () {
            let val = this.value("remove_val");
            this.remove("new_" + val);
        });

        //перебрать элементы
        flu.find(data).each(function(el) {

            let _thisModel = this;

            flu.item(el).className("edit", function(element) {
                console.log(element);
                flu.item(element).click(function () {
                    _thisModel.remove(this.fluName);
                });
            });

        });
    }

}



