import { AppData, AppVersion } from '../types';

const STORAGE_KEY = 'rse-app-storage-v2';
const CURRENT_VERSION: AppVersion = '2.0.0';

export const storageService = {
  load(): AppData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      
      const data = JSON.parse(raw);
      // Here we would check data.meta.version and migrate if needed
      // For now, we assume V2 is the only version
      return this.migrateIfNeeded(data);
    } catch (e) {
      console.error('Failed to load data', e);
      return null;
    }
  },

  save(data: AppData) {
    try {
      const toSave = {
        ...data,
        meta: {
          ...data.meta,
          version: CURRENT_VERSION,
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  },

  exportToJson(data: AppData) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `rse-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async importFromJson(file: File): Promise<AppData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (!this.validateSchema(json)) {
            reject(new Error('Invalid data schema'));
            return;
          }
          resolve(this.migrateIfNeeded(json));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  validateSchema(data: any): boolean {
    // Basic validation
    return (
      data &&
      typeof data === 'object' &&
      'settings' in data &&
      'axes' in data &&
      'indicators' in data
    );
  },

  migrateIfNeeded(data: any): AppData {
    // Placeholder for future migrations
    // If data.meta.version < CURRENT_VERSION, apply transforms
    if (!data.meta) {
        data.meta = { version: CURRENT_VERSION };
    }
    return data as AppData;
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
