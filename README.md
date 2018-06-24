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
        <script type="text/blendjs" src="public/script.jsf"></script>
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
    controller(data) {
        const take = blend.watch(this);

        take.build({
            create: {{
                p(stoped)>countdown stopped.
            }}
        });

        data.time = function () {
            data.sec++;
            take.updateStates();
        }

        let count = setInterval(data.time, 1000);

        data.stopFunc = function() {
            clearInterval(count);

            take.it("time").refactor("stoped");
            take.it("stop").remove();
        }
    }
}

blend.class(Timer).render(".app");
```
### [DEMO](https://philippzhulev.github.io/BlendJS_framework/)

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
The page will display "**Hello world!**", and in html there will be such result:

###### HTML
```html
<div class="app">
    <div class="block" id="block_1" data-target="block_1">
        <h1 class="title">Hello world!</h1>
    </div>
</div>
```

From this it follows that the record:
```javascript
h1.title>Hello world!
```
will be:
```html
<h1 class="title">Hello world!</h1>
```
In "**jsf**" the syntax for generating html is written in double braces "**{{...}}**", and tabs and spaces are used to indicate inheritance. In general, the markup is similar to the syntax of the **jade** template engine.

The reverse function "**view ()**" will immediately render the html on the page and store the items in **blend.component**.

The blend component is written in a class that inherits methods and functions from the blend.component,
and later it is called like this:
```javascript
blend.class(Hello).render(".app");
```
method "**.render (".app")**" tells which element to render the result.

Now we want to add data to our application:
###### JSF
```javascript
class Hello extends blend.component {

    model () {
        this.hello = "Hello";
        this.name = " Nick";
    }

    view () {
        return {{
            div.block#block_1[data-target=block_1]
                h1.title>{this.hello + this.name}!
        }}
    }
}

blend.class(Hello).render(".app");
```
Result: **Hello Nick!**

The reverse function "model ()" is used exclusively for data processing, its context this is the object in which you can write the results,
"**view ()**" and "**supply ()**" accept the **model** object as context  "**this**", "controller ()" as the **first argument**.

Curly brackets "**{..}**" in "jsf" allow inserting elements of the js-code into an html structure.

Now add the controller
###### JSF
```javascript
class Hello extends blend.component {

    model () {
        this.hello = "Hello";
        this.name = " Nick";
        this.click = "Click!"
    }

    view () {
        return {{
            div.block#block_1[data-target=block_1]
                h1.title(in)>{this.hello + this.name}!
                button(btn)>Refactor!
        }}
    }

    controller(data) {
        const take = blend.watch(this);

        take.build({
            create: {{
                h2.my_click(out)>{data.click}
            }}
        });

        function clickRefactor () {
            take.it("in").refactor("out");
        }

        take.onEvent("btn").click({
            run: clickRefactor
        });
    }
}

blend.class(Hello).render(".app");
```
As a result, when you click on the "Refactor" button, "Hello Nick!" Will be replaced with "Click!".

You probably noticed the parentheses in the structure.
```javascript
h2.me_click(out)>
```
They specify blendName, this is the unique name of the element by which blend looks for the elements.
```javascript
this.it("in").refactor("out");
```
Here we find the element **(in)** and replace it with the element **(out)**.
```javascript
const take = blend.watch(this);
```
"**blend.watch(this)**" binds a set of elements for convenience is stored in a constant.
"**this**" in controller is the base of the elements of the class.
```javascript
take.onEvent("btn").click({
    run: clickRefactor
});
```
Bind an event to an element by "**blendName**". Can work with an array of names.
```javascript
take.onEvent(["btn1", "btn2"]).click({
    run: function(e) {
      console.log(e.index);
    }
});
```
In addition to the "**run**" property that triggers the function at the event, there are also the "**update: true**" properties - updates the events in the controller, and "**before: func ()**" performs the function when the event is initialized.

The method "**take.build**" allows you to create an element and add it to the database, without drawing it on the page.
```javascript
take.build({
    render: function() {
        return {{
            h2.my_click(out)>{data.click}
        }}
    }
});
```

**Readme is supplemented...**

**This is an alpha version of the product and at the moment it is being actively upgraded and improved.**
