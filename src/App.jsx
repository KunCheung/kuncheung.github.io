import { useEffect, useMemo, useState } from "react";

const navItems = [
  { id: "intro", label: "简介" },
  { id: "now", label: "近况" },
  { id: "projects", label: "项目" },
  { id: "writing", label: "写作" },
  { id: "contact", label: "联系" },
];

const updates = [
  {
    date: "2026.04",
    title: "整理个人品牌主页",
    body: "把项目、想法、长期关注的问题放到一个更容易更新的入口里。",
  },
  {
    date: "2026.03",
    title: "打磨一个轻量工具",
    body: "围绕个人知识管理做小步实验，优先追求稳定、顺手和可迁移。",
  },
  {
    date: "2026.02",
    title: "重新梳理写作主题",
    body: "把产品判断、技术实践和生活观察拆成几个持续更新的栏目。",
  },
];

const projects = [
  {
    name: "Signal Desk",
    kind: "产品原型",
    description: "一个帮助创作者收集、筛选和复盘灵感信号的桌面型工作台。",
    tags: ["React", "Workflow", "Local-first"],
  },
  {
    name: "Tiny Systems",
    kind: "实践合集",
    description: "用小系统解决重复工作：记录模板、自动化脚本、个人仪表盘。",
    tags: ["Automation", "Design", "Notes"],
  },
  {
    name: "Build Notes",
    kind: "公开笔记",
    description: "记录从想法到上线的过程，包括取舍、踩坑和复盘。",
    tags: ["Writing", "Product", "Reflection"],
  },
];

const posts = [
  {
    title: "Agent 安全的核心，是约束不确定决策系统",
    meta: "Agent 安全 / 12 min",
    href: "#/articles/agent-safety-core",
    source: `${import.meta.env.BASE_URL}articles/agent-safety-core.md`,
    slug: "agent-safety-core",
  },
];

const links = [
  { label: "Email", href: "mailto:yukun.dong@hotmail.com" },
  { label: "GitHub", href: "#" },
];

const profileImage = `${import.meta.env.BASE_URL}profile-placeholder.svg`;

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [activeSection, setActiveSection] = useState("intro");
  const [hash, setHash] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash,
  );
  const activeArticle = posts.find(
    (post) => post.slug && hash === `#/articles/${post.slug}`,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (activeArticle) {
      setActiveSection("writing");
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 },
    );

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [activeArticle]);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title = activeArticle
      ? `${activeArticle.title} - 个人品牌主页`
      : "个人品牌主页";
  }, [activeArticle]);

  const profile = useMemo(
    () => ({
      name: "Yukun Dong (董昱坤)",
      role: "安全隐私研究员",
      location: "当前城市",
      summary:
        "我关注产品判断、技术实现和个人工作流，喜欢把模糊的想法打磨成可用、可维护的小系统。",
    }),
    [],
  );

  return (
    <div className="site-shell">
      <MobileHeader
        activeSection={activeSection}
        profile={profile}
        setTheme={setTheme}
        theme={theme}
      />

      <aside className="sidebar" aria-label="个人主页导航">
        <Sidebar
          activeSection={activeSection}
          profile={profile}
          setTheme={setTheme}
          theme={theme}
        />
      </aside>

      <main className="content">
        {activeArticle ? (
          <ArticlePage article={activeArticle} />
        ) : (
          <HomePage profile={profile} />
        )}
      </main>
    </div>
  );
}

function HomePage({ profile }) {
  return (
    <>
      <Section id="intro" label="Intro">
        <div className="intro-grid">
          <div className="intro-copy">
            <p className="eyebrow">Personal OS / Product Notes</p>
            <h1>{profile.name}</h1>
            <p className="lead">{profile.summary}</p>
            <div className="intro-actions" aria-label="主要操作">
              <a className="primary-link" href="#projects">
                查看项目
              </a>
              <a className="text-link" href="#contact">
                联系我
              </a>
            </div>
          </div>
          <figure className="portrait">
            <img
              src={profileImage}
              alt="个人头像占位图"
              width="960"
              height="1200"
            />
            <figcaption>头像 / 工作照占位</figcaption>
          </figure>
        </div>
      </Section>

      <Section id="now" label="Now">
        <div className="section-heading">
          <p className="eyebrow">Now</p>
          <h2>最近在做什么</h2>
        </div>
        <NowList updates={updates} />
      </Section>

      <Section id="projects" label="Selected Work">
        <div className="section-heading">
          <p className="eyebrow">Selected Work</p>
          <h2>精选项目</h2>
        </div>
        <ProjectList projects={projects} />
      </Section>

      <Section id="writing" label="Writing">
        <div className="section-heading">
          <p className="eyebrow">Writing</p>
          <h2>文章与想法</h2>
        </div>
        <div className="writing-list">
          {posts.map((post) => (
            <a className="writing-item" href={post.href} key={post.title}>
              <span>{post.title}</span>
              <small>{post.meta}</small>
            </a>
          ))}
        </div>
      </Section>

      <Section id="contact" label="Contact">
        <div className="contact-panel">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>欢迎交流项目、产品想法和长期主义的小系统。</h2>
          </div>
          <LinkDock links={links} />
        </div>
      </Section>
    </>
  );
}

