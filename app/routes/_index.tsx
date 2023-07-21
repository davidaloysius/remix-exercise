import {
  ActionArgs,
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useTransition,
} from "@remix-run/react";
import Card from "~/components/Card";
import ErrorMessage from "~/components/ErrorMessage";
import Label from "~/components/Label";
import Spinner from "~/components/Spinner";
import { PostPayload, addPosts } from "~/models/posts.server";
import { commitSession, getSession } from "~/models/session.server";
import { getUsers } from "~/models/users.server";

export const loader: LoaderFunction = async () => {
  const users = await getUsers();
  return json(users);
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const data = Object.fromEntries(await request.formData());

  const { title, body, userId, isHuman } = data;

  const formErrors = {
    title: !!title ? null : "Title is required",
    body: !!body ? null : "Body is required",
    isHuman: isHuman ? null : "This field is required",
  };

  const hasError = Object.values(formErrors).some((error) => error);

  if (hasError) {
    return json(formErrors);
  }

  const newPost = await addPosts({
    title: `${title}`,
    body: `${body}`,
    userId: parseInt(`${userId}`),
  });

  session.set("payload", newPost);

  return redirect("/profile", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Index() {
  const users = useLoaderData<typeof loader>();
  const formErrors = useActionData();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <Card>
      {!users && <Spinner />}
      {users && (
        <>
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-indigo-600">
            Sign up
          </h2>
          <Form method="post" id="signup-form">
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="col-span-6">
                <Label name="Title" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  disabled={isSubmitting}
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formErrors?.title && (
                  <ErrorMessage message={formErrors?.title} />
                )}
              </div>

              <div className="col-span-6">
                <Label name="Body" />
                <textarea
                  id="body"
                  name="body"
                  disabled={isSubmitting}
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                ></textarea>
                {formErrors?.body && (
                  <ErrorMessage message={formErrors?.body} />
                )}
              </div>

              <div className="col-span-6">
                <Label name="Username" />
                <select
                  id="userId"
                  name="userId"
                  disabled={isSubmitting}
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  {users.map(({ username, id }: any) => (
                    <option key={id} value={id}>
                      {username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6 mt-2">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="isHuman"
                      name="isHuman"
                      type="checkbox"
                      disabled={isSubmitting}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="isHuman"
                      className="font-medium text-gray-900"
                    >
                      I am a human
                    </label>
                  </div>
                </div>
                {formErrors?.isHuman && (
                  <ErrorMessage message={formErrors?.isHuman} />
                )}
              </div>
            </div>
            <div>
              <button className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                {isSubmitting && (
                  <>
                    <Spinner /> Loading...
                  </>
                )}
                {!isSubmitting && <>Submit</>}
              </button>
            </div>
          </Form>
        </>
      )}
    </Card>
  );
}
