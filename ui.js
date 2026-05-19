/**
 * ==================== UI CLASS (DOM Binding) ====================
 * Handles all UI interactions and DOM updates
 */
export class UI {
  constructor(design) {
    this.design = design;
    this.currentFileName = null;
    this.currentFileType = null;
    this.toastContainer = document.getElementById('toastContainer');
    this.elements = {
      // Import/Export View
      importExportView: document.getElementById('importExportView'),
      fileDisplay: document.getElementById('fileDisplay'),
      exportJsonBtn: document.getElementById('exportJson'),
      exportSvgBtn: document.getElementById('exportSvg'),
      importFileInput: document.getElementById('importFile'),
      importBtn: document.getElementById('importBtn'),
      
      // File Viewer View
      fileViewerView: document.getElementById('fileViewerView'),
      viewerTitle: document.getElementById('viewerTitle'),
      clearBtn: document.getElementById('clearBtn'),
      svgViewer: document.getElementById('svgViewer'),
      jsonViewer: document.getElementById('jsonViewer'),
      exportJsonFromViewer: document.getElementById('exportJsonFromViewer'),
      exportSvgFromViewer: document.getElementById('exportSvgFromViewer'),
    };
    
    this.validateElements();
  }

  validateElements() {
    const missing = [];
    for (const [key, elem] of Object.entries(this.elements)) {
      if (!elem) missing.push(key);
    }
    if (missing.length > 0) {
      console.warn(`Warning: Missing UI elements: ${missing.join(', ')}`);
    }
  }

  async init() {
    console.log("UI module initialized");
    this.attachEventListeners();
    this.updateDisplay();
  }

  attachEventListeners() {
    // Import/Export View buttons
    this.elements.exportJsonBtn?.addEventListener('click', () => this.handleExport('json'));
    this.elements.exportSvgBtn?.addEventListener('click', () => this.handleExport('svg'));
    this.elements.importBtn?.addEventListener('click', () => this.handleImport());
    
    // File Viewer buttons
    this.elements.clearBtn?.addEventListener('click', () => this.handleClear());
    this.elements.exportJsonFromViewer?.addEventListener('click', () => this.handleExport('json'));
    this.elements.exportSvgFromViewer?.addEventListener('click', () => this.handleExport('svg'));
  }

  async handleExport(format) {
    try {
      await this.design.exportDesign(format);
      this.showToast('File downloaded successfully', 'success');
    } catch (error) {
      this.showToast(`Failed to export: ${error.message}`, 'error');
    }
  }

  async handleImport() {
    const file = this.elements.importFileInput?.files[0];
    
    if (!file) {
      this.showToast('Please select a file first', 'error');
      return;
    }

    try {
      await this.design.importDesign(file);
      this.currentFileName = file.name;
      this.currentFileType = file.name.endsWith('.svg') ? 'svg' : 'json';
      this.showFileViewer();
      this.showToast('File uploaded successfully', 'success');
      this.elements.importFileInput.value = '';
    } catch (error) {
      this.showToast(`Failed to import: ${error.message}`, 'error');
    }
  }

  handleClear() {
    this.currentFileName = null;
    this.currentFileType = null;
    this.design.currentDesign = {
      id: "design-" + Date.now(),
      name: "Untitled Design",
      width: 800,
      height: 600,
      background: "#ffffff",
      created: new Date().toISOString()
    };
    this.showImportExportView();
  }

  showImportExportView() {
    this.elements.importExportView.style.display = 'block';
    this.elements.fileViewerView.style.display = 'none';
  }

  showFileViewer() {
    this.elements.importExportView.style.display = 'none';
    this.elements.fileViewerView.style.display = 'block';
    
    // Update title
    if (this.elements.viewerTitle) {
      this.elements.viewerTitle.textContent = this.currentFileName;
    }

    // Display file content
    if (this.currentFileType === 'svg') {
      this.displaySVG();
    } else {
      this.displayJSON();
    }
  }

  displaySVG() {
    const svgContent = this.design.currentDesign.svg;
    
    if (!svgContent) {
      this.elements.svgViewer.style.display = 'none';
      this.elements.jsonViewer.style.display = 'block';
      this.elements.jsonViewer.textContent = 'No SVG content available';
      return;
    }

    this.elements.svgViewer.style.display = 'block';
    this.elements.jsonViewer.style.display = 'none';
    this.elements.svgViewer.innerHTML = svgContent;
  }

  displayJSON() {
    const jsonData = this.design.currentDesign;
    
    this.elements.jsonViewer.style.display = 'block';
    this.elements.svgViewer.style.display = 'none';
    this.elements.jsonViewer.textContent = JSON.stringify(jsonData, null, 2);
  }

  updateDisplay() {
    // Update file display in import/export view
    if (this.elements.fileDisplay) {
      if (this.currentFileName) {
        this.elements.fileDisplay.innerHTML = `
          <div class="label">Current File</div>
          <div class="file-name">${this.currentFileName}</div>
        `;
        this.elements.fileDisplay.classList.add('has-file');
      } else {
        this.elements.fileDisplay.innerHTML = '<div class="file-empty">No file loaded</div>';
        this.elements.fileDisplay.classList.remove('has-file');
      }
    }
  }

  showToast(message, type = 'success') {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    this.toastContainer.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }
}
