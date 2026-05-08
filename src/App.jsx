import { useEffect, useMemo, useState } from "react";

const navItems = [
  { id: "intro", label: "Intro" },
  { id: "updates", label: "Updates" },
  // { id: "projects", label: "Projects" },
  { id: "publishing", label: "Publications" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

const updates = [
  {
    date: "2026.05.01",
    title: "PrivGate accepted to ICML 2026",
    body: "Thrilled to share that our paper \"PrivGate: Steering Contextual Integrity in LLMs via Latent Space Geometry\" has been accepted to ICML.",
    href: "https://openreview.net/pdf?id=oKizUOP7E4",
  },
];

const projects = [
  {
    name: "Signal Desk",
    kind: "Product Prototype",
    description:
      "A lightweight workspace for collecting, filtering, and reviewing weak signals across research and product ideas.",
    tags: ["React", "Workflow", "Local-first"],
  },
];

const posts = [
  {
    title: "The Core of Agent Safety Is Constraining Uncertain Decision Systems",
    meta: "Agent Safety / 12 min",
    href: "#/articles/agent-safety-core",
    source: `${import.meta.env.BASE_URL}articles/agent-safety-core.md`,
    slug: "agent-safety-core",
  },
];

const publications = [
  {
    title:
      "PrivGate: Steering Contextual Integrity in LLMs via Latent Space Geometry",
    authors: "Runshan Hu, Yukun Dong, Yingying Huangfu, Ruohan Zhao, Yi Xie, and Tieyan Li",
    venue:
      "The 43rd International Conference on Machine Learning (ICML 2026)",
    href: "https://icml.cc/virtual/2026/poster/61631",
  },
  {
    title: "Privacy-Preserving Ridesharing via Probabilistic Matching",
    authors: "Tianye Ma, Yukun Dong, Yidan Hu, and Rui Zhang",
    venue:
      "2024 IEEE/ACM 32nd International Symposium on Quality of Service (IWQoS 2024)",
    href: "https://doi.org/10.1109/IWQoS61813.2024.10682893",
  },
  {
    title: "Locally Differentially Private and Fair Key-Value Aggregation",
    authors: "Yukun Dong, Zhengwu Lu, and Rui Zhang",
    venue:
      "The 12th International Symposium on Information and Communication Technology (SOICT 2023)",
    href: "https://doi.org/10.1145/3628797.3628807",
  },
  {
    title:
      "Authenticating Outsourced Location-Based Skyline Queries under Shortest Path Distance",
    authors: "Yidan Hu, Yukun Dong, Wenxin Chen, Yingfei Dong, and Rui Zhang",
    venue: "2023 IEEE Conference on Communications and Network Security (CNS 2023)",
    href: "https://doi.org/10.1109/CNS59707.2023.10288754",
  },
  {
    title: "Location Inference under Temporal Correlation",
    authors: "Yukun Dong, Yidan Hu, Aisha Aseeri, Depeng Li, and Rui Zhang",
    venue:
      "2023 32nd International Conference on Computer Communications and Networks (ICCCN 2023)",
    href: "https://doi.org/10.1109/ICCCN58024.2023.10230099",
  },
  {
    title: "Continuous Indoor Tracking via Differential RSS Fingerprinting",
    authors: "Yunzhi Li, Yidan Hu, Aishah Aseeri, Yukun Dong, and Rui Zhang",
    venue:
      "2022 IEEE 19th International Conference on Mobile Ad Hoc and Smart Systems (MASS 2022)",
    href: "https://doi.org/10.1109/MASS56207.2022.00072",
  },
  {
    title: "Memory-based stag hunt game on regular lattices",
    authors: "Yukun Dong, Hedong Xu, and Suohai Fan",
    venue: "Physica A: Statistical Mechanics and its Applications, 2019",
    href: "https://doi.org/10.1016/j.physa.2018.12.025",
  },
  {
    title: "Location of Facility Based on Simulated Annealing and \"ZKW\" Algorithms",
    authors: "Yukun Dong, Jinyu Wang, Fenghua Chen, Yong Hu, and Yong Deng",
    venue: "Mathematical Problems in Engineering, 2017",
    href: "https://doi.org/10.1155/2017/4628501",
  }
];

const links = [
  { label: "Email", href: "mailto:yukun.dong@hotmail.com" },
  { label: "GitHub", href: "https://github.com/KunCheung" },
];

const profileImage = `${import.meta.env.BASE_URL}avatar.jpg`;

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
      ? `${activeArticle.title} - Personal Homepage`
      : "Personal Homepage";
  }, [activeArticle]);

  const profile = useMemo(
    () => ({
      name: "Yukun Dong",
      nativeName: "(董昱坤)",
      role: "Privacy and Security Researcher",
      location: "Shenzhen, China",
      summary:
        "I recently completed my postdoctoral research at Huawei, where I worked with Dr. Tieyan Li on digital identity, trust, and privacy for LLM-based agents. I received my Ph.D. from the University of Delaware, where I was advised by Prof. Rui Zhang and worked on security and privacy in AI and cloud computing systems.\n\nMy research interests include Privacy-Enhancing Technologies, Agent Security and Privacy, with a focus on building trustworthy AI agents that protect sensitive data across its entire lifecycle.",
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

      <aside className="sidebar" aria-label="Personal homepage navigation">
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
        <div className="intro-copy">
          <p className="eyebrow">Personal OS</p>
          <p className="lead">{profile.summary}</p>
          <div className="intro-actions" aria-label="Primary actions">
            <a className="primary-link" href="#publishing">
              View Publications
            </a>
          </div>
        </div>
      </Section>

      <Section id="updates" label="Updates">
        <div className="section-heading">
          <p className="eyebrow">Latest News</p>
        </div>
        <NowList updates={updates} />
      </Section>

      {/* <Section id="projects" label="Projects">
        <div className="section-heading">
          <p className="eyebrow">Projects</p>
        </div>
        <ProjectList projects={projects} />
      </Section> */}

      <Section id="publishing" label="Publications">
        <div className="section-heading">
          <p className="eyebrow">Publications</p>
        </div>
        <div className="publication-list">
          {publications.map((publication) => (
            <article className="publication-item" key={publication.title}>
              <h3>{publication.title}</h3>
              <p>{publication.authors}</p>
              <p>{publication.venue}</p>
              <a href={publication.href} rel="noreferrer" target="_blank">
                [Paper link]
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section id="writing" label="Writing">
        <div className="section-heading">
          <p className="eyebrow">Writing</p>
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
            <h2>
              Feel free to reach out if you'd like to connect, collaborate, or just say hi!
            </h2>
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
        Back to Writing
      </a>
      <div className="article-meta">
        <p className="eyebrow">Writing</p>
        <span>{article.meta}</span>
      </div>
      {status === "loading" && (
        <p className="article-status">Loading article...</p>
      )}
      {status === "error" && (
        <p className="article-status">
          This article could not be loaded. Please try again later.
        </p>
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
          alt="Profile placeholder"
          width="160"
          height="160"
        />
        <div>
          <p className="profile-name">{profile.name}</p>
          <p className="profile-native-name">{profile.nativeName}</p>
          <p className="profile-role">{profile.role}</p>
          <p className="profile-location">{profile.location}</p>
        </div>
      </div>

      <nav className="nav-list" aria-label="Page sections">
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
          <span className="mobile-native-name">{profile.nativeName}</span>
          <small>{profile.role}</small>
        </a>
        <ThemeToggle setTheme={setTheme} theme={theme} />
      </div>
      <nav className="mobile-nav" aria-label="Mobile page sections">
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
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="icon-button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Light mode" : "Dark mode"}
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
            <h3>
              {update.href ? (
                <a href={update.href} rel="noreferrer" target="_blank">
                  {update.title}
                </a>
              ) : (
                update.title
              )}
            </h3>
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
