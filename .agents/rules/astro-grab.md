# Astro Grab Automation Rule

Sempre que trabalhar em um projeto Astro (identificado pela presença de `astro.config.*` ou `package.json` com dependência `astro`):

1. **Verificação de Dependência:**
   - Verificar se `astro-grab` está presente em `devDependencies` ou `dependencies` no `package.json`.
   - Se não estiver, instalar automaticamente com:
     `npm i -D astro-grab --legacy-peer-deps` (ou equivalente no gerenciador do projeto).

2. **Verificação de Configuração:**
   - Verificar se `astro.config.*` importa e inclui `astroGrab()` no array `integrations: [astroGrab()]`.
   - Se não estiver configurado, adicionar o import `import astroGrab from 'astro-grab';` e incluir `astroGrab()` nas `integrations` preservando os demais adapters e opções existentes.
