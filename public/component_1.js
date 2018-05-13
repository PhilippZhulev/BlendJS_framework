
class Test extends flu.component {

    //НАЧАЛЬНЫЙ ШАБЛОН ПРИЛОЖЕНИЯ
    view () {
        return [
            "div.btns__wrappper",
            "    div>Создать элемент",
            "    input.add_value[type=text](add_val)",
            "    button.create(create_1)>Cоздать",
            "    div>Удалить по index",
            "    input.remove_value[type=text](remove_val)",
            "    button.remove(remove_1)>Удалить",
            "       span> сейчас",
            "div.items__wrapper(items_wrap)",
        ]
    }

    //РЕЗЕРВ
    supply() {
        return [
            "div.item(item)>test",
            "   button.edit(edit)>edit"
        ]
    }

}


