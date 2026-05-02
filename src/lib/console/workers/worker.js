onmessage = (e) => {
  console.log("Worker: Message received: " + e.data);
  console.log("working...");

  setTimeout(() => {
    console.log("log (inside worker.js)");
    postMessage("returning from worker.js: ")

  }, 2000);

  
};