import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Card from "~/components/Card";
import Label from "~/components/Label";
import { PostPayload } from "~/models/posts.server";
import { getSession } from "~/models/session.server";
import { UserModel, getUsers } from "~/models/users.server";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("payload")) {
    redirect("/");
  }

  const users = await getUsers();
  const payload = session.get("payload") as PostPayload;

  const selectedUser = users.find(
    (user: UserModel) => user.id === payload?.userId
  );

  return json({
    ...payload,
    userDetails: selectedUser || {},
  });
};

export default function Profile() {
  const profile = useLoaderData<typeof loader>();

  return (
    <Card>
      <Link to="/" className="flex-row flex gap-2 items-center text-indigo-600 hover:text-indigo-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>Back
      </Link>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
        <div className="col-span-6 pb-4 border-b border-gray-400">
          <Label name="Title" />
          {profile.title}
        </div>

        <div className="col-span-6 pb-4 border-b border-gray-400">
          <div className="text-left text-sm leading-9 tracking-tight text-gray-900">
            <Label name="Body" />
            {profile.body}
          </div>
        </div>

        <div className="col-span-6 pb-4 border-b border-gray-400">
          <div className="text-left text-sm leading-9 tracking-tight text-gray-900">
            <Label name="Username" />
            {profile.userId} - {profile?.userDetails?.username}
          </div>
        </div>

        <div className="col-span-6 pb-4 border-b border-gray-400">
          <div className="text-left text-sm leading-9 tracking-tight text-gray-900">
            <Label name="Id" />
            {profile.id}
          </div>
        </div>
      </div>
    </Card>
  );
}
