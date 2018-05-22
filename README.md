# flu.framework 0.0.7
#### A Simple Component
```javascript
    class InputOutput extends flu.component {
    
        view () {
            return [
                "h1(hello)",
                "   span(out)>...",
                "input[type=text](in)"
            ]
        }
    
        controller() {
            const reg = flu.reg(this);
    
            reg.it("hello").innerBefore("Hello world! I'm ");
    
            reg.onEvent.keydown({
                target: "in",
                run: function () {
                    let val = this.value("in").get();
    
                    this.it("out").inner(val);
                }
            });
        }
    
    }
    
    flu.class(InputOutput).render(".app");
```

[DEMO](https://philippzhulev.github.io/flu/)

#### TODO list
```javascript
class Todo extends flu.component {

    view () {
        return [
            "h1>TODO List",
            "ul.todo_wrap(wrap)",
            "input[type=text](in)"
        ]
    }

    supply() {
        return [
            "li.todo_item(item)"
        ]
    }

    controller() {
        const reg = flu.reg(this);
        let i = 0;

        reg.onEvent.change({
            target: "in",
            run: function () {
                let val = this.value("in"),
                     el = this.append("wrap", "item").supplement("item_" + i);

                el.inner(val.get());
                val.set("");
                i++;

                console.log(this.fluSupply);
            }
        });
    }

}

flu.class(Todo).render(".app");
```

[DEMO](https://philippzhulev.github.io/flu/demo_2.html)