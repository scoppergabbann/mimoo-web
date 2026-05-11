interface OrDividerProps {
  text?: string;
}

export function OrDivider({ text = 'atau' }: OrDividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-mimoo-purple-100" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 bg-white text-mimoo-ink-300 font-medium uppercase tracking-wider text-xs">
          {text}
        </span>
      </div>
    </div>
  );
}
