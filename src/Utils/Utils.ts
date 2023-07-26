import html2canvas from "html2canvas";

export async function getLyricsFromURL(url: string): Promise<SResponse> {

    const urlRegex = /https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]*/g;

    if (!urlRegex.test(url)) throw new Error("Invalid URL");

    const res = await fetch('https://spotify-lyric-api.herokuapp.com/?url=' + url);

    console.log('res: ', res);

    if (res.status === 404) throw new Error("Lyrics not found");
    if (res.status !== 200) throw new Error("Something went wrong");

    const data = await res.json();

    console.log('data: ', data);

    return data;
}

export function screenshotNode(node: HTMLElement, scale: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {

        // if on mobile
        // if (window.innerWidth <= 600) {

        // }

        html2canvas(node, {
            backgroundColor: null,
            scale: scale,
            imageTimeout: 0,
            onclone(document, element) {
                element.style.transform = 'none';
            },
        })
            .then(canvas => resolve(canvas.toDataURL('image/png')))
            .catch(err => reject(err));

    });
}

export function downloadData(data: string, filename: string, type: string) {
    const file = new Blob([data], { type: type });
    const a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

type SResponse = {
    error: boolean;
    message?: string;

    syncType?: string;

    lines?: {
        startTimeMs: string;
        words: string;
        syllables: string[];
        endTimeMs: string;
    }[];
}

export type {
    SResponse
}