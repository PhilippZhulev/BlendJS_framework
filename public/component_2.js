class Test2 extends flu.component {

    //КОНТРОЛЛЕР
    controller() {
        const reg = flu.reg(this);

        reg.onEvent.keyup({
            target: "add_val",
            run: function () {

            }
        });

        reg.onEvent.click({
            target: "create_1",
            update: true,
            run: function () {

            }
        });

        reg.onEvent.click({
            target: "remove_1",
            run: function () {

            }
        });

        reg.onEvent.click({
            target: "del_0",
            run: function () {

            }
        });
    }
}



