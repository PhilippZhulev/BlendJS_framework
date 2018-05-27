# FluJS_framework 0.1.1 

JavaScript open source library for building user interfaces.

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
###### JSF
```javascript
class InputOutput extends flu.component {
    model () {
        this.title = "Hello";
        this.name = " Nick";
    }
    view () {
        return {{
            p(hello)>{this.title}
            button.my_btn(btn)>Click!
        }}
    }
    controller(data) {
        const reg = flu.reg(this);

        reg.onEvent("btn").click({
            run: function () {
                this.it("hello").redraw({{
                    p>
                        b.ready>{data.title + data.name}
                }});
            }
        });
    }
}

flu.class(InputOutput).render(".app");
```

[DEMO](https://philippzhulev.github.io/FluJS_framework/)

