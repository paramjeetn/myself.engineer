export function Footer() {
  return (
    <footer className="w-full py-4 px-6  mt-auto border-t border-gray-200">
      <div className="max-w-4xl justify-between items-center mx-auto w-full flex flex-col-reverse md:flex-row gap-2">
        <div className="text-sm text-design-gray font-mono font-bold">
          <a
            target="_blank"
            href="https://togetherai.link"
            className="text-design-black underline underline-offset-2"
          >
          </a>
          <a
            target="_blank"
            href="https://togetherai.link"
            className="text-design-black underline underline-offset-2"
          >
          </a>
        </div>

        <div className="flex gap-2">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/paramjeet/myself.engineer"
            className="size-6 flex items-center justify-center border-design-gray border rounded-md"
          >
            <img src="/footer/github.svg" className="size-4" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/paramjeetpradhan/"
            className="size-6 flex items-center justify-center border-design-gray border rounded-md"
          >
            <img src="/footer/linkedin.svg" className="size-4" />
            <span className="sr-only">Social</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
