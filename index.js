let stopFetching = false;
let dataWasted = 0;
let abortController = new AbortController();

async function fetchImage() {
    try {
        // console.log('Fetching image...');
        const url = "https://picsum.photos/5000/5000";
        const res = await fetch(url, {
            signal: abortController.signal
        });

        const contentLength = res.headers.get('Content-Length');
        const imageSize = contentLength ? parseInt(contentLength) : 0;

        const dataInMB = imageSize * 0.000001;
        dataWasted += dataInMB;

        // console.log('Image fetched!');
        // console.log('Data wasted:', dataWasted.toFixed(2), 'MB');

        document.getElementById('dataWasted').innerText = dataWasted.toFixed(2) + ' MB';

        return dataWasted;
    } catch (error) {
        if (error.name === 'AbortError') {
            // console.log('Fetch aborted');
        } else {
            // console.error('Error fetching image:', error);
        }
        return false;
    }
}

async function startWasting() {
    let maxData = Number(document.getElementById('dataSize').value);
    let requestsCount = Number(document.getElementById('requestsCount').value);
    stopFetching = false;

    while (dataWasted < maxData && !stopFetching) {
        const promises = [];

        for (let i = 0; i < requestsCount; i++) {
            promises.push(fetchImage());
        }

        const results = await Promise.all(promises);
        if (results.some(result => result >= maxData)) {
            break;
        }
    }
}

async function run() {
    const btn = document.querySelector("button").innerText;
    if (btn === 'Waste It!') {
        dataWasted = 0;
        stopFetching = false;
        document.getElementById('dataWasted').innerText = '0 MB';
        // console.log('Wasting data...');
        document.querySelector("button").innerText = 'Stop';
        abortController = new AbortController(); // Create a new AbortController for the next run
        await startWasting();
        document.querySelector("button").innerText = 'Waste It!';
    } else {
        document.querySelector("button").innerText = 'Waste It!';
        abortController.abort(); // Abort the fetching process
        stopFetching = true; // Stop the while loop in `startWasting`
    }
}
