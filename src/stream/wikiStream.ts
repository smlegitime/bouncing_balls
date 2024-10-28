/**
 * Description: File that fetches Wikimedia streaming data. 
 * Runs on a separate worker thread.
 * @author Sybille Légitime, modified Oct 28, 2024
 */

const url: string = 'https://stream.wikimedia.org/v2/stream/page-create';
const eventSource = new EventSource(url);
const wikimediaObj: Record<string, number> = {};
const colors: Set<string> = new Set();
let colorsSize: number = 0;

/**
 * Updates the count of created Wikipedia pages under a specific domain.
 * Generates a color for each new object
 * @param dict 
 * @param key 
 * @returns 
 */
function updateCountAndGenerateColor(dict: Record<string, number>, key: string): string {
    if(key in dict) {
        dict[key]++;
    }
    else {
        dict[key] = 1;
        
        let randomColor = generateRandomColor();
        do {
            colors.add(randomColor);
            colorsSize++;
        } while(colors.size != colorsSize);

        return randomColor;
    }
}

/**
 * Generate random color
 * @returns Hex code for color
 */
function generateRandomColor(): string {
    const chars = '0123456789ABCDEF';
    let color = '#';
    
    for (let i = 0; i < 6; i++){
        color += chars[Math.floor(Math.random() * 16)];
    }
    return color;
}

// OnError event listener
eventSource.onerror = (error) => postMessage(`Encountered error. [ERROR]: ${error} `);

// OnMessage event listener
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const color = updateCountAndGenerateColor(wikimediaObj, data.database);
    postMessage({
        color: color,
        wikimediaObj
    });
}

