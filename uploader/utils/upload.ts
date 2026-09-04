export const runWithConcurrency = async <T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
) => {
  const limit = Math.max(1, concurrency);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }).map(
    async () => {
      while (cursor < items.length) {
        const current = cursor;
        cursor += 1;
        await worker(items[current]);
      }
    },
  );

  await Promise.all(runners);
};

export const createChunks = (file: File, chunkSize: number) => {
  const safeChunkSize = Math.max(1, chunkSize);
  const chunks = file.size === 0 ? 1 : Math.ceil(file.size / safeChunkSize);
  const items: Array<{ index: number; data: FormData; size: number }> = [];

  for (let i = 0; i < chunks; i++) {
    const offset = i * safeChunkSize;
    const end = Math.min(file.size, offset + safeChunkSize);
    const part = file.slice(offset, end);

    const fd = new FormData();
    fd.append("file", part);

    items.push({ index: i + 1, data: fd, size: end - offset });
  }

  return items;
};