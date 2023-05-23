import { parse } from 'csv-parse';
import { createReadStream } from 'node:fs';

const csvPath = new URL('./tasks.csv', import.meta.url);

const stream = createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2 // skip the header line
});

async function execute() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })

    await delay(1000)
  }
}

execute()

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}