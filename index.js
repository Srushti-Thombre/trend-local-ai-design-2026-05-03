import { design } from './design'
import { ai } from './ai'
import { ui } from './ui'
import { exportTo, importFrom } from './utils/file.js';

class LocalAiDesign {
  constructor() {
    this.design = new design()
    this.ai = new ai()
    this.ui = new ui()
  }

  async init() {
    try {
      await this.design.init()
      await this.ai.init()
      await this.ui.init()
    } catch (error) {
      console.error('Initialization error:', error)
      throw error; // Rethrow the error to prevent silent failures
    }
  }

  async run() {
    try {
      const designData = await this.design.getData()
      const aiSuggestions = await this.ai.getSuggestions(designData)
      await this.ui.render(aiSuggestions)
    } catch (error) {
      console.error('Runtime error:', error)
      throw error; // Rethrow the error to prevent silent failures
    }
  }
}

class Design {
  constructor() {
    // Basic in-memory storage for the design
    this.currentDesign = {
      id: "design-" + Date.now(),
      name: "Untitled Design",
      elements: [],        // Will hold shapes, text, images etc. later
      width: 800,
      height: 600,
      background: "#ffffff"
    };
  }

  async init() {
    console.log("Design module initialized");
    // We can load from localStorage later if needed
  }

  async getData() {
    return this.currentDesign;
  }

  // ====================== NEW METHODS FOR FILE SUPPORT ======================

  /**
   * Export current design to JSON or SVG
   */
  async exportTo(format) {
    try {
      const data = await this.getData();
      // Call the function from utils/file.js
      return await exportTo(data, format);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed: " + error.message);
    }
  }

  /**
   * Import design from a file
   */
  async importFrom(file) {
    try {
      const importedData = await importFrom(file);
      
      if (importedData) {
        // For JSON: replace current design
        if (importedData.type === "svg") {
          console.log("SVG import received (basic support for now)");
          this.currentDesign.elements = [{ type: "svg", content: importedData.content }];
        } else {
          this.currentDesign = { ...this.currentDesign, ...importedData };
        }
        
        console.log("Design imported successfully!");
        return this.currentDesign;
      }
    } catch (error) {
      console.error("Import failed:", error);
      alert("Import failed: " + error.message);
    }
  }
}

class Ai {
  async init() {
    // Initialize AI component
  }

  async getSuggestions(data) {
    // Get AI-powered design suggestions
  }
}

class Ui {
  async init() {
    // Initialize UI component
  }

  async render(suggestions) {
    // Render UI with AI suggestions
  }
}

const localAiDesign = new LocalAiDesign()
localAiDesign.init().then(() => localAiDesign.run())