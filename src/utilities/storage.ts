// Class service to manage localStorage
export class Storage {
  static set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify({ data: value }));
  }
  static get(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value).data : null;
  }
}
