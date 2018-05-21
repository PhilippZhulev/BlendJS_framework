
class Test extends flu.component {

    //НАЧАЛЬНЫЙ ШАБЛОН ПРИЛОЖЕНИЯ
    view () {
        return [
            "div.btns__wrappper",
            "    div>Создать элемент",
            "    input.add_value[type=text](add_val)",
            "    button.create(create_1)>Новый элемент",

            "    div>Удалить по index",
            "    input.remove_value[type=text](remove_val)",
            "    button.remove(remove_1)>Удалить",
            "       span> элемент",

            "div.items__wrapper(items_wrap)"
        ]
    }

    //РЕЗЕРВ
    supply() {
        return [
            "div.item(item)",
            "   span(text)",

            "div.control(control)",
            "   button.edit(edit)>edit",
            "   button.del(del)>delete",

            "input.edit_value[type=text](edit_val)"
        ]
    }

}


