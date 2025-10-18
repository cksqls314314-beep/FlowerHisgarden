export async function fetchCSV(url: string): Promise<string> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('CSV 불러오기 실패');
  return res.text();
}

export function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  return lines.map(line => splitCSVLine(line));
}

function splitCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i+1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      out.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map(s => s.trim());
}
