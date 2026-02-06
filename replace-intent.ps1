from pathlib import Path
path = Path('client/src/app/page.tsx')
text = path.read_text()
old = "        <div className=\"space-y-2\">\n          <p className=\"text-xs uppercase tracking-[0.3em] text-muted-foreground\">\n            Start with intent\n          </p>\n          <h2 className=\"text-3xl md:text-4xl font-semibold\">\n            Choose the track that fits the move you are making.\n          </h2>\n          <p className=\"text-sm md:text-base text-muted-foreground max-w-3xl\">\n            Each lane is designed for the moment you\'re inâ€”quick intelligence for individuals\n            and structured support for teams.\n          </p>\n        </div>"
new = "        <div className=\"space-y-2\">\n          <h2 className=\"text-3xl md:text-4xl font-semibold\">\n            Choose the track that fits the move you are making.\n          </h2>\n          <p className=\"text-sm md:text-base text-muted-foreground\">\n            Different goals come with different constraints. Pick the one you\'re actually dealing\n            with — we\'ll take it from there.\n          </p>\n        </div>"
if old not in text:
    raise SystemExit('old block not found')
text = text.replace(old, new, 1)
path.write_text(text)
