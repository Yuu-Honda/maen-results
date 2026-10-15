# Codex workflow follow-up · 15 October 2026

**Verdict: PASS. No remaining actionable UI findings.**

Reviewer: workflow_animation Codex subagent, the initial workflow UI implementation author. This is a follow-up regression check; it is not an independent initial code review. Root's separate independent Codex review and actual Claude review are recorded elsewhere.

Scope: root's final four-file deltas, including always-readable provisional/unknown reference badges, completed scroll landmarks, MCF7/12-hour scope, short-window progress, and the separate audit-status aside. Implementation files were only read in this follow-up; the two review files are the only written repository artifacts.

## Evidence

- 12 Chrome cases: Japanese and English at 1440×1000, 320×740, 844×390; 320px reduced motion and no JavaScript; and 844×390 print.
- Two additional 320px cases opened the audit and count details in Japanese and English. Total: **14 browser cases**.
- At the first visible stage3 frame (p approximately 0.5), all three reference labels had opacity 1 and visible computed visibility. The provisional label and both unresolved/retained labels remain present.
- All four buttons landed on their corresponding stages. Requested bars and comparison fill reached their completed representations at their respective landmarks. Stage3 positions were within 0.1 CSS pixel of final; the maximum residual was 0.02783 CSS pixel. Maximum requested-bar scale deviation was 0.00121 (0.121%), consistent with fractional scroll rounding and visually below one CSS pixel.
- All six animated cases remained unchanged while stationary. No page errors, document overflow, or workflow/audit descendant overflow occurred.
- Reduced motion, no JavaScript and print kept all four panels visible, without aria-hidden content or displayed animation controls.
- The separate expanded audit aside used scoped `wf-audit` styling without mobile overflow. Both languages explicitly state that no new independent retrieval result has been produced.
- Actual count labels remain **74 + 4** for scoreability and **30 + 48** for name correspondence, both over the same 78 conditions. These remain separate from the invented A/B/C and X/Y/Z visuals.

The short-landscape finding (roughly ±6.74px of unfinished sorting after a stage3 jump) was reproduced and reported to root, then resolved by root's revised local-progress denominator. No implementation edit was made by this reviewer during this follow-up.

## Reviewed file SHA-256

| File | SHA-256 |
|---|---|
| `workflow.js` | `ad0f9d6ac83e52a267b9985d2c267a0351a9504a4f90151b18f85b9d074a6f74` |
| `workflow.css` | `d7adfc199e091cf4277df1fe9ac5b95778824addd13bcd7d9ad6df8e597ad166` |
| `index.html` | `39057495a384efb6458921a407e3a1f7cb605abd2dc3dd539c1cc88c369b4973` |
| `en.html` | `854daf1e2dbb3b5fb93bd8381c8e2496a2b8bd1912203ce37da6f5272ae3f12b` |

Hashes were checked again before saving this record and matched the browser-run snapshot. Detailed observed values are in the paired JSON. This UI check did not rerun scientific analyses or independently establish the source science in the audit aside.
