# Astro Grab Automation Rule

Sempre que trabalhar em um projeto Astro (identificado pela presença de `astro.config.*` ou `package.json` com dependência `astro`):

1. **Verificação de Dependência:**
   - Verificar se `astro-grab` está presente em `devDependencies` ou `dependencies` no `package.json`.
   - Se não estiver, instalar com:
     `npm i -D astro-grab --legacy-peer-deps` (ou equivalente no gerenciador do projeto).

2. **Verificação de Configuração:**
   - Verificar se `astro.config.*` importa e inclui `astroGrab({ toolbar: false })` no array `integrations`.
   - Utilizar import nomeado: `import { astroGrab } from 'astro-grab';`
   - Configurar com `{ toolbar: false }` para evitar incompatibilidade de caminhos URL no Windows:
     `integrations: [astroGrab({ toolbar: false })]`
