import { EOL } from 'os';

interface SearchResponse {
  value: DocSearchResult[];
}

interface DocSearchResult {
  '@search.score': number;
  id?: string;
  content?: string;
  url?: string;
  title?: string;
}

export const findDocs = async (query: string, version?: string): Promise<string> => {
  let filter = undefined;
  if (version) {
    filter = `version eq '${version}' or version eq null`;
  }
  
  const response = await fetch('https://devproxy-wama.azurewebsites.net/api/search', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, filter }),
  });

  if (!response.ok) {
    throw new Error(`Error fetching documentation: ${response.statusText}`);
  }

  const data = await response.json() as SearchResponse;
  const result = data.value.slice(0, 3).map(doc =>
    `${doc.content}${EOL}${EOL}Source: ${doc.url}${EOL}----$`)
    .join(EOL);
  return result;
};