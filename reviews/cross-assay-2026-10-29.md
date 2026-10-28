# Cross-assay metadata preflight: Codex / Claude review

2026-10-29 JST. Scope: metadata-only condition checks and additive JA/EN publication. This is not authorization to read RNA values, aggregate probes or run cross-assay retrieval.

Both providers returned PASS for the same 46-file source map. Required implementation defects found during development were corrected before this review: require two distinct verified shared labels; reject FIFO input without waiting; count a reason only once per record. Historical v1 metadata outputs remain archived; final publication uses v2.

| Reviewer | Scope and result |
|---|---|
| Independent OpenAI Codex agent | PASS. Verified all 46 file hashes; independently recomputed metadata availability and v2 output. Fraction implementation agreed on 1,000 synthetic cases. |
| Actual Anthropic Claude, native app, Opus 5.5 中 | PASS. Static review of v1 code, docs, evidence summaries and new HTML additions, followed by the v2 CHANGELOG-only delta. Unchanged source content was not reread in full in v2. No execution, downloads, screenshot observation or SHA recomputation by Claude. |

- Source manifest SHA256: `28ae7717ee23ea2e8acfa42981f0289cc4d7ba4d7700222c7b039f04ed4bb403`
- Claude attachment SHA256: `7c0d6999a63c3b2b6e67248f2db1b8d50635d46341e60a7a40a597408166b1b5`
- Independent review metadata SHA256: `bb2131befe113ec3b1c769aad23fbbbd3d2c8651cd909de0c14ec46df7327236`
- Independent review text SHA256: `872e1a6a73aaa89e69d2b45b04383da0ae7d2bf2b9e35c61882333f51f312d8a`
- Claude review transcript SHA256: `160a7bd6bef50c59f33bc65add5cd06ec2c955b98e8332c6d43c7962c9a6b284`
- Claude review metadata SHA256: `a5f7472f40f1776cc56ebf1e4570eb4bab913b21414c36efa5e64c610b256c90`

The private repository retains full review evidence and source hashes. Claude initially requested one correction to the CHANGELOG date grouping; the corrected v2 delta was reviewed against the new exact map. Optional improvements remain recorded as future work. This attestation is a separate record created after review; it does not include its own hash in the reviewed map. The Claude text is a normalized record preserving the verdict and substantive findings of the completed response observed through the authenticated app, not a raw platform export. Unchanged old HTML was omitted from its attachment; restoration proofs and fixed old-file hashes support preservation. Detailed raw browser QA was summarized with original hashes.

Final checks: 28 new synthetic metadata tests, 8 previous synthetic gene-site tests, and 32/32 JA/EN browser cases (320/375/768/1440, JavaScript on/off, reduced motion on/off). Old scroll forward/reverse/stopped states and old gene section DOM were preserved. Fifty frozen scientific files plus three freeze manifests, nine previous RNA aggregates and six shared CSS/JS files retain their hashes. AI code and wording review is not biological or clinical independent validation.

Within the checked finite inventory, the old five-compound catalog and TempO's nine compounds share only caffeine. Old catalog caffeine has 42 signatures at 24 h; the checked 2020 metadata has 12 signature records at matching nominal cell labels and 6 h but zero exact-dose matches to TempO. These are records, not independent experiments. This is not a search over all LINCS, and original-study manifest identity remains unconfirmed within the public sources examined. No new RNA values, scores, food, treatment or anticancer effects were evaluated.
