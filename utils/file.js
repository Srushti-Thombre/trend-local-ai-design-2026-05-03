// ====================== EXPORT FUNCTIONS ======================

/**
 * Export design data to different formats
 */
export async function exportTo(data, format) {
    if (!data) {
        throw new Error("No design data to export!");
    }

    // Added validation (Copilot suggestion improved)
    if (typeof format !== 'string' || format.trim() === '') {
        throw new Error("Export format must be a non-empty string (e.g., 'json' or 'svg')");
    }

    const normalizedFormat = format.toLowerCase();

    switch (normalizedFormat) {
        case 'json':
            return exportToJSON(data);

        case 'svg':
            return exportToSVG(data);

        default:
            throw new Error(`Format '${format}' is not supported yet. Supported formats: json, svg`);
    }
}

// JSON Export - Easiest and most important
function exportToJSON(data) {
    const jsonString = JSON.stringify(data, null, 2); // 2 spaces for nice formatting
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, 'design.json');
    return blob;
}

// SVG Export (Basic version - we'll improve later)
function exportToSVG(data) {
    // If SVG was imported, export the imported SVG
    if (data.svg) {
        const blob = new Blob([data.svg], { type: 'image/svg+xml' });
        downloadFile(blob, 'design.svg');
        return blob;
    }
    
    // Otherwise, create a placeholder
    const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" fill="#666">Your Design Here</text>
    </svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    downloadFile(blob, 'design.svg');
    return blob;
}

// ====================== IMPORT FUNCTIONS ======================

/**
 * Import file based on its type
 */
async function importFrom(file) {
    if (!file) return null;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    switch (fileExtension) {
        case 'json':
            return await importFromJSON(file);
        
        case 'svg':
            return await importFromSVG(file);
        
        default:
            throw new Error(`File type .${fileExtension} is not supported yet.`);
    }
}

async function importFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                resolve(data);
            } catch (err) {
                reject(new Error("Invalid JSON file"));
            }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
}

async function importFromSVG(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            resolve({
                type: "svg",
                content: e.target.result,
                name: file.name
            });
        };

        reader.onerror = () => {
            reject(new Error(`Failed to read SVG file: ${file.name}`));
        };

        reader.readAsText(file);
    });
}

// Helper function to download files
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export { importFrom };