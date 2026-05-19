import { exportTo, importFrom } from './utils/file.js';

/**
 * ==================== DESIGN CLASS (Minimal) ====================
 * Core data model for designs
 */
export class Design {
  constructor() {
    this.currentDesign = {
      id: "design-" + Date.now(),
      name: "Untitled Design",
      width: 800,
      height: 600,
      background: "#ffffff",
      created: new Date().toISOString()
    };
  }

  async init() {
    console.log("Design module initialized");
  }

  async getData() {
    return this.currentDesign;
  }

  /**
   * Export current design to JSON or SVG
   */
  async exportDesign(format) {
    try {
      const data = await this.getData();
      return await exportTo(data, format);
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    }
  }

  /**
   * Import design from a file
   */
  async importDesign(file) {
    try {
      const importedData = await importFrom(file);
      
      if (importedData) {
        if (importedData.type === "svg") {
          console.log("SVG import received");
          this.currentDesign = { ...this.currentDesign, svg: importedData.content };
        } else {
          // For JSON: merge data
          this.currentDesign = { ...this.currentDesign, ...importedData };
        }
        
        console.log("Design imported successfully");
        return this.currentDesign;
      }
    } catch (error) {
      console.error("Import failed:", error);
      throw error;
    }
  }
}
