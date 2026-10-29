
export interface NavigationMenu {
  navigationMenuId: number;
  title: string;
  route: string | null;
  icon: string | null;
  parentMenuId: number | null;
  permissionId: number | null;
  permissionName: string | null;
  roleIds: number[];
  displayOrder: number;
  isActive: boolean;
  childMenus: NavigationMenu[];
}
