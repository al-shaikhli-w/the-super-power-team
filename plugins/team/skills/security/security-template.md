# Security — <project name>

**Updated:** <YYYY-MM-DD> · **By:** team:security-engineer · **Open:** <n> (<high> high · <medium> medium · <low> low)

Your security to-do list. Tick nothing by hand — the security engineer ticks an item when a scan or a merged ticket proves it fixed. Fix one with `/team-security fix SEC-<n>`.

## Picture
- **What it is:** <one line>
- **What it protects:** <user accounts, payments, personal data, …>
- **Doors (entry points):** <web pages, API routes, webhooks, CLI, jobs>
- **Who may do what:** <roles, in one or two lines>

## TODO
<!-- - [ ] SEC-<n> · <high|medium|low> · <A01–A10> · <title> — <file:line> — <fix in one line> — <S|M|L>
       - Risk: <who can do what, in plain words> · Where: <part of the app, no path> · <CWE-<n>> · Found: <YYYY-MM-DD> -->

## OWASP checks
One block per category; every check a line. `[x]` passed, `[ ]` failed (name the SEC item), `[?]` not checked yet, `[-]` does not apply (say why). A whole category that does not apply: `n/a — <why>` under its heading.

### A01 Broken Access Control
- [x] <the server checks who may do what on every route>
- [ ] <users reach only their own data> — SEC-<n>
- [-] <the server never fetches a user-given URL> — <no outgoing requests>

<!-- A02 … A10 the same way -->

## OWASP Top 10:2025
The category of each item. Source: https://owasp.org/Top10/2025/
A01 Broken Access Control · A02 Security Misconfiguration · A03 Software Supply Chain Failures · A04 Cryptographic Failures · A05 Injection · A06 Insecure Design · A07 Authentication Failures · A08 Software or Data Integrity Failures · A09 Security Logging and Alerting Failures · A10 Mishandling of Exceptional Conditions

## Good already
- <what the project does right>

## Not checked
- <what could not be checked, and why>
