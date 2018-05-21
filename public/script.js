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