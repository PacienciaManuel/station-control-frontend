// const researches
const RESEARCHES_PARAMETER_NAME = "researches";

class SessionStorageManager {
    
    getResearches(): string[] {
        const researches = window.sessionStorage.getItem(RESEARCHES_PARAMETER_NAME);
        if (!researches) return [];
        try {
            return JSON.parse(researches);
        } catch (error) {
            return [];
        }
    }
    
    addSearch(search: string): string[] {
        const researches = this.getResearches().filter(s => s.toLowerCase().trim() === search.toLowerCase().trim()).concat(search.trim());
        sessionStorage.setItem(RESEARCHES_PARAMETER_NAME, JSON.stringify(researches));
        return researches;
    }
}

const sessionStorageManager = new SessionStorageManager();
export default sessionStorageManager;