# Astro Grab Automation Rule

Sempre que trabalhar em um projeto Astro (identificado pela presença de `astro.config.*` ou `package.json` com dependência `astro`):

1. **Verificação de Dependência:**
   - Verificar se `astro-grab` está presente em `devDependencies` ou `dependencies` no `package.json`.
   - Se não estiver, instalar com:
     `npm i -D astro-grab --legacy-peer-deps` (ou equivalente no gerenciador do projeto).
   - Garantir a presença de `.npmrc` com `legacy-peer-deps=true` para deploys em CI/Vercel.

2. **Verificação de Configuração:**
   - No `astro.config.*`, importar `import { astroGrab } from 'astro-grab';`
   - Configurar `astroGrab({ toolbar: false, holdDuration: 0 })` e o helper de escuta para tecla `Alt`:
     - `toolbar: false` evita erro de resolução de URLs internas no Windows.
     - `holdDuration: 0` permite ativação instantânea com `Ctrl+G` ou segurando `Alt`.
