# Astro Grab Automation Rule

Sempre que trabalhar em um projeto Astro (identificado pela presença de `astro.config.*` ou `package.json` com dependência `astro`):

1. **Verificação de Dependência:**
   - Verificar se `astro-grab` está presente em `devDependencies` ou `dependencies` no `package.json`.
   - Se não estiver, instalar com:
     `npm i -D astro-grab --legacy-peer-deps` (ou equivalente no gerenciador do projeto).
   - Garantir a presença de `.npmrc` com `legacy-peer-deps=true` para compatibilidade no CI/Vercel.

2. **Verificação de Configuração:**
   - No `astro.config.*`, importar `import { astroGrab } from 'astro-grab';`
   - Configurar `astroGrab({ toolbar: false, holdDuration: 0 })` com o helper de conexão ao WebSocket Bridge MCP (`ws://127.0.0.1:4567`) e suporte à tecla `Alt`.
   - O helper escuta o evento `astro-grab:component-targeted`, busca o snippet e envia a mensagem `astro-grab:context` para o MCP Server `astro-grab-global`.
