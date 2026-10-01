import type { APIRoute } from 'astro';
import { getCategoryOverridesAsync, saveCategoryOverrides } from '../../../lib/overridesStore';
import { getCategories, invalidateCatalogCache } from '../../../lib/catalog';

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

    const baseCategories = getCategories();
    let currentCategories = await getCategoryOverridesAsync(baseCategories);

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

      currentCategories = [...currentCategories, newCat];
      await saveCategoryOverrides(currentCategories);
      invalidateCatalogCache();

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

      await saveCategoryOverrides(currentCategories);
      invalidateCatalogCache();

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
      await saveCategoryOverrides(currentCategories);
      invalidateCatalogCache();

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
