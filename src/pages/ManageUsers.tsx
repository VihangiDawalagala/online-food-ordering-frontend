import { useEffect, useState } from "react";
import { Mail, ShieldCheck, UserRound, Users } from "lucide-react";

import { getUsers } from "../api/userApi";
import type { User } from "../types";

function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <p className="font-semibold text-gray-700">
            Loading customers...
          </p>
        </div>
      </div>
    );
  }

  const adminCount = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-violet-700">
            <Users size={16} />
            People
          </p>
          <h1 className="mt-2 text-4xl font-black text-gray-950">
            Customers
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Review registered accounts and roles in the ordering system.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <UserRound className="text-violet-700" />
            <p className="mt-3 text-3xl font-black text-gray-950">
              {users.length}
            </p>
            <p className="text-sm font-semibold text-gray-500">
              Total Users
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <ShieldCheck className="text-amber-700" />
            <p className="mt-3 text-3xl font-black text-gray-950">
              {adminCount}
            </p>
            <p className="text-sm font-semibold text-gray-500">
              Admins
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <Users className="text-emerald-700" />
            <p className="mt-3 text-3xl font-black text-gray-950">
              {users.length - adminCount}
            </p>
            <p className="text-sm font-semibold text-gray-500">
              Customers
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-6 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <span className="inline-flex items-center gap-3 font-bold text-gray-950">
                          <span className="grid h-9 w-9 place-items-center rounded-md bg-violet-50 text-violet-700">
                            <UserRound size={17} />
                          </span>
                          {user.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          {user.email}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-md px-3 py-1 text-sm font-bold ${
                            user.role === "ADMIN"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
