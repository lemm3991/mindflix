import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { getStore } from '@netlify/blobs';

const PRIMARY_OVERRIDES_PATH = path.resolve(process.cwd(), 'src', 'data', 'manual_overrides.json');
const LOCAL_TMP_OVERRIDES_PATH = path.resolve(process.cwd(), '.tmp', 'manual_overrides.json');
const TMP_OVERRIDES_PATH = path.join(os.tmpdir(), 'manual_overrides.json');

const PRIMARY_CAT_OVERRIDES_PATH = path.resolve(process.cwd(), 'src', 'data', 'categories_overrides.json');
const LOCAL_TMP_CAT_OVERRIDES_PATH = path.resolve(process.cwd(), '.tmp', 'categories_overrides.json');
const TMP_CAT_OVERRIDES_PATH = path.join(os.tmpdir(), 'categories_overrides.json');

// In-memory runtime cache for serverless container reuse
let inMemoryCourseOverrides: Record<string, any> | null = null;
let inMemoryCategoryOverrides: any[] | null = null;

function getBlobStore() {
  try {
    return getStore({ name: 'catalog_overrides', consistency: 'strong' });
  } catch {
    return null;
  }
}

function loadJsonFromDiskSafe(paths: string[]): any {
  let result: any = null;
  for (const filePath of paths) {
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed) {
          result = result ? (Array.isArray(result) ? parsed : { ...result, ...parsed }) : parsed;
        }
      } catch {}
    }
  }
  return result;
}

function saveJsonToDiskSafe(primaryPath: string, tmpPaths: string[], data: any): boolean {
  const content = JSON.stringify(data, null, 2);
  let savedAtLeastOne = false;

  try {
    const primaryDir = path.dirname(primaryPath);
    if (!fs.existsSync(primaryDir)) fs.mkdirSync(primaryDir, { recursive: true });
    fs.writeFileSync(primaryPath, content, 'utf-8');
    savedAtLeastOne = true;
  } catch {}

  for (const tmpPath of tmpPaths) {
    try {
      const dir = path.dirname(tmpPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(tmpPath, content, 'utf-8');
      savedAtLeastOne = true;
    } catch {}
  }

  return savedAtLeastOne;
}

// ---------------- COURSE OVERRIDES ----------------

export async function getCourseOverridesAsync(): Promise<Record<string, any>> {
  // 1. Start with disk overrides
  const diskData = loadJsonFromDiskSafe([PRIMARY_OVERRIDES_PATH, LOCAL_TMP_OVERRIDES_PATH, TMP_OVERRIDES_PATH]) || {};
  let merged: Record<string, any> = { ...diskData };

  // 2. Try Netlify Blobs
  const store = getBlobStore();
  if (store) {
    try {
      const blobData = await store.get('manual_overrides', { type: 'json' });
      if (blobData && typeof blobData === 'object') {
        merged = { ...merged, ...blobData };
      }
    } catch {}
  }

  // 3. Merge with in-memory overrides
  if (inMemoryCourseOverrides) {
    merged = { ...merged, ...inMemoryCourseOverrides };
  }

  inMemoryCourseOverrides = merged;
  return merged;
}

export function getCourseOverridesSync(): Record<string, any> {
  const diskData = loadJsonFromDiskSafe([PRIMARY_OVERRIDES_PATH, LOCAL_TMP_OVERRIDES_PATH, TMP_OVERRIDES_PATH]) || {};
  let merged: Record<string, any> = { ...diskData };
  if (inMemoryCourseOverrides) {
    merged = { ...merged, ...inMemoryCourseOverrides };
  }
  return merged;
}

export async function saveCourseOverride(courseId: string, patch: Record<string, any>): Promise<Record<string, any>> {
  const current = await getCourseOverridesAsync();
  current[courseId] = {
    ...(current[courseId] || {}),
    ...patch,
    updated_at: new Date().toISOString()
  };

  inMemoryCourseOverrides = current;

  // Persist to Netlify Blobs
  const store = getBlobStore();
  if (store) {
    try {
      await store.setJSON('manual_overrides', current);
    } catch (err) {
      console.warn('Could not save to Netlify Blobs:', err);
    }
  }

  // Persist to disk
  saveJsonToDiskSafe(PRIMARY_OVERRIDES_PATH, [LOCAL_TMP_OVERRIDES_PATH, TMP_OVERRIDES_PATH], current);

  return current[courseId];
}

// ---------------- CATEGORY OVERRIDES ----------------

export async function getCategoryOverridesAsync(fallback: any[] = []): Promise<any[]> {
  const diskData = loadJsonFromDiskSafe([PRIMARY_CAT_OVERRIDES_PATH, LOCAL_TMP_CAT_OVERRIDES_PATH, TMP_CAT_OVERRIDES_PATH]);
  let current: any[] = Array.isArray(diskData) ? diskData : (diskData?.categories || fallback);

  const store = getBlobStore();
  if (store) {
    try {
      const blobData = await store.get('categories_overrides', { type: 'json' });
      if (Array.isArray(blobData)) {
        current = blobData;
      } else if (blobData && Array.isArray(blobData.categories)) {
        current = blobData.categories;
      }
    } catch {}
  }

  if (inMemoryCategoryOverrides && inMemoryCategoryOverrides.length > 0) {
    current = inMemoryCategoryOverrides;
  }

  inMemoryCategoryOverrides = current;
  return current;
}

export function getCategoryOverridesSync(fallback: any[] = []): any[] {
  if (inMemoryCategoryOverrides && inMemoryCategoryOverrides.length > 0) {
    return inMemoryCategoryOverrides;
  }
  const diskData = loadJsonFromDiskSafe([PRIMARY_CAT_OVERRIDES_PATH, LOCAL_TMP_CAT_OVERRIDES_PATH, TMP_CAT_OVERRIDES_PATH]);
  return Array.isArray(diskData) ? diskData : (diskData?.categories || fallback);
}

export async function saveCategoryOverrides(categories: any[]): Promise<any[]> {
  inMemoryCategoryOverrides = categories;

  const store = getBlobStore();
  if (store) {
    try {
      await store.setJSON('categories_overrides', categories);
    } catch (err) {
      console.warn('Could not save categories to Netlify Blobs:', err);
    }
  }

  saveJsonToDiskSafe(
    PRIMARY_CAT_OVERRIDES_PATH,
    [LOCAL_TMP_CAT_OVERRIDES_PATH, TMP_CAT_OVERRIDES_PATH],
    { categories, updated_at: new Date().toISOString() }
  );

  return categories;
}
