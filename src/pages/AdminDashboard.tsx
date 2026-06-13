import { Link } from "react-router-dom";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Tags,
  Users,
} from "lucide-react";

const adminCards = [
  {
    title: "Food Management",
    description: "Create, update and remove menu items.",
    to: "/manage-foods",
    icon: Boxes,
    accent: "bg-amber-50 text-amber-700",
  },
  {
    title: "Categories",
    description: "Organize food items into clear sections.",
    to: "/manage-categories",
    icon: Tags,
    accent: "bg-blue-50 text-blue-700",
  },
  {
    title: "Orders",
    description: "Track orders and update fulfilment status.",
    to: "/manage-orders",
    icon: ClipboardList,
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Customers",
    description: "View users registered in the system.",
    to: "/manage-users",
    icon: Users,
    accent: "bg-violet-50 text-violet-700",
  },
];

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-amber-600">
                <LayoutDashboard size={16} />
                Admin Workspace
              </p>

              <h1 className="mt-2 text-4xl font-black text-gray-950">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-gray-600">
                Manage the operational parts of the online food ordering
                system from a focused control center.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Back Home
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {adminCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.to}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-md ${card.accent}`}
                >
                  <Icon size={22} />
                </span>

                <h2 className="mt-5 text-xl font-black text-gray-950">
                  {card.title}
                </h2>

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-600">
                  {card.description}
                </p>

                <span className="mt-5 inline-flex text-sm font-bold text-gray-950">
                  Open
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
