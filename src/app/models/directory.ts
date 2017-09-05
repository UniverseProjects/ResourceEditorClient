export class Directory {
  path: string;
  name: string;
  children: Directory[] = [];

  toTreeNode(): any {
    return {
      id: this.path,
      name: this.name,
      children: this.children.map((child) => child.toTreeNode()),
    };
  }

}
