import { useRouteError } from "react-router-dom";
import LinkButton from "./LinkButton";

function Error() {
  const error = useRouteError();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <p className="text-5xl" aria-hidden>
        😢
      </p>
      <h1 className="mt-4 text-xl font-semibold text-stone-800">
        Something went wrong
      </h1>
      {/* break-words: long error messages must not push the page wider than the phone */}
      <p className="mt-2 text-sm wrap-break-word text-stone-500">
        {error.data || error.message}
      </p>
      <div className="mt-6">
        <LinkButton to="-1">&larr; Go back</LinkButton>
      </div>
    </div>
  );
}

export default Error;
