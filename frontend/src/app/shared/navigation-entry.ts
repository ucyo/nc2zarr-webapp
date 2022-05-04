export class NavigationEntry {

  public routerLink: string;
  public displayName: string;

  constructor(routerLink: string, displayName: string) {
    this.routerLink = routerLink;
    this.displayName = displayName;
  }

  static getAllNavigationEntries(): NavigationEntry[] {

    return [
      new NavigationEntry('/json-workflow', 'JSON Workflow'),
      new NavigationEntry('/complete-conversion', 'Complete Conversion'),
    ];
  }
}
