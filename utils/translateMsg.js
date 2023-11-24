const translate = require("translate-google");
function MsgTranslator(text) {
  const tranObj = {
    a: 1,
    b: "1",
    c: text,
    d: [true, "true", "hi", { a: "hello", b: ["world"] }],
  };

  translate(tranObj, { to: "hi", except: ["a"] })
    .then((res) => {
      console.log(res.c);
      console.log(typeof res.c);
    })
    .catch((err) => {
      console.error(err);
    });
}
MsgTranslator("hello");
