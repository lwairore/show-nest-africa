/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
    const START = Date.now();

    while (Date.now() < START + 5000) { }

    postMessage(data + 1);
});
