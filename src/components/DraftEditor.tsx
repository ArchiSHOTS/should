"use client";

interface DraftEditorProps {
  value: string;
  onChange: (text: string) => void;
  onGetAdvice: () => void;
}

export default function DraftEditor({ value, onChange, onGetAdvice }: DraftEditorProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What's on your mind? Write freely — no one is watching."
          className="w-full min-h-64 resize-none bg-transparent border border-sage/30 rounded-2xl p-6 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/10 transition-all duration-300 text-lg leading-relaxed font-sans"
          spellCheck={false}
        />
        <div className="absolute bottom-4 right-5 text-xs text-stone-400 select-none">
          {charCount > 0 && (
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-400 italic max-w-xs">
          Pause before posting. Let&apos;s think this through together.
        </p>

        <button
          onClick={onGetAdvice}
          disabled={value.trim().length === 0}
          className="group flex items-center gap-2 bg-sage text-white px-7 py-3 rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:bg-sage-dark hover:shadow-lg hover:shadow-sage/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          Get Advice
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
