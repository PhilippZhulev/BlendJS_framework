class Todo extends flu.component {

    view () {
        return [
            "h1>Input List",
            "ul.todo_wrap(wrap)",
            "input[type=text](in)",

            "h1>Output List",
            "ul.todo_output(out)",
        ]
    }

    supply() {
        return [
            "li.todo_item(item)"
        ]
    }

    controller() {
        const reg = flu.reg(this);

        let i = 0,
            arr = [];

        reg.onEvent.change({
            target: "in",
            update: true,
            run: function () {
                let name = "item_" + i;

                let val = this.value("in"),
                    el = this.append("wrap", "item").supplement(name);

                el.inner(val.get());
                val.set("");
                i++;

                arr.push(name);
            }
        });

        reg.onEvent.click({
            target: arr,
            run: function (i) {
                this.remove(arr[i]);
                this.append("out", arr[i]);
            }
        });
    }

}

flu.class(Todo).render(".app");