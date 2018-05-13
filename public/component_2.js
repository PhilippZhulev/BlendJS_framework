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
            el.supplement("new_" + i).deliver();
        });

        //удалить элемент
        flu.find(data).click("remove_1", function () {

            let val = this.value("remove_val");
            this.remove("new_" + val);

        });

        //перебрать элементы
        flu.find(data).each(function(el) {

            let _thisModel = this;

            //перебрать элементы
            flu.item(el).className("item", function(elm) {
                //клик по найденому элементу
                flu.item(elm).click(function () {
                    _thisModel.remove(this.fluName);
                });
            });

        });
    }

}



