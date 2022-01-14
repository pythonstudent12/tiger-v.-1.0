const input = document.querySelector("input");
const ctx = new (AudioContext || webkitAudioContext)();
let src;

input.addEventListener("input", () => {
  let file = input.files[0];
  if (!/mp3$/.test(file.name)) {
    input.value = null;
    alert("Please select an MP3 file!");
    return;
  }

  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let result = reader.result;
    src = ctx.createBufferSource();
    let alr = ctx.createAnalyser();
    ctx.decodeAudioData(result, (buffer) => {
      let buf = new Uint8Array(alr.frequencyBinCount);

      const display = document.querySelector("canvas");
      const cctx = display.getContext("2d");
      display.width = "500";
      display.height = "500";

      function show() {
        cctx.fillStyle = "green";
        alr.getByteTimeDomainData(buf);
        cctx.clearRect(0, 0, 500, 500);
        for (let i = 0; i < 50; i++) {
          cctx.fillRect(i * 10, 250 - buf[i] / 2 + 5, 9, buf[i] + 5);
        }
        if (ctx.state == "running") {
          requestAnimationFrame(show);
        }
      }

      src.buffer = buffer;
      src.connect(alr).connect(ctx.destination);
      src.start();
      requestAnimationFrame(show);
    });
  });
  reader.readAsArrayBuffer(file);
});

function select() {
  if (ctx.state == "running") {
    src.stop();
  }
  document.querySelector("input").click();
}

function init() {
  let canvas = document.querySelector("canvas");
  let cctx = canvas.getContext("2d");
  canvas.width = "500";
  canvas.height = "500";
  
  for (let i = 0; i < 50; i++) {
    cctx.fillStyle = "white";
    cctx.fillRect(i * 10, 247.5, 9, 5);
  }
}

init();
