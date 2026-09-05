import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const PRIMARY_CAT_OVERRIDES = path.resolve(process.cwd(), 'src', 'data', 'categories_overrides.json');
const TMP_CAT_OVERRIDES = path.join(os.tmpdir(), 'categories_overrides.json');

const PRIMARY_CATALOG = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');
const TMP_CATALOG = path.join(os.tmpdir(), 'catalog.json');

function loadCatalogData() {
  let catalog: any = { categories: [], courses: [] };
  if (fs.existsSync(TMP_CATALOG)) {
    try {
      catalog = JSON.parse(fs.readFileSync(TMP_CATALOG, 'utf-8'));
    } catch {}
  } else if (fs.existsSync(PRIMARY_CATALOG)) {
    try {
      catalog = JSON.parse(fs.readFileSync(PRIMARY_CATALOG, 'utf-8'));
    } catch {}
  }
  return catalog;
}

function loadCategoriesOverride(fallbackCategories: any[]) {
  if (fs.existsSync(TMP_CAT_OVERRIDES)) {
    try {
      const data = JSON.parse(fs.readFileSync(TMP_CAT_OVERRIDES, 'utf-8'));
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.categories)) return data.categories;
    } catch {}
  }
  if (fs.existsSync(PRIMARY_CAT_OVERRIDES)) {
    try {
      const data = JSON.parse(fs.readFileSync(PRIMARY_CAT_OVERRIDES, 'utf-8'));
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.categories)) return data.categories;
    } catch {}
  }
  return fallbackCategories;
}

function saveCategoriesSafe(categories: any[]): { success: boolean; isReadOnly: boolean } {
  const content = JSON.stringify({ categories, updated_at: new Date().toISOString() }, null, 2);
  let isReadOnly = false;

  // Save to categories_overrides.json
  try {
    fs.writeFileSync(PRIMARY_CAT_OVERRIDES, content, 'utf-8');
  } catch (err: any) {
    isReadOnly = true;
    try {
      fs.writeFileSync(TMP_CAT_OVERRIDES, content, 'utf-8');
    } catch (tmpErr) {}
  }

  // Also update catalog.json if possible
  const catalog = loadCatalogData();
  catalog.categories = categories;
  const catalogStr = JSON.stringify(catalog, null, 2);
  try {
    fs.writeFileSync(PRIMARY_CATALOG, catalogStr, 'utf-8');
  } catch {
    try {
      fs.writeFileSync(TMP_CATALOG, catalogStr, 'utf-8');
    } catch {}
  }

  return { success: true, isReadOnly };
}

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, id, name, description, icon } = body;

    const catalog = loadCatalogData();
    let currentCategories = loadCategoriesOverride(catalog.categories || []);

    if (action === 'create') {
      if (!name || !name.trim()) {
        return new Response(JSON.stringify({ error: 'Nome da categoria é obrigatório.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const catId = (id && id.trim()) ? slugify(id) : slugify(name);
      
      if (currentCategories.some((c: any) => c.id === catId)) {
        return new Response(JSON.stringify({ error: `Já existe uma categoria com o ID "${catId}".` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const newCat = {
        id: catId,
        name: name.trim(),
        description: (description || '').trim(),
        icon: (icon || 'folder').trim()
      };

      currentCategories.push(newCat);
      saveCategoriesSafe(currentCategories);

      return new Response(JSON.stringify({ success: true, category: newCat, action: 'create' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'update') {
      if (!id) {
        return new Response(JSON.stringify({ error: 'ID da categoria é obrigatório para atualização.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const index = currentCategories.findIndex((c: any) => c.id === id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: 'Categoria não encontrada.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      currentCategories[index] = {
        ...currentCategories[index],
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(description !== undefined ? { description: description.trim() } : {}),
        ...(icon !== undefined ? { icon: icon.trim() } : {})
      };

      saveCategoriesSafe(currentCategories);

      return new Response(JSON.stringify({ success: true, category: currentCategories[index], action: 'update' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'delete') {
      if (!id) {
        return new Response(JSON.stringify({ error: 'ID da categoria é obrigatório para remoção.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      currentCategories = currentCategories.filter((c: any) => c.id !== id);
      saveCategoriesSafe(currentCategories);

      return new Response(JSON.stringify({ success: true, deletedId: id, action: 'delete' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Ação inválida (use create, update ou delete).' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Erro ao processar categorias.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
