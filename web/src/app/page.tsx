import CopyCommand from "@/components/CopyCommand";

export default function Home() {
  return (
    <>
      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(13,15,20,.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1e2330",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "56px",
            maxWidth: "740px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 600,
              fontSize: "15px",
              color: "#e8eaf0",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: "26px",
                height: "26px",
                background: "#4c8dff",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity=".9" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity=".5" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity=".5" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity=".9" />
              </svg>
            </span>
            LayoutPick
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="#install" style={{ fontSize: "14px", color: "#7b8299", textDecoration: "none" }}>
              Install
            </a>
            <a href="#usage" style={{ fontSize: "14px", color: "#7b8299", textDecoration: "none" }}>
              Usage
            </a>
            <a
              href="https://github.com/layoutpick/layoutpick"
              style={{ fontSize: "14px", color: "#7b8299", textDecoration: "none" }}
            >
              GitHub
            </a>
            <a
              href="https://chromewebstore.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 500,
                padding: "6px 14px",
                borderRadius: "6px",
                background: "#4c8dff",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Add to Chrome
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section style={{ padding: "96px 0 80px" }}>
          <div style={{ width: "100%", maxWidth: "740px", margin: "0 auto", padding: "0 24px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#38c9b0",
                background: "rgba(56,201,176,.10)",
                border: "1px solid rgba(56,201,176,.20)",
                borderRadius: "20px",
                padding: "4px 12px",
                marginBottom: "28px",
                letterSpacing: ".02em",
                textTransform: "uppercase",
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="4" fill="#38c9b0" />
              </svg>
              macOS · Chrome extension
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 2.75rem)",
                fontWeight: 600,
                letterSpacing: "-.02em",
                lineHeight: 1.18,
                marginBottom: "20px",
                color: "#fff",
              }}
            >
              Pick any element.
              <br />
              Send it to <span style={{ color: "#4c8dff" }}>Claude Code</span>.
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "#7b8299",
                maxWidth: "520px",
                lineHeight: 1.7,
                marginBottom: "40px",
              }}
            >
              Hover over any UI element in Chrome, press <strong>Alt+S</strong>, and LayoutPick captures a
              markdown description + screenshot — ready to drop into your Claude Code session with{" "}
              <code
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: ".9em",
                  background: "#1a1e28",
                  border: "1px solid #252a38",
                  borderRadius: "4px",
                  padding: "1px 6px",
                  color: "#38c9b0",
                }}
              >
                /pick
              </code>
              .
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <a
                href="https://chromewebstore.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "12px 22px",
                  borderRadius: "10px",
                  background: "#4c8dff",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="2.5" fill="white" />
                  <path
                    d="M8 1.5v4M8 10.5v4M1.5 8h4M10.5 8h4"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Add to Chrome
              </a>
              <a
                href="#install"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "15px",
                  fontWeight: 500,
                  padding: "12px 22px",
                  borderRadius: "10px",
                  border: "1px solid #252a38",
                  color: "#7b8299",
                  background: "transparent",
                  textDecoration: "none",
                }}
              >
                Read the install guide →
              </a>
            </div>

            {/* Demo visual */}
            <div
              aria-hidden="true"
              style={{
                marginTop: "60px",
                border: "1px solid #252a38",
                borderRadius: "12px",
                background: "#13161d",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "12px 16px",
                  borderBottom: "1px solid #1e2330",
                  background: "#1a1e28",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#ff5f57",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#febc2e",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#28c840",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#454d66",
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  stripe.com/docs/payments
                </span>
              </div>
              <div
                style={{
                  padding: "28px 24px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  minHeight: "180px",
                }}
              >
                <div
                  style={{
                    border: "1px solid #4c8dff",
                    borderRadius: "8px",
                    padding: "16px",
                    fontSize: "13px",
                    background: "rgba(76,141,255,.12)",
                    color: "#7b8299",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-11px",
                      left: "12px",
                      fontSize: "10px",
                      fontFamily: '"JetBrains Mono", monospace',
                      color: "#4c8dff",
                      background: "#0d0f14",
                      padding: "0 6px",
                    }}
                  >
                    Alt+S → click
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "#4c8dff",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    Captured
                  </div>
                  <div style={{ fontSize: "13px", lineHeight: 1.5, color: "#7b8299" }}>
                    Primary button · &quot;Pay now&quot; · rounded-full · bg-indigo-600 · 48px tall
                  </div>
                </div>
                <div
                  style={{
                    border: "1px solid #252a38",
                    borderRadius: "8px",
                    padding: "16px",
                    fontSize: "13px",
                    color: "#454d66",
                  }}
                >
                  <span style={{ color: "#454d66", fontSize: ".85rem" }}>
                    Card component
                    <br />
                    Product grid
                    <br />
                    Nav link
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" style={{ padding: "80px 0", borderTop: "1px solid #1e2330" }}>
          <div style={{ width: "100%", maxWidth: "740px", margin: "0 auto", padding: "0 24px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "#4c8dff",
                marginBottom: "12px",
              }}
            >
              How it works
            </p>
            <h2
              style={{
                fontSize: "1.65rem",
                fontWeight: 600,
                letterSpacing: "-.02em",
                color: "#fff",
                marginBottom: "12px",
                lineHeight: 1.25,
              }}
            >
              Three steps, zero friction
            </h2>
            <p style={{ fontSize: "1rem", color: "#7b8299", marginBottom: "40px", maxWidth: "500px" }}>
              LayoutPick bridges the gap between what you see in the browser and what Claude Code can act on.
            </p>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: "20px",
                  padding: "28px 0",
                  borderBottom: "1px solid #1e2330",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(76,141,255,.12)",
                    border: "1px solid rgba(76,141,255,.3)",
                    color: "#4c8dff",
                    fontSize: "14px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  1
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>
                    Pick an element
                  </h3>
                  <p style={{ fontSize: ".95rem", color: "#7b8299", lineHeight: 1.65 }}>
                    Press{" "}
                    <kbd
                      style={{
                        display: "inline-block",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "12px",
                        background: "#1a1e28",
                        border: "1px solid #252a38",
                        borderBottom: "2px solid #252a38",
                        borderRadius: "4px",
                        padding: "2px 7px",
                        color: "#7b8299",
                      }}
                    >
                      Alt+S
                    </kbd>{" "}
                    (or click the LayoutPick toolbar button) to enter pick mode. Hover over any element on the
                    page — it highlights in blue. Click to capture it.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: "20px",
                  padding: "28px 0",
                  borderBottom: "1px solid #1e2330",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(76,141,255,.12)",
                    border: "1px solid rgba(76,141,255,.3)",
                    color: "#4c8dff",
                    fontSize: "14px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  2
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>
                    It lands in your inbox
                  </h3>
                  <p style={{ fontSize: ".95rem", color: "#7b8299", lineHeight: 1.65 }}>
                    LayoutPick writes a markdown description + full-resolution screenshot to your local pick
                    inbox. The extension sends it to the native host running on your Mac in milliseconds — no
                    cloud involved.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: "20px",
                  padding: "28px 0",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(76,141,255,.12)",
                    border: "1px solid rgba(76,141,255,.3)",
                    color: "#4c8dff",
                    fontSize: "14px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  3
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>
                    Run{" "}
                    <code
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: ".85em",
                        background: "#1a1e28",
                        border: "1px solid #252a38",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        color: "#38c9b0",
                      }}
                    >
                      /pick
                    </code>{" "}
                    in Claude Code
                  </h3>
                  <p style={{ fontSize: ".95rem", color: "#7b8299", lineHeight: 1.65 }}>
                    Switch to your Claude Code session and run{" "}
                    <code
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: ".85em",
                        background: "#1a1e28",
                        border: "1px solid #252a38",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        color: "#38c9b0",
                      }}
                    >
                      /pick
                    </code>
                    . The element description and screenshot are injected into the conversation automatically.
                    Pick several elements first?{" "}
                    <code
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: ".85em",
                        background: "#1a1e28",
                        border: "1px solid #252a38",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        color: "#38c9b0",
                      }}
                    >
                      /pick 3
                    </code>{" "}
                    sends the last three at once.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Install */}
        <section id="install" style={{ padding: "80px 0", borderTop: "1px solid #1e2330" }}>
          <div style={{ width: "100%", maxWidth: "740px", margin: "0 auto", padding: "0 24px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "#4c8dff",
                marginBottom: "12px",
              }}
            >
              Install
            </p>
            <h2
              style={{
                fontSize: "1.65rem",
                fontWeight: 600,
                letterSpacing: "-.02em",
                color: "#fff",
                marginBottom: "12px",
                lineHeight: 1.25,
              }}
            >
              Up in two steps
            </h2>
            <p style={{ fontSize: "1rem", color: "#7b8299", marginBottom: "40px", maxWidth: "500px" }}>
              The Chrome extension handles picking; the native installer wires up the{" "}
              <code
                style={{
                  fontSize: ".85em",
                  fontFamily: '"JetBrains Mono", monospace',
                  background: "#1a1e28",
                  border: "1px solid #252a38",
                  borderRadius: "4px",
                  padding: "1px 6px",
                  color: "#38c9b0",
                }}
              >
                /pick
              </code>{" "}
              command into Claude Code.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Install Step 1 */}
              <div style={{ border: "1px solid #252a38", borderRadius: "10px", overflow: "hidden" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "18px 20px",
                    background: "#13161d",
                    borderBottom: "1px solid #1e2330",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#4c8dff",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "#fff" }}>
                    Add LayoutPick to Chrome
                  </h3>
                </div>
                <div style={{ padding: "20px", background: "#13161d" }}>
                  <p style={{ fontSize: ".9rem", color: "#7b8299", marginBottom: "16px" }}>
                    Install the Chrome extension from the Web Store. It adds the pick overlay and the toolbar
                    button.
                  </p>
                  <a
                    href="https://chromewebstore.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "11px 20px",
                      borderRadius: "6px",
                      background: "#1a1e28",
                      border: "1px solid #252a38",
                      color: "#e8eaf0",
                      textDecoration: "none",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7.5" stroke="#4c8dff" strokeWidth="1.5" />
                      <circle cx="9" cy="9" r="3" fill="#4c8dff" />
                      <path
                        d="M9 1.5v5M9 11.5v5M1.5 9h5M11.5 9h5"
                        stroke="#4c8dff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Chrome Web Store →
                  </a>
                </div>
              </div>

              {/* Install Step 2 */}
              <div style={{ border: "1px solid #252a38", borderRadius: "10px", overflow: "hidden" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "18px 20px",
                    background: "#13161d",
                    borderBottom: "1px solid #1e2330",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#4c8dff",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "#fff" }}>Run the installer</h3>
                </div>
                <div style={{ padding: "20px", background: "#13161d" }}>
                  <p style={{ fontSize: ".9rem", color: "#7b8299", marginBottom: "16px" }}>
                    This registers the native host and wires up the{" "}
                    <code
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: ".85em",
                        background: "#1a1e28",
                        border: "1px solid #252a38",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        color: "#38c9b0",
                      }}
                    >
                      /pick
                    </code>{" "}
                    slash command in Claude Code. macOS only.
                  </p>
                  <CopyCommand />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section id="usage" style={{ padding: "80px 0", borderTop: "1px solid #1e2330" }}>
          <div style={{ width: "100%", maxWidth: "740px", margin: "0 auto", padding: "0 24px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "#4c8dff",
                marginBottom: "12px",
              }}
            >
              Using LayoutPick
            </p>
            <h2
              style={{
                fontSize: "1.65rem",
                fontWeight: 600,
                letterSpacing: "-.02em",
                color: "#fff",
                marginBottom: "12px",
                lineHeight: 1.25,
              }}
            >
              Quick reference
            </h2>
            <p style={{ fontSize: "1rem", color: "#7b8299", marginBottom: "40px" }}>
              Everything you need once it&apos;s installed.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <div
                style={{
                  background: "#13161d",
                  border: "1px solid #252a38",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <div style={{ fontSize: "20px", marginBottom: "12px" }}>🖱</div>
                <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>
                  Pick an element
                </h3>
                <p style={{ fontSize: ".9rem", color: "#7b8299", lineHeight: 1.6 }}>
                  Press{" "}
                  <kbd
                    style={{
                      display: "inline-block",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "12px",
                      background: "#1a1e28",
                      border: "1px solid #252a38",
                      borderBottom: "2px solid #252a38",
                      borderRadius: "4px",
                      padding: "2px 7px",
                      color: "#7b8299",
                    }}
                  >
                    Alt+S
                  </kbd>{" "}
                  or click the toolbar icon to enter pick mode. Hover to preview, click to capture. Press{" "}
                  <kbd
                    style={{
                      display: "inline-block",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "12px",
                      background: "#1a1e28",
                      border: "1px solid #252a38",
                      borderBottom: "2px solid #252a38",
                      borderRadius: "4px",
                      padding: "2px 7px",
                      color: "#7b8299",
                    }}
                  >
                    Esc
                  </kbd>{" "}
                  to cancel.
                </p>
              </div>

              <div
                style={{
                  background: "#13161d",
                  border: "1px solid #252a38",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <div style={{ fontSize: "20px", marginBottom: "12px" }}>⚡</div>
                <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>
                  Send to Claude Code
                </h3>
                <p style={{ fontSize: ".9rem", color: "#7b8299", lineHeight: 1.6 }}>
                  In Claude Code, run{" "}
                  <code
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: ".85em",
                      background: "#1a1e28",
                      border: "1px solid #252a38",
                      borderRadius: "4px",
                      padding: "1px 6px",
                      color: "#38c9b0",
                    }}
                  >
                    /pick
                  </code>{" "}
                  to inject the last captured element — markdown + screenshot — into the current conversation.
                </p>
              </div>

              <div
                style={{
                  background: "#13161d",
                  border: "1px solid #252a38",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <div style={{ fontSize: "20px", marginBottom: "12px" }}>📦</div>
                <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>
                  Send multiple
                </h3>
                <p style={{ fontSize: ".9rem", color: "#7b8299", lineHeight: 1.6 }}>
                  Pick several elements in a row, then run{" "}
                  <code
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: ".85em",
                      background: "#1a1e28",
                      border: "1px solid #252a38",
                      borderRadius: "4px",
                      padding: "1px 6px",
                      color: "#38c9b0",
                    }}
                  >
                    /pick 3
                  </code>{" "}
                  (or any number) to send the last <em>n</em> captures at once.
                </p>
              </div>

              <div
                style={{
                  background: "#13161d",
                  border: "1px solid #252a38",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <div style={{ fontSize: "20px", marginBottom: "12px" }}>🔌</div>
                <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>
                  No cloud required
                </h3>
                <p style={{ fontSize: ".9rem", color: "#7b8299", lineHeight: 1.6 }}>
                  Everything stays local. The extension talks to the native host via Chrome&apos;s native
                  messaging API — no data leaves your machine.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e2330", padding: "36px 0" }}>
        <div style={{ width: "100%", maxWidth: "740px", margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#7b8299" }}>LayoutPick</span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#454d66",
                  background: "#13161d",
                  border: "1px solid #1e2330",
                  borderRadius: "20px",
                  padding: "3px 10px",
                }}
              >
                macOS + Chrome
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <a
                href="https://github.com/layoutpick/layoutpick"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "13px",
                  color: "#454d66",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M7.5.5a7 7 0 0 0-2.213 13.638c.35.065.479-.152.479-.337 0-.166-.007-.72-.01-1.31C3.78 12.87 3.38 11.39 3.38 11.39c-.317-.807-.776-1.022-.776-1.022-.634-.433.048-.424.048-.424.7.049 1.069.72 1.069.72.623 1.066 1.634.758 2.032.58.063-.452.243-.758.443-.933-1.553-.177-3.185-.777-3.185-3.456 0-.763.272-1.388.72-1.878-.073-.177-.312-.888.068-1.851 0 0 .587-.188 1.924.718A6.7 6.7 0 0 1 7.5 3.517c.596.003 1.196.08 1.756.237 1.336-.906 1.922-.718 1.922-.718.381.963.141 1.674.069 1.851.449.49.72 1.115.72 1.878 0 2.686-1.635 3.277-3.193 3.45.251.216.475.643.475 1.296 0 .935-.009 1.689-.009 1.919 0 .186.127.405.482.336A7 7 0 0 0 7.5.5Z"
                    fill="currentColor"
                  />
                </svg>
                GitHub
              </a>
              <a
                href="https://chromewebstore.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "13px", color: "#454d66", textDecoration: "none" }}
              >
                Chrome Extension
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
