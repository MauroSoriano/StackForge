type InlineNode = React.ReactNode;

function Inline({ text }: { text: string }) {
  const parts: InlineNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const full = m[0];
    if (full.startsWith("`")) parts.push(<code key={k++}>{full.slice(1, -1)}</code>);
    else if (full.startsWith("**"))
      parts.push(<strong key={k++}>{full.slice(2, -2)}</strong>);
    else if (full.startsWith("*") || full.startsWith("_"))
      parts.push(<em key={k++}>{full.slice(1, -1)}</em>);
    last = m.index + full.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const nodes: InlineNode[] = [];
  let codeBuf: string[] = [];
  let inCode = false;
  let k = 0;

  const flushCode = (i: number) => {
    if (codeBuf.length > 0) {
      nodes.push(
        <pre key={k++}>
          <code>{codeBuf.join("\n")}</code>
        </pre>,
      );
      codeBuf = [];
    }
    void i;
  };

  for (const raw of lines) {
    const t = raw.trim();

    if (/^```/.test(t)) {
      if (inCode) flushCode(k);
      else inCode = true;
      void t;
      continue;
    }
    if (inCode) {
      codeBuf.push(raw);
      continue;
    }

    const h = t.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushCode(k);
      nodes.push(
        h[1].length === 1 ? (
          <h3 key={k++}>{h[2]}</h3>
        ) : (
          <h4 key={k++}>{h[2]}</h4>
        ),
      );
      continue;
    }
    if (/^[-*]\s+/.test(t)) {
      flushCode(k);
      nodes.push(
        <p key={k++} className="md-bullet">
          <Inline text={"• " + t.replace(/^[-*]\s+/, "")} />
        </p>,
      );
      continue;
    }
    if (t === "") {
      flushCode(k);
      nodes.push(<p key={k++}>&nbsp;</p>);
      continue;
    }
    flushCode(k);
    nodes.push(
      <p key={k++}>
        <Inline text={t} />
      </p>,
    );
  }
  flushCode(k);

  return <div className="markdown">{nodes}</div>;
}