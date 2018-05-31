# BlendJS_framework 0.1.1 

JavaScript open source library for building user interfaces.

#### A Simple Component

###### HTML
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>blendJs</title>
        <link rel="stylesheet" href="public/style.css">
    </head>
    <body>

        <div class="app"></div>

        <script src="dist/blendCompile.js"></script>
        <script src="dist/blend.js"></script>
        <script type="text/blendjs" src="public/script.jsf"></script>
    </body>
</html>
```
###### JSF
```javascript
class InputOutput extends blend.component {
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
        const reg = blend.reg(this);

        function setName () {
            this.it("hello").redraw({{
                p>
                    b.ready>{data.title + data.name}
            }});
        }

        reg.onEvent("btn").click({
            run: setName
        });
    }
}

blend.class(InputOutput).render(".app");
```
### [DEMO](https://philippzhulev.github.io/BlendJS_framework/)

+ BlendJS can be used as a **view** and as a full **MVC framework**.You can write simple, easily modified components that can later be easily transferred to other applications.
+ The native **JSF** format, will allow you to easily generate dynamic HTML elements and integrate any data into them.
+ **blend.component** stores in itself the elements written by you, and you can freely use them repeatedly in other components.

**This is an alpha version of the product and at the moment it is being actively upgraded and improved.**
