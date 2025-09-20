import { UserManagementDisplay, UserRoleDisplay } from '../features/generation/user-management';
import {
  UserManagementUserForm,
  UserManagementRoleForm,
} from '../services/components/UserManagementComponents';

export const userManagementComponentMap = {
  user: UserManagementDisplay,
  users: UserManagementDisplay,
  account: UserManagementDisplay,
  accounts: UserManagementDisplay,
  member: UserManagementDisplay,
  members: UserManagementDisplay,
  profile: UserManagementDisplay,
  profiles: UserManagementDisplay,
  directory: UserManagementDisplay,
  table: UserManagementDisplay,
  list: UserManagementDisplay,
  activity: UserManagementDisplay,
  feed: UserManagementDisplay,
  role: UserRoleDisplay,
  roles: UserRoleDisplay,
  permission: UserRoleDisplay,
  permissions: UserRoleDisplay,
  group: UserRoleDisplay,
  groups: UserRoleDisplay,
  team: UserRoleDisplay,
  teams: UserRoleDisplay,
  user_form: UserManagementUserForm,
  role_form: UserManagementRoleForm,
};
