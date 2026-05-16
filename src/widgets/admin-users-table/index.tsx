"use client";

import { useAdminUsers } from "@/features/admin-manage-users";
import type { UserRole } from "@/shared/types/roles";
import { styles } from "./styles";
import { TableHeader } from "./TableHeader";
import { UserRow } from "./UserRow";
import type { AdminUser } from "@/entities/user/types";

interface AdminUsersTableProps {
  users: AdminUser[];
  actorId: string;
  actorRole: UserRole;
}

export const AdminUsersTable = ({ users: initialUsers, actorId, actorRole }: Readonly<AdminUsersTableProps>) => {
  const { users, loadingId, changeRole, removeUser } = useAdminUsers(initialUsers);

  return (
    <div className={styles.wrap}>
      <TableHeader />
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          actorId={actorId}
          actorRole={actorRole}
          isLoading={loadingId === user.id}
          onChangeRole={changeRole}
          onDelete={removeUser}
        />
      ))}
    </div>
  );
};
