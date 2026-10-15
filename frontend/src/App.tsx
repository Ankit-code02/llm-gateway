import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  Command,
  Database,
  Gauge,
  KeyRound,
  Layers3,
  Menu,
  Network,
  Radio,
  ShieldCheck,
  Terminal,
  X,
  Zap,
  Clock3,
  Eye,
  LockKeyhole,
  Server,
  Settings2,
} from "lucide-react";
import { useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const features = [
  {
    number: "01",
    icon: Zap,
    title: "Prompt caching",
    description:
      "Reuse answers to repeated prompts through Redis instead of invoking the model every time.",
    tag: "REDIS",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Access control",
    description:
      "Protect requests with API keys and apply rate limits at the gateway.",
    tag: "SECURITY",
  },
  {
    number: "03",
    icon: Activity,
    title: "Usage analytics",
    description:
      "Track request volume and cache performance through usage events and analytics.",
    tag: "OBSERVABILITY",
  },
  {
    number: "04",
    icon: Network,
    title: "A unified entry point",
    description:
      "Send application prompts through one API layer before they reach your AI model.",
    tag: "API",
  },
];

const technologies = [
  ["JAVA", "Spring Boot"],
  ["MODEL", "Ollama · Qwen 2.5"],
  ["CACHE", "Redis"],
  ["EVENTS", "Apache Kafka"],
  ["DATABASE", "PostgreSQL"],
  ["FRONTEND", "React + TypeScript"],
];

function Brand() {
  return (
    <Link to="/" className="brand" aria-label="LLM Gateway home">
      <span className="brand-mark">
        <Network size={19} strokeWidth={1.8} />
      </span>
      <span className="brand-name">
        LLM<span>GATEWAY</span>
      </span>
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />

        <button
          className="mobile-menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Overview
          </NavLink>
          <NavLink to="/playground" onClick={closeMenu}>
            Playground
          </NavLink>
          <NavLink to="/dashboard" onClick={closeMenu}>
            Analytics
          </NavLink>
          <NavLink to="/security" onClick={closeMenu}>
            Security
          </NavLink>
          <NavLink to="/docs" onClick={closeMenu}>
            Documentation
          </NavLink>
          <Link
            to="/api-keys"
            className="nav-action"
            onClick={closeMenu}
          >
            API access <ArrowUpRight size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: string;
}) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span className="section-label-line" />
      <span>{children}</span>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="architecture">
      <div className="architecture-topline">
        <span>REQUEST LIFECYCLE</span>
        <span>LOCAL DEVELOPMENT</span>
      </div>

      <div className="architecture-flow">
        <div className="architecture-node">
          <div className="architecture-icon">
            <Code2 size={19} />
          </div>
          <strong>Your application</strong>
          <span>Prompt + API key</span>
        </div>

        <div className="architecture-connector">
          <span>HTTP</span>
          <ArrowRight size={17} />
        </div>

        <div className="architecture-node gateway-node">
          <div className="architecture-icon accent-icon">
            <Network size={19} />
          </div>
          <strong>LLM Gateway</strong>
          <span>Auth · Limits · Cache</span>
        </div>

        <div className="architecture-connector">
          <span>MISS</span>
          <ArrowRight size={17} />
        </div>

        <div className="architecture-node">
          <div className="architecture-icon">
            <Layers3 size={19} />
          </div>
          <strong>Ollama / Qwen</strong>
          <span>Local inference</span>
        </div>
      </div>

      <div className="architecture-bottom">
        <div className="architecture-service">
          <Database size={15} />
          <span>Redis</span>
          <small>Prompt cache</small>
        </div>
        <div className="architecture-service">
          <Radio size={15} />
          <span>Kafka</span>
          <small>Usage events</small>
        </div>
        <div className="architecture-service">
          <Database size={15} />
          <span>PostgreSQL</span>
          <small>Usage storage</small>
        </div>
      </div>
      <p className="architecture-note">
        Conceptual architecture · cache hits can return before model inference.
      </p>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <main>
        <section className="hero page-container">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              DEVELOPER INFRASTRUCTURE / 001
            </div>

            <h1>
              AI requests.
              <br />
              <span>Under control.</span>
            </h1>

            <p className="hero-description">
              A practical control layer for local AI inference.
              Bring API access, prompt caching, rate limiting, and
              usage visibility into one place.
            </p>

            <div className="hero-actions">
              <Link to="/playground" className="button button-primary">
                Open playground <ArrowRight size={17} />
              </Link>
              <a href="#architecture" className="button button-secondary">
                Explore architecture <ArrowDownRight size={16} />
              </a>
            </div>

            <div className="hero-footnote">
              <span><Check size={14} /> Local model integration</span>
              <span><Check size={14} /> Open development stack</span>
            </div>
          </div>

          <div className="hero-console">
            <div className="console-topbar">
              <div className="console-title">
                <Terminal size={15} />
                <span>request.flow</span>
              </div>
              <span className="console-status">
                <span className="status-dot" /> READY
              </span>
            </div>

            <div className="console-body">
              <div className="console-line-number">01</div>
              <div className="console-line">
                <span className="code-muted">POST</span>{" "}
                <span className="code-white">/v1/chat</span>
              </div>

              <div className="console-line-number">02</div>
              <div className="console-line code-muted">
                {"// Submit a prompt"}
              </div>

              <div className="console-line-number">03</div>
              <div className="console-line">
                <span className="code-coral">{"{"}</span>
              </div>

              <div className="console-line-number">04</div>
              <div className="console-line indent">
                <span className="code-teal">"prompt"</span>
                <span className="code-muted">:</span>{" "}
                <span className="code-string">
                  "Explain prompt caching"
                </span>
                <span className="code-coral">,</span>
              </div>

              <div className="console-line-number">05</div>
              <div className="console-line indent">
                <span className="code-teal">"stream"</span>
                <span className="code-muted">:</span>{" "}
                <span className="code-orange">false</span>
              </div>

              <div className="console-line-number">06</div>
              <div className="console-line">
                <span className="code-coral">{"}"}</span>
              </div>

              <div className="console-divider" />

              <div className="console-result-heading">
                <span>RESPONSE PIPELINE</span>
                <span className="result-latency">LIVE BACKEND</span>
              </div>

              <div className="pipeline-row">
                <span className="pipeline-index">01</span>
                <span>Validate API key</span>
                <span className="pipeline-state"><Check size={13} /> AUTH</span>
              </div>
              <div className="pipeline-row">
                <span className="pipeline-index">02</span>
                <span>Check Redis cache</span>
                <span className="pipeline-state"><Check size={13} /> CACHE</span>
              </div>
              <div className="pipeline-row">
                <span className="pipeline-index">03</span>
                <span>Generate if needed</span>
                <span className="pipeline-model">QWEN 2.5</span>
              </div>
            </div>

            <div className="console-footer">
              <CircleDot size={13} />
              <span>Illustrative request flow</span>
              <span className="console-footer-right">JAVA / SPRING BOOT</span>
            </div>
          </div>

          <div className="hero-index">01 — THE CONTROL LAYER</div>
        </section>

        <section className="proof-strip">
          <div className="page-container proof-inner">
            <span className="proof-heading">BUILT WITH</span>
            <span><Braces size={16} /> Spring Boot</span>
            <span><Database size={16} /> Redis</span>
            <span><Radio size={16} /> Kafka</span>
            <span><Layers3 size={16} /> PostgreSQL</span>
            <span><Command size={16} /> React</span>
          </div>
        </section>

        <section className="section page-container" id="features">
          <SectionLabel number="01">WHAT IT DOES</SectionLabel>

          <div className="section-heading-row">
            <h2>
              The infrastructure
              <br />
              <span>behind the prompt.</span>
            </h2>
            <p>
              AI applications need more than a model endpoint.
              This project brings common gateway responsibilities
              into a single, inspectable service.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="feature-card" key={feature.number}>
                  <div className="feature-card-top">
                    <span className="feature-number">{feature.number}</span>
                    <Icon size={21} strokeWidth={1.6} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-tag">
                    <span /> {feature.tag}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="architecture-section" id="architecture">
          <div className="page-container architecture-layout">
            <div className="architecture-copy">
              <SectionLabel number="02">HOW IT FITS TOGETHER</SectionLabel>
              <h2>
                One entry point.
                <br />
                <span>Several responsibilities.</span>
              </h2>
              <p>
                Requests enter through the gateway, where access checks,
                rate limiting, and cache lookup happen before a model
                call is needed. Usage events feed the analytics pipeline.
              </p>
              <Link to="/docs" className="text-link">
                Read the integration guide <ArrowRight size={16} />
              </Link>
            </div>

            <ArchitectureDiagram />
          </div>
        </section>

        <section className="section page-container" id="stack">
          <SectionLabel number="03">THE STACK</SectionLabel>

          <div className="section-heading-row stack-heading">
            <h2>
              Built to be
              <br />
              <span>understood.</span>
            </h2>
            <p>
              A Java-first backend paired with familiar infrastructure
              components and a focused React interface.
            </p>
          </div>

          <div className="technology-list">
            {technologies.map(([category, name], index) => (
              <div className="technology-row" key={category}>
                <span className="technology-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="technology-category">{category}</span>
                <strong>{name}</strong>
                <Check size={16} className="technology-check" />
              </div>
            ))}
          </div>
        </section>

        <section className="closing-section page-container">
          <div className="closing-panel">
            <div>
              <span className="closing-kicker">NEXT / INTERACTIVE</span>
              <h2>
                Enough reading.
                <br />
                <span>Let's run a prompt.</span>
              </h2>
              <p>
                Try the gateway with your local model and see the
                request-response flow for yourself.
              </p>
            </div>
            <Link to="/playground" className="button button-primary">
              Go to playground <ArrowUpRight size={17} />
            </Link>
            <span className="closing-decoration">LLM / 001</span>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ToolPage({
  title,
  description,
  icon: Icon,
  status,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Gauge;
  status: string;
  children: React.ReactNode;
}) {
  return (
    <main className="tool-page page-container">
      <SectionLabel number="WORKSPACE">{status}</SectionLabel>
      <div className="tool-page-heading">
        <div className="tool-page-icon"><Icon size={23} /></div>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </main>
  );
}

function PlaygroundPage() {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendPrompt() {
    if (!prompt.trim() || !apiKey.trim() || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
        const response = await fetch(`${API_BASE_URL}/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey.trim(),
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || data.error ||
          `Request failed (${response.status})`);
      }

      setAnswer(data.answer ?? "The API returned no answer.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reach the gateway."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="AI Playground"
      description="Send a prompt to your local model through the gateway."
      icon={Terminal}
      status="01 / PLAYGROUND"
    >
      <div className="workspace-panel">
        <label className="field-label" htmlFor="api-key">
          API KEY <span>REQUIRED</span>
        </label>
        <input
          id="api-key"
          className="text-field"
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="Paste your gateway API key"
        />

        <label className="field-label" htmlFor="prompt-input">
          PROMPT <span>POST /v1/chat</span>
        </label>
        <textarea
          id="prompt-input"
          className="text-field prompt-field"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask your local model something..."
          rows={7}
        />

        <button
          className="button button-primary"
          onClick={sendPrompt}
          disabled={loading || !prompt.trim() || !apiKey.trim()}
        >
          {loading ? "Waiting for model..." : "Send prompt"}
          {!loading && <ArrowRight size={16} />}
        </button>

        {error && (
          <div className="feedback-box feedback-error" role="alert">
            <X size={17} /> {error}
          </div>
        )}

        {answer && (
          <div className="answer-panel" aria-live="polite">
            <div className="answer-heading">
              <span><Check size={15} /> MODEL RESPONSE</span>
              <button className="copy-button" onClick={() => {
                void navigator.clipboard.writeText(answer);
              }}>
                Copy answer
              </button>
            </div>
            <p>{answer}</p>
          </div>
        )}
      </div>
      <p className="page-footnote">
        Your API key is used for this request and is not saved by this page.
        Ensure the backend is running on localhost:8080.
      </p>
    </ToolPage>
  );
}

function DashboardPage() {
  const [metrics, setMetrics] = useState<{
    totalRequests: number;
    cacheHits: number;
    cacheMisses: number;
    cacheHitRatePercent: number;
  } | null>(null);

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadMetrics() {
    if (!token.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/internal/analytics/summary`, {
        headers: { "X-Admin-Token": token.trim() },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || `Analytics request failed (${response.status})`
        );
      }

      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  const cacheData = metrics
    ? [
        { name: "Cache hits", value: metrics.cacheHits },
        { name: "Cache misses", value: metrics.cacheMisses },
      ]
    : [];

  const requestData = metrics
    ? [
        { name: "Total requests", value: metrics.totalRequests },
        { name: "Cache hits", value: metrics.cacheHits },
        { name: "Cache misses", value: metrics.cacheMisses },
      ]
    : [];

  return (
    <ToolPage
      title="Usage analytics"
      description="Inspect request volume and prompt-cache performance."
      icon={Gauge}
      status="02 / OBSERVABILITY"
    >
      <div className="workspace-panel">
        <label className="field-label" htmlFor="admin-token">
          ADMIN TOKEN <span>REQUIRED</span>
        </label>

        <input
          id="admin-token"
          className="text-field"
          type="password"
          autoComplete="off"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Enter your configured admin token"
        />

        <button
          className="button button-primary"
          onClick={loadMetrics}
          disabled={loading || !token.trim()}
        >
          {loading ? "Loading metrics..." : metrics ? "Refresh analytics" : "Load analytics"}
          <ArrowRight size={16} />
        </button>

        {error && (
          <div className="feedback-box feedback-error" role="alert">
            <X size={17} /> {error}
          </div>
        )}
      </div>

      {metrics && (
        <section className="analytics-results" aria-label="Usage analytics results">
          <div className="metrics-grid">
            <Metric label="TOTAL REQUESTS" value={metrics.totalRequests} />
            <Metric label="CACHE HITS" value={metrics.cacheHits} />
            <Metric label="CACHE MISSES" value={metrics.cacheMisses} />
            <Metric
              label="CACHE HIT RATE"
              value={`${metrics.cacheHitRatePercent}%`}
            />
          </div>

          <div className="analytics-chart-grid">
            <section className="workspace-panel chart-panel">
              <div className="chart-heading">
                <div>
                  <span className="field-label">REQUEST BREAKDOWN</span>
                  <h2>Gateway activity</h2>
                </div>
                <Activity size={20} />
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={requestData}
                    margin={{ top: 12, right: 8, left: -20, bottom: 4 }}
                  >
                    <CartesianGrid stroke="#30413E" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#A7B9B3", fontSize: 11 }}
                      axisLine={{ stroke: "#405750" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#A7B9B3", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#192726",
                        border: "1px solid #405750",
                        color: "#F1EEE5",
                        borderRadius: 0,
                      }}
                    />
                    <Bar dataKey="value" name="Requests" fill="#75C8B3" maxBarSize={54} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="workspace-panel chart-panel">
              <div className="chart-heading">
                <div>
                  <span className="field-label">CACHE PERFORMANCE</span>
                  <h2>Hit vs. miss</h2>
                </div>
                <Gauge size={20} />
              </div>

              <div className="chart-container">
                {metrics.cacheHits + metrics.cacheMisses === 0 ? (
                  <p className="workspace-copy">No cache events have been recorded yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cacheData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="48%"
                        innerRadius={62}
                        outerRadius={92}
                        paddingAngle={4}
                      >
                        <Cell fill="#75C8B3" />
                        <Cell fill="#E58F79" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#192726",
                          border: "1px solid #405750",
                          color: "#F1EEE5",
                          borderRadius: 0,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="chart-legend">
                <span><i className="legend-hit" /> Cache hits: {metrics.cacheHits}</span>
                <span><i className="legend-miss" /> Cache misses: {metrics.cacheMisses}</span>
              </div>
            </section>
          </div>

          <section className="workspace-panel cache-summary">
            <div className="metric-bar-heading">
              <span>Cache hit rate</span>
              <strong>{metrics.cacheHitRatePercent}%</strong>
            </div>
            <div
              className="metric-bar-track"
              role="progressbar"
              aria-label="Cache hit rate"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.max(0, Math.min(100, metrics.cacheHitRatePercent))}
            >
              <div
                className="metric-bar-fill"
                style={{
                  width: `${Math.max(0, Math.min(100, metrics.cacheHitRatePercent))}%`,
                }}
              />
            </div>
            <p className="page-footnote">
              These charts show the current aggregate metrics returned by the backend,
              not historical trends.
            </p>
          </section>
        </section>
      )}

      <p className="page-footnote">
        Metrics are fetched from your backend on demand. No sample data is shown.
      </p>
    </ToolPage>
  );
}
function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ApiKeysPage() {
  const [teamName, setTeamName] = useState("");
  const [keyName, setKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState("");
  const [createdKeyName, setCreatedKeyName] = useState("");
  const [createdTeamName, setCreatedTeamName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

  async function createKey(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!teamName.trim() || !keyName.trim() || loading) return;

    setLoading(true);
    setError("");
    setMessage("");
    setCreatedKey("");
    setCopied(false);

    try {
      const response = await fetch(`${API_BASE_URL}/internal/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: teamName.trim(),
          keyName: keyName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            data.error ||
            `Key creation failed (${response.status})`
        );
      }

      if (!data.apiKey) {
        throw new Error("The server did not return an API key.");
      }

      setCreatedKey(data.apiKey);
      setCreatedKeyName(keyName.trim());
      setCreatedTeamName(teamName.trim());
      setMessage(
        data.warning ||
          "Your key has been created. Copy it now because it may not be shown again."
      );
      setTeamName("");
      setKeyName("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create the API key."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setError("");
    } catch {
      setError("Clipboard access failed. Select the key and copy it manually.");
    }
  }

  return (
    <ToolPage
      title="API access"
      description="Manage credentials for applications using your AI gateway."
      icon={KeyRound}
      status="03 / ACCESS CONTROL"
    >
      <div className="key-page">
        <div className="key-overview-grid">
          <article className="key-overview-card">
            <span className="key-card-icon"><KeyRound size={19} /></span>
            <span className="key-card-label">KEY CREATION</span>
            <strong>On demand</strong>
            <p>Create a credential for a team or application.</p>
          </article>

          <article className="key-overview-card">
            <span className="key-card-icon"><ShieldCheck size={19} /></span>
            <span className="key-card-label">ACCESS SECURITY</span>
            <strong>API-key protected</strong>
            <p>Requests use the gateway's API-key authentication.</p>
          </article>

          <article className="key-overview-card">
            <span className="key-card-icon"><Database size={19} /></span>
            <span className="key-card-label">KEY INVENTORY</span>
            <strong>Not connected</strong>
            <p>Listing and revocation require backend support.</p>
          </article>
        </div>

        <div className="key-management-grid">
          <section className="workspace-panel key-create-panel">
            <div className="key-panel-heading">
              <div>
                <span className="field-label">NEW CREDENTIAL</span>
                <h2>Create an API key</h2>
              </div>
              <KeyRound size={22} />
            </div>

            <p className="workspace-copy">
              Give each team or application its own key so credentials can be
              managed separately.
            </p>

            <form onSubmit={createKey} className="key-create-form">
              <label className="field-label" htmlFor="team-name">
                TEAM NAME <span>REQUIRED</span>
              </label>
              <input
                id="team-name"
                className="text-field"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                placeholder="e.g. Development"
                maxLength={100}
                required
              />

              <label className="field-label" htmlFor="key-name">
                KEY NAME <span>REQUIRED</span>
              </label>
              <input
                id="key-name"
                className="text-field"
                value={keyName}
                onChange={(event) => setKeyName(event.target.value)}
                placeholder="e.g. local-development"
                maxLength={100}
                required
              />

              <button
                className="button button-primary"
                type="submit"
                disabled={loading || !teamName.trim() || !keyName.trim()}
              >
                {loading ? "Creating key..." : "Generate API key"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {error && (
              <div className="feedback-box feedback-error" role="alert">
                <X size={17} /> {error}
              </div>
            )}

            <div className="key-security-note">
              <ShieldCheck size={17} />
              <p>
                Keep credentials private. Never commit raw API keys to GitHub
                or include them in public screenshots.
              </p>
            </div>
          </section>

          <section className="workspace-panel key-inventory-panel">
            <div className="key-panel-heading">
              <div>
                <span className="field-label">CREDENTIALS</span>
                <h2>Key inventory</h2>
              </div>
              <span className="key-status-badge">
                <span /> Inventory unavailable
              </span>
            </div>

            <p className="workspace-copy">
              The complete list of issued keys will appear here once the
              backend provides a secure key-listing endpoint.
            </p>

            <div className="key-table-wrap">
              <table className="key-table">
                <thead>
                  <tr>
                    <th>KEY / TEAM</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {createdKey ? (
                    <tr>
                      <td>
                        <strong>{createdKeyName}</strong>
                        <span>{createdTeamName}</span>
                        <small>Created in this session</small>
                      </td>
                      <td>
                        <span className="key-status-badge key-status-created">
                          <span /> Created
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="copy-button"
                          onClick={() => setShowRevokeDialog(true)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={3}>
                        <div className="key-empty-state">
                          <KeyRound size={27} />
                          <strong>No session keys to display</strong>
                          <p>
                            Create a key to see its details here. Existing
                            keys cannot yet be listed from this screen.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="page-footnote">
              This table only shows a key created during the current page
              session. It is not a complete record of backend keys.
            </p>
          </section>
        </div>

        {createdKey && (
          <section className="workspace-panel key-created-panel" aria-live="polite">
            <div className="key-panel-heading">
              <div>
                <span className="field-label">ONE-TIME DISPLAY</span>
                <h2><Check size={20} /> API key created</h2>
              </div>
              <span className="key-status-badge key-status-created">
                <span /> Created
              </span>
            </div>

            <p className="workspace-copy">{message}</p>

            <div className="key-secret-row">
              <input
                className="text-field"
                type="password"
                value={createdKey}
                readOnly
                aria-label="New API key"
                onFocus={(event) => event.currentTarget.select()}
              />
              <button
                type="button"
                className="button button-primary"
                onClick={copyKey}
              >
                {copied ? <Check size={16} /> : <Code2 size={16} />}
                {copied ? "Copied" : "Copy key"}
              </button>
            </div>

            <p className="page-footnote">
              Copy and store this key securely. Leaving or refreshing this
              page clears the displayed key from this UI.
            </p>
          </section>
        )}

        {showRevokeDialog && (
          <div
            className="key-dialog-backdrop"
            role="presentation"
            onClick={() => setShowRevokeDialog(false)}
          >
            <section
              className="key-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="key-dialog-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="key-dialog-icon"><ShieldCheck size={23} /></div>
              <h2 id="key-dialog-title">Key management</h2>
              <p>
                This key belongs to <strong>{createdTeamName}</strong> and is
                named <strong>{createdKeyName}</strong>.
              </p>
              <p className="workspace-copy">
                Revocation is not connected yet. We need a backend revocation
                endpoint before this interface can disable a credential.
              </p>
              <div className="key-dialog-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowRevokeDialog(false)}
                >
                  Close
                </button>
                <button type="button" className="button button-primary" disabled>
                  Revoke key — unavailable
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </ToolPage>
  );
}

function SecurityPage() {
  const controls = [
    {
      icon: LockKeyhole,
      title: "API-key authentication",
      detail: "Requests to the chat endpoint require an API key.",
      status: "Configured",
      tone: "configured",
    },
    {
      icon: Clock3,
      title: "Rate limiting",
      detail: "Configured limit: 10 requests per minute.",
      status: "Configured",
      tone: "configured",
    },
    {
      icon: Eye,
      title: "PII redaction",
      detail: "Sensitive information is handled by the redaction layer.",
      status: "Implemented",
      tone: "configured",
    },
    {
      icon: Database,
      title: "Redis prompt cache",
      detail: "Cache entries are configured with a five-minute TTL.",
      status: "5 min TTL",
      tone: "configured",
    },
    {
      icon: Layers3,
      title: "Local model",
      detail: "Ollama with the qwen2.5:3b model.",
      status: "Configured",
      tone: "configured",
    },
    {
      icon: Radio,
      title: "Usage event pipeline",
      detail: "Kafka events and PostgreSQL usage storage.",
      status: "Integration status unverified",
      tone: "pending",
    },
  ];

  return (
    <ToolPage
      title="Security & controls"
      description="Review the gateway's configured safeguards and infrastructure."
      icon={ShieldCheck}
      status="04 / SECURITY"
    >
      <div className="security-page">
        <section className="workspace-panel security-intro">
          <div className="security-intro-icon">
            <ShieldCheck size={26} />
          </div>
          <div>
            <span className="field-label">GATEWAY CONFIGURATION</span>
            <h2>Protection at the entry point</h2>
            <p className="workspace-copy">
              These controls describe the project's configured features.
              This page does not claim that every service is healthy or
              currently reachable.
            </p>
          </div>
          <span className="key-status-badge">
            <span />
            Live health checks not connected
          </span>
        </section>

        <div className="security-control-grid">
          {controls.map((control) => {
            const Icon = control.icon;

            return (
              <article className="workspace-panel security-control-card" key={control.title}>
                <div className="security-control-top">
                  <span className="security-control-icon">
                    <Icon size={21} />
                  </span>
                  <span
                    className={`key-status-badge ${
                      control.tone === "configured"
                        ? "key-status-created"
                        : ""
                    }`}
                  >
                    <span />
                    {control.status}
                  </span>
                </div>

                <h2>{control.title}</h2>
                <p className="workspace-copy">{control.detail}</p>
              </article>
            );
          })}
        </div>

        <section className="workspace-panel security-guidance">
          <div className="key-panel-heading">
            <div>
              <span className="field-label">OPERATIONAL GUIDANCE</span>
              <h2>Security checklist</h2>
            </div>
            <Settings2 size={21} />
          </div>

          <ul className="security-checklist">
            <li>
              <LockKeyhole size={17} />
              <span>
                <strong>Keep credentials private</strong>
                Never commit API keys or admin tokens to source control.
              </span>
            </li>
            <li>
              <Eye size={17} />
              <span>
                <strong>Protect sensitive prompts</strong>
                Review redaction behavior before sending real user data.
              </span>
            </li>
            <li>
              <Server size={17} />
              <span>
                <strong>Verify infrastructure before deployment</strong>
                Check service health, configuration, and access restrictions.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </ToolPage>
  );
}

function DocsPage() {
  return (
    <ToolPage
      title="Documentation"
      description="Connect an application to your local AI gateway."
      icon={Braces}
      status="04 / DOCUMENTATION"
    >
      <div className="workspace-panel">
        <span className="field-label">CHAT ENDPOINT</span>
        <div className="endpoint-line">
          <span>POST</span> http://localhost:8080/v1/chat
        </div>

        <span className="field-label">REQUEST HEADERS</span>
        <pre className="code-block">{`Content-Type: application/json
X-API-Key: YOUR_API_KEY`}</pre>

        <span className="field-label">REQUEST BODY</span>
        <pre className="code-block">{`{
  "prompt": "Explain prompt caching"
}`}</pre>

        <span className="field-label">SUCCESS RESPONSE</span>
        <pre className="code-block">{`{
  "answer": "Prompt caching stores reusable results..."
}`}</pre>

        <span className="field-label">POWERSHELL EXAMPLE</span>
        <pre className="code-block">{`$headers = @{
    "X-API-Key" = "YOUR_API_KEY"
}

$body = @{
    prompt = "Explain prompt caching"
} | ConvertTo-Json

Invoke-RestMethod \`
    -Method Post \`
    -Uri "http://localhost:8080/v1/chat" \`
    -Headers $headers \`
    -ContentType "application/json" \`
    -Body $body`}</pre>

        <div className="notice-heading">
          <CircleDot size={17} />
          <strong>ADMIN ANALYTICS</strong>
        </div>

        <span className="field-label">GET /internal/analytics/summary</span>
        <p className="workspace-copy">
          Retrieve aggregate gateway request and cache statistics.
          This endpoint requires the admin token.
        </p>

        <pre className="code-block">{`$headers = @{
    "X-Admin-Token" = "YOUR_ADMIN_TOKEN"
}

Invoke-RestMethod \`
    -Method Get \`
    -Uri "http://localhost:8080/internal/analytics/summary" \`
    -Headers $headers`}</pre>

        <span className="field-label">ANALYTICS RESPONSE</span>
        <pre className="code-block">{`{
  "totalRequests": 0,
  "cacheHits": 0,
  "cacheMisses": 0,
  "cacheHitRatePercent": 0
}`}</pre>

        <div className="notice-heading">
          <CircleDot size={17} />
          <strong>LOCAL DEVELOPMENT</strong>
        </div>

        <p className="workspace-copy">
          The backend must be running at localhost:8080 and Ollama
          must be available locally. Use a valid API key for chat
          requests and the configured admin token for analytics.
        </p>

        <div className="notice-heading">
          <LockKeyhole size={17} />
          <strong>SECURITY NOTES</strong>
        </div>

        <p className="workspace-copy">
          Keep API keys and admin tokens private. Do not commit
          credentials to GitHub or expose admin tokens in frontend
          production code. Store credentials in environment variables
          or a secure secret manager.
        </p>

        <div className="notice-heading">
          <CircleDot size={17} />
          <strong>ERROR HANDLING</strong>
        </div>

        <p className="workspace-copy">
          If a request fails, check the HTTP status and response body.
          Common causes include a missing or invalid credential,
          an unavailable backend, or an unavailable local model.
          Exact status codes depend on the backend implementation.
        </p>

        <Link to="/playground" className="text-link">
          Try a request <ArrowRight size={16} />
        </Link>
      </div>
    </ToolPage>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <Brand />
        <span>Built to understand the flow behind every prompt.</span>
        <a href="#top" className="back-to-top">
          BACK TO TOP <ChevronRight size={14} />
        </a>
      </div>
    </footer>
  );
}

function AppLayout() {
  return (
    <div className="app-shell" id="top">
      <Header />
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/playground" element={<PlaygroundPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/api-keys" element={<ApiKeysPage />} />
  <Route path="/security" element={<SecurityPage />} />
  <Route path="/docs" element={<DocsPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
    </div>
  );
}
function NotFoundPage() {
  return (
    <ToolPage
      title="Page not found"
      description="The page you're looking for doesn't exist."
      icon={Braces}
      status="404 / NOT FOUND"
    >
      <div className="workspace-panel">
        <p className="workspace-copy">
          Check the URL or return to the overview page.
        </p>
        <Link to="/" className="text-link">
          Back to overview <ArrowRight size={16} />
        </Link>
      </div>
    </ToolPage>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}