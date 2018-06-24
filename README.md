# BlendJS 0.1.8
[![BlendJS](https://img.shields.io/badge/blendJS-alpha-green.svg)](/PhilippZhulev/BlendJS_framework/archive/0.1.1.zip)
![apm](https://img.shields.io/apm/l/vim-mode.svg)


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
        <script type="text/blend" src="public/script.jsf"></script>
    </body>
</html>
```
###### JSF
```javascript
class Timer extends blend.component {
    model () {
        this.title = "Timer";
        this.sec = 0;
    }
    view () {
        return {{
            h2>{this.title}
            div.timer
                p(time)
                    span>{this.sec} seconds
                    span> are you here.
            button(stop && click=stopFunc)[type=button]>Stop
        }}
    }
    controller(source) {
        const take = blend.watch(source);

        take.build({
            create: {{
                p(stoped)>countdown stopped.
            }}
        });

        this.countdown = () => {
            this.sec++;
            take.updateStates();
        }

        let count = setInterval(this.countdown, 1000);

        this.stopFunc = function() {
            clearInterval(count);

            take.it("time").refactor("stoped");
            take.it("stop").remove();
        }
    }
}

blend.class(Timer).render(".app");

```
## [DEMO](https://philippzhulev.github.io/BlendJS_framework/)

+ BlendJS can be used as a **view** and as a full **MVC framework**.You can write simple, easily modified components that can later be easily transferred to other applications.
+ The native **JSF** format, will allow you to easily generate dynamic HTML elements and integrate any data into them.
+ **blend.component** stores in itself the elements written by you, and you can freely use them repeatedly in other components.

### Get started
Write "Hello world" application.
###### JSF
```javascript
class Hello extends blend.component {
    view () {
        return {{
            div.block#block_1[data-target=block_1]
                h1.title>Hello world!
        }}
    }
}

blend.class(Hello).render(".app");
```


**Readme is supplemented...**

**This is an alpha version of the product and at the moment it is being actively upgraded and improved.**
