import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import UsersTable from "./UserTable";

export default async function AdminUsersPage() {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      password: users.password, // add this
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-0.5">{allUsers.length} total users</p>
      </div>
      <UsersTable users={allUsers} />
    </div>
  );
}

// import { db } from "@/src/db";
// import { users } from "@/src/db/schema";
// import { desc } from "drizzle-orm";

// export default async function AdminUsersPage() {
//   const allUsers = await db
//     .select({
//       id: users.id,
//       name: users.name,
//       email: users.email,
//       role: users.role,
//       createdAt: users.createdAt,
//     })
//     .from(users)
//     .orderBy(desc(users.createdAt));

//   return (
//     <div className="p-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Users</h1>
//         <p className="text-sm text-gray-500 mt-0.5">{allUsers.length} total users</p>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-gray-100">
//                 <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</th>
//                 <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</th>
//                 <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Joined</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan={3} className="px-4 py-12 text-center text-gray-400">
//                     No users yet.
//                   </td>
//                 </tr>
//               ) : (
//                 allUsers.map((user) => (
//                   <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-[#08a05c] text-white text-xs font-bold flex items-center justify-center shrink-0">
//                           {user.name?.[0]?.toUpperCase() ?? "?"}
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">{user.name ?? "—"}</p>
//                           <p className="text-xs text-gray-400">{user.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
//                         user.role === "admin"
//                           ? "bg-red-50 text-red-500"
//                           : user.role === "seller"
//                           ? "bg-blue-50 text-blue-600"
//                           : "bg-gray-100 text-gray-500"
//                       }`}>
//                         {user.role ?? "customer"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-gray-500 text-xs">
//                       {user.createdAt
//                         ? new Date(user.createdAt).toLocaleDateString("en-US", {
//                             month: "short", day: "numeric", year: "numeric",
//                           })
//                         : "—"}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }