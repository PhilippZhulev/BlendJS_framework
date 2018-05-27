# flu.framework 0.0.7
#### A Simple Component

###### HTML
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>FluJs</title>
        <link rel="stylesheet" href="public/style.css">
    </head>
    <body>

        <div class="app"></div>

        <script src="dist/fluCompile.js"></script>
        <script src="dist/flu.js"></script>
        <script type="text/flujs" src="public/script.jsf"></script>
    </body>
</html>
```

```javascript
class InputOutput extends flu.component {

    model () {
        this.prop = "--Your Name--";
        this.title = "Hello world! I'm ";
    }

    view () {
        return {{
            h1(hello)
               span(out)>{this.prop}
            input[type=text](in)
        }}
    }

    controller(data) {
        const reg = flu.reg(this);

        reg.it("hello").innerBefore(data.title);

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

