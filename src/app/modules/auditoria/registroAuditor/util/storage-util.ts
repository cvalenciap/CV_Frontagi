export default class StorageUtil {

  public static almacenarObjetoSession(key: string, value: any, ): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  public static almacenarVariableSession(key: string, value: any, ): void {
    sessionStorage.setItem(key, value);
  }

  public static recuperarObjetoSession(key: string): any {
    return JSON.parse(sessionStorage.getItem(key));
  }

  public static recuperarVariableSession(key: string): any {
    return sessionStorage.getItem(key);
  }

  public static removerSession(key: string): void {
    sessionStorage.removeItem(key);
  }

}
