# Regras do Antigravity: Astro Grab & Seleção Visual

Quando o usuário fizer referência a elementos visuais da interface ("esse botão", "este card", "essa imagem", "este texto", "o elemento selecionado", etc.):

1. Chame a ferramenta MCP `get_selected_element` (ou `astro-grab-global_get_selected_element`) passando `workspace_path` com o diretório raiz deste projeto.
2. Se o status for "success", use os campos `file`, `line`, `column` e `snippet` para localizar e editar diretamente o código-fonte correspondente.
3. Se o status for "rejected", avise o usuário caso o elemento pertença a outro projeto ou tenha expirado.
