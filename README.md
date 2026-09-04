# 🎬 Mindflix — Plataforma Pessoal de Cursos & Streaming

Mindflix é uma aplicação web moderna, imersiva e de alto desempenho construída em **Astro (SSR Standalone com Node.js)** para indexação, catalogação, organização e consumo de bibliotecas de cursos locais, com sincronização em nuvem via **Supabase** e fallback offline em **LocalStorage**.

Inspirada conceitualmente nas melhores experiências da *Apple TV, Netflix, Linear e Raycast*.

---

## ⚡ Características Principais

- **Streaming HTTP 206 (Partial Content)**: Reprodução instantânea de arquivos `.mp4`, `.webm`, `.mkv` com suporte a seek em qualquer ponto da linha do tempo.
- **Player de Vídeo Profissional**:
  - **Atalhos Rápidos**: `Espaço` / `K` (Play/Pause), `←`/`→` (±5s), `J`/`L` (±10s), `M` (Mute), `F` (Fullscreen), `T` (Modo Teatro), `C` (Modo Foco Zen), `P` (Picture-in-Picture).
  - **Velocidade Dinâmica**: Popover de 0.75x a 2.5x com suporte a memorização de velocidade por curso.
  - **Contagem Regressiva**: Transição automática para a próxima aula respeitando a preferência de Autoplay.
  - **Resiliência e Unload**: Salvamento throttled e persistência imediata no `seeked`, `beforeunload` e `pagehide`.
- **Command Palette Global (`Ctrl+K` / `Cmd+K`)**: Busca instantânea insensível a acentos por Cursos, Módulos, Aulas e Fornecedores com navegação 100% por teclado.
- **Interface Premium & Motion Physics**:
  - **Canvas Topográfico Interativo**: Linhas com campo de força elástico que desviam do cursor, renderizadas com resolução nativa HiDPI/Retina (DPR escalonado até 2x) e pausa em abas inativas.
  - **Tilt 3D & Specular Highlight**: Efeito tridimensional suave com reflexo de luz dinâmico nos cards de curso.
  - **Carrosséis com Drag Lateral**: Rolagem suave arrastando o mouse ou usando setas contextuais.
  - **Design Tokens**: Glassmorphism escuro de alta legibilidade, contraste WCAG e suporte nativo a `prefers-reduced-motion`.
- **Catálogo & Ordenação Natural**: Ordenação inteligente de módulos e aulas (`1, 2, ..., 9, 10, 11`), preservando caminhos físicos originais e IDs imutáveis.
- **Arquitetura de Dados & Concorrência**:
  - Resolução de conflitos baseada no timestamp `last_watched_at`.
  - Fila de sincronização offline (`flushPendingSync`) que garante que nenhum progresso seja perdido mesmo com instabilidade de rede.
  - RLS (Row Level Security) rigorosa no Supabase isolando perfis, favoritos, progresso e histórico.

---

## 🛠️ Pré-requisitos

- **Node.js**: versão 18.14.1 ou superior (recomendado 20 LTS).
- **Python**: versão 3.8+ (necessário apenas para rodar o scanner de catálogo `build_catalog.py`).
- **Navegador**: Chrome, Edge, Firefox, Brave ou Safari moderno.

---

## 🚀 Como Iniciar em Qualquer Computador

### 1. Clonar ou Acessar a Pasta do Projeto

```bash
cd "d:/Projetos Antigravity/download synapse/mindflix"
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente (Opcional)

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `COURSES_ROOT` | `..` | Caminho raiz onde ficam as pastas dos cursos. Permite mover os cursos para outro HD ou diretório sem alterar o código. |
| `PORT` | `4321` | Porta do servidor HTTP local. |
| `PUBLIC_SUPABASE_URL` | *Vazio* | URL da sua instância do Supabase. |
| `PUBLIC_SUPABASE_ANON_KEY` | *Vazio* | Chave pública anônima do Supabase. |

> **Nota**: Se o Supabase não estiver configurado, a aplicação funciona perfeitamente em **modo local offline**, salvando todo o progresso, favoritos e configurações no `localStorage` do navegador.

### 4. Indexar a Pasta de Cursos (Gerar o Catálogo)

Execute o script de catalogação automática:

```bash
python build_catalog.py
```

O script detecta automaticamente todos os cursos, módulos, vídeos e materiais complementares, gerando o arquivo `src/data/catalog.json` com ordenação natural e metadados inferidos.

### 5. Executar em Modo de Desenvolvimento

```bash
npm run dev
```

Acesse no navegador: **`http://localhost:4321`**

### 6. Executar em Modo de Produção (Standalone Node.js)

```bash
npm run build
node ./dist/server/entry.mjs
```

---

## 🗄️ Estrutura do Projeto

```text
mindflix/
├── build_catalog.py             # Script de indexação e ordenação natural
├── supabase_schema.sql          # Schema PostgreSQL com 12 tabelas, RLS e índices
├── astro.config.mjs             # Configuração Astro (SSR standalone com @astrojs/node)
├── public/                      # Assets estáticos
└── src/
    ├── components/              # Componentes de UI (Player, Cards, Carrosséis, Canvas, Palette)
    │   ├── CommandPalette.astro # Busca global rápida (Ctrl+K)
    │   ├── CourseCard.astro     # Card com Tilt 3D e Specular Highlight
    │   ├── CourseRow.astro      # Carrossel com drag e edge fade
    │   ├── HeroCourse.astro     # Destaque editorial com parallax
    │   ├── InteractiveBackground.astro # Canvas topográfico de alta performance
    │   ├── VideoPlayer.astro    # Player avançado com atalhos, teatro, foco e retry
    │   └── ...
    ├── data/
    │   └── catalog.json         # Base do catálogo indexado (39 cursos, 301 módulos, 2902 aulas)
    ├── lib/
    │   ├── catalog.ts           # Helpers de busca com normalização de acentos e filtros
    │   ├── progress.ts          # Gerenciador de progresso, concorrência, timestamps e offline
    │   ├── supabase.ts          # Cliente Supabase e autenticação
    │   └── toast.ts             # Sistema leve de notificações flutuantes
    └── pages/
        ├── index.astro          # Home editorial (Continuar Estudando, Destaques, Trilhas)
        ├── courses.astro        # Catálogo geral com busca em tempo real e chips de filtro
        ├── categories.astro     # Visualização por categorias
        ├── my-list.astro        # Minha Lista / Favoritos
        ├── profile.astro        # Perfil do usuário e gráfico semanal de estudo
        ├── settings.astro       # Painel de preferências (reprodução, visual e conta)
        ├── 404.astro            # Página 404 elegante com links de recuperação
        ├── course/[id].astro    # Detalhes do curso, ementa e progresso de módulos
        ├── watch/[courseId]/[lessonId].astro # Player e área de estudo com materiais
        └── api/
            └── video.ts         # Endpoint de streaming com Range Requests (HTTP 206)
```

---

## 🔒 Segurança e RLS (Supabase)

Ao conectar ao Supabase:
1. Abra o painel SQL do seu projeto no Supabase.
2. Execute o conteúdo de [`supabase_schema.sql`](supabase_schema.sql).
3. Todas as 12 tabelas terão Row Level Security (RLS) habilitada, garantindo que nenhum usuário possa ler ou modificar progresso, favoritos ou preferências de outro usuário.
