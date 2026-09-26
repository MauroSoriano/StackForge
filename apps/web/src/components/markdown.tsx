/*
 * markdown.tsx
 * -----------------------------------------------------------------------------
 * Renderizador de Markdown muy ligero (sin librerías externas).
 * Convierte texto con marcas sencillas a nodos de React:
 *   `código`, **negrita**, *cursiva*, _cursiva_, # títulos, - listas y ``` bloques.
 * Se usa para mostrar el contenido de las lecciones.
 * -----------------------------------------------------------------------------
 */
type InlineNode = React.ReactNode;

/**
 * Renderiza el formato en línea de un texto (código, negrita y cursiva).
 * Recorre el texto con una expresión regular y va intercalando texto plano
 * con etiquetas <code>, <strong> y <em>.
 *
 * @param text Fragmento de una sola línea/trozo a formatear.
 */
function Inline({ text }: { text: string }) {
  const parts: InlineNode[] = [];
  // Regex que captura: `code`, **bold**, *italic* y _italic_
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
  // Añade el resto del texto que queda tras el último match
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/**
 * Convierte un texto Markdown en bloque a elementos React.
 * Soporta títulos (#, ##, ###), listas con - o *, líneas vacías y bloques ```.
 *
 * @param text Markdown completo (puede tener varias líneas).
 */
export function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const nodes: InlineNode[] = [];
  // Buffer temporal para ir acumulando las líneas de un bloque de código.
  let codeBuf: string[] = [];
  // Bandera: true mientras estamos dentro de un bloque ```...```.
  let inCode = false;
  // Contador para generar `key` únicas en los nodos de React.
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