function ArticlePage({ article }) {
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isCurrent = true;

    setStatus("loading");
    fetch(article.source)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load article: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        if (isCurrent) {
          setMarkdown(text);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (isCurrent) {
          setStatus("error");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [article.source]);

  return (
    <article className="article-page">
      <a className="back-link" href="#writing">
        返回写作
      </a>
      <div className="article-meta">
        <p className="eyebrow">Writing</p>
        <span>{article.meta}</span>
      </div>
      {status === "loading" && <p className="article-status">文章加载中...</p>}
      {status === "error" && (
        <p className="article-status">文章暂时无法加载，请稍后再试。</p>
      )}
      {status === "ready" && <MarkdownContent markdown={markdown} />}
    </article>
  );
}

function MarkdownContent({ markdown }) {
  return <div className="article-body">{parseMarkdown(markdown)}</div>;
}

function parseMarkdown(markdown) {
  const blocks = [];
  const lines = markdown.split(/\r?\n/);
  let paragraph = [];
  let quote = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }

    blocks.push({
      type: "paragraph",
      text: paragraph.join(" "),
    });
    paragraph = [];
  };

  const flushQuote = () => {
    if (quote.length === 0) {
      return;
    }

    blocks.push({
      type: "quote",
      text: quote.join(" "),
    });
    quote = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushQuote();
      return;
    }

    if (line === "---") {
      flushParagraph();
      flushQuote();
      blocks.push({ type: "hr" });
      return;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      quote.push(line.replace(/^>\s?/, ""));
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      flushQuote();
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text: heading[2],
      });
      return;
    }

    flushQuote();
    paragraph.push(line);
  });

  flushParagraph();
  flushQuote();

  return blocks.map((block, index) => {
    const key = `${block.type}-${index}`;

    if (block.type === "heading") {
      const HeadingTag = `h${block.level}`;
      return <HeadingTag key={key}>{renderInline(block.text, key)}</HeadingTag>;
    }

    if (block.type === "quote") {
      return (
        <blockquote key={key}>
          <p>{renderInline(block.text, key)}</p>
        </blockquote>
      );
    }

    if (block.type === "hr") {
      return <hr key={key} />;
    }

    return <p key={key}>{renderInline(block.text, key)}</p>;
  });
}

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-inline-${index}`;
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return <strong key={key}>{bold[1]}</strong>;
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a href={link[2]} key={key} rel="noreferrer" target="_blank">
          {link[1]}
        </a>
      );
    }

    return part;
  });
}

function Sidebar({ activeSection, profile, setTheme, theme }) {
  return (
    <div className="sidebar-inner">
      <div className="profile-block">
        <img
          className="profile-image"
          src={profileImage}
          alt="个人头像占位图"
          width="160"
          height="160"
        />
        <div>
          <p className="profile-name">{profile.name}</p>
          <p className="profile-role">{profile.role}</p>
          <p className="profile-location">{profile.location}</p>
        </div>
      </div>

      <nav className="nav-list" aria-label="页面分区">
        {navItems.map((item) => (
          <a
            aria-current={activeSection === item.id ? "page" : undefined}
            className={activeSection === item.id ? "active" : ""}
            href={`#${item.id}`}
            key={item.id}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle setTheme={setTheme} theme={theme} />
        <LinkDock compact links={links} />
      </div>
    </div>
  );
}

function MobileHeader({ activeSection, profile, setTheme, theme }) {
  return (
    <header className="mobile-header">
      <div className="mobile-topline">
        <a className="mobile-brand" href="#intro">
          <span>{profile.name}</span>
          <small>{profile.role}</small>
        </a>
        <ThemeToggle setTheme={setTheme} theme={theme} />
      </div>
      <nav className="mobile-nav" aria-label="移动端页面分区">
        {navItems.map((item) => (
          <a
            aria-current={activeSection === item.id ? "page" : undefined}
            className={activeSection === item.id ? "active" : ""}
            href={`#${item.id}`}
            key={item.id}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function ThemeToggle({ setTheme, theme }) {
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
      className="icon-button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "浅色模式" : "深色模式"}
      type="button"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function Section({ children, id, label }) {
  return (
    <section aria-label={label} className="page-section" id={id}>
      {children}
    </section>
  );
}

function NowList({ updates }) {
  return (
    <ol className="timeline">
      {updates.map((update) => (
        <li key={`${update.date}-${update.title}`}>
          <time>{update.date}</time>
          <div>
            <h3>{update.title}</h3>
            <p>{update.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ProjectList({ projects }) {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.name}>
          <div className="project-card-topline">
            <h3>{project.name}</h3>
            <span>{project.kind}</span>
          </div>
          <p>{project.description}</p>
          <div className="tag-row">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function LinkDock({ compact = false, links }) {
  return (
    <div className={compact ? "link-dock compact" : "link-dock"}>
      {links.map((link) => (
        <a href={link.href} key={link.label}>
          {link.label}
        </a>
      ))}
    </div>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="m4.93 4.93 2.12 2.12" />
      <path d="m16.95 16.95 2.12 2.12" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="m4.93 19.07 2.12-2.12" />
      <path d="m16.95 7.05 2.12-2.12" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.2 14.9A7.5 7.5 0 0 1 9.1 3.8a8.5 8.5 0 1 0 11.1 11.1Z" />
    </svg>
  );
}

export default App;
