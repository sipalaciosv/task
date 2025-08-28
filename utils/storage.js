const KEY = 'taskapp:v1';


function safeParse(json, fallback) {
    try { return JSON.parse(json); } catch { return fallback; }
}


export const storage = {
    load() {
        const raw = localStorage.getItem(KEY);
        const data = safeParse(raw, null);
        if (!data) {
            const initial = { schema: 1, users: [], tasks: [], session: null };
            localStorage.setItem(KEY, JSON.stringify(initial));
            return initial;
        }
        return data;
    },
    save(data) {
        localStorage.setItem(KEY, JSON.stringify(data));
    },
    clear() {
        localStorage.removeItem(KEY);
    }
};