# 更新履歴

## 2026-10-27

2026-10-27：**保存済み2成分スコアの全参照ペア診断を追加しました。** 6問い合わせ等重みの単独1位率は実RNA55.6%、旧入替え1通り65.7%、一定ラベル基準50.0%。参照組によって2/6件が変わりますが偏りは残り、実RNAの利点は示せません。全14組・28判定は独立実験ではありません。旧結果・CSS・スクロール動作は保持し、新RNAや食品・抗がんの効果は評価していません。[日本語](https://yuu-honda.github.io/maen-results/rna.html#reference-diagnostic) / [English](https://yuu-honda.github.io/maen-results/rna-en.html#reference-diagnostic) / [集計JSON](data/rna-reference-summary.json) / [metadata可用性](data/rna-gap-metadata-summary.json)。

Saved-score reference-pair diagnostic: query-equal top-1 is 55.6% observed and 65.7% for one retained gene permutation; both pooled summaries are 17/28. These are dependent recombinations of six queries, with no demonstrated RNA advantage or food/treatment efficacy. Earlier results and scroll controls are preserved.


## 2026-10-24 — 固定した陽性対照4ラベルのRNA検索

事前固定・二社検査・commit/push後の単回取得で、実RNAは11/12件（91.7%）を完全識別しました。遺伝子位置入替え20通りの平均は27.5%（範囲1〜6/12）、4定数対照は各3/12、位置metadata対照は2/12（同点10件）。全12件の突合は両方正解1・RNAのみ正解10・位置のみ正解1・両方不正解0です。

日英ページに全体・ラベル別・全seed・全6候補/9細胞の選択経緯と限界を追加。11/12を主結果とし、注釈群の緩和一致12/12は副指標として区別しました。旧2成分3/6と旧2017版の記録は不変です。同じデータ内で選んだ陽性対照の技術検査であり、食品や治療の効果・独立施設での検証は示しません。[検査記録](reviews/rna-positive-2026-10-24.md)

English: A fixed four-label positive-control panel recovered 11/12 exact labels. Twenty fixed gene permutations averaged 27.5% (1–6/12); each constant-label control recovered 3/12; the position rule recovered 2/12 with ten ties. All twelve queries were joined: both correct 1, RNA only 10, position only 1, both wrong 0. This selected same-dataset technical check does not revise the earlier everyday-compound result or establish food/treatment efficacy.

## 2026-10-24 — 同じ2020公開版でのRNA追加照合

現在のmetadata全体から定義した2成分・6問い合わせ・12参照の別計画を一度実行しました。実RNAは単独1位3/6・MRR0.75、固定した遺伝子位置入替え対照も3/6・MRR0.75。実RNAはカフェイン0/3、ケルセチン3/3で、全6件でケルセチン側が上位になる偏りがありました。この条件でRNAを使う利点は示せませんでした。

日英のRNAページに全体・成分別結果と限界を追加しました。旧2017版の185/210、旧版間対応の未実施、全8成分の対応状態を保持しています。同じ配布版は独立した生物学的検証ではなく、食品・治療の効果は未確認です。[今回の検査記録](reviews/rna-current-2026-10-24.md)

English: A separate current-release comparison used two labels, six queries and twelve references. Observed and fixed-permutation matching both recovered 3/6 labels (MRR 0.75). Observed matching preferred quercetin for every query: caffeine 0/3, quercetin 3/3. This did not demonstrate an RNA advantage under these conditions. Older results and the failed cross-release gate remain historical records.

## 2026-10-21 — 次のRNA比較の入力監査

旧2017版と公式2020再処理版のmetadataを照合しました。4成分35記録では署名ID29・全反復集合27が一致。構造式と記載化学IDを照合できた2成分15記録でも14・13にとどまり、全入力対応の条件を満たしませんでした。新しいRNA数値照合を実行せず、日英ページに未実施・版の違い・不一致件数を追加しています。旧RNA結果と全8例の記録は保持しています。[今回の検査](reviews/rna-crossgroup-2026-10-21.md)

English: Audited legacy-to-2020 metadata correspondence. Neither the four-label (27/35 full replicate sets) nor the two-label (13/15) proposal met the complete input gate. No new RNA retrieval was run and no new success rate or MRR was calculated. Existing results remain unchanged.

## 2026-10-21 — RNA実測検索と同研究内診断への続編

GSE70138（2017-03-06）の厳密構造対応5成分・339署名から直接測定978ランドマーク遺伝子を取り込み、別のローカル研究用CLIで望むRNA方向や実測プロファイルを照合する処理へ進めました。同じ研究・同じ細胞の別濃度を比べる210件の記述的診断を、日英のRNA専用ページへ分け、トップと資料照合ページから導線を追加しました。サイトでは固定した研究デモと集計のみを表示し、入力や検索計算は受け付けません。

測定群ラベルだけでも210/210件で同じ成分を特定できるため、この診断ではRNA変化と測定群の手掛かりを切り分けられません。独立した性能として扱わず、正常状態の目標は未設定、食品の効果・人体への到達は未検証、旧タンパク質検索とは未接続であることを併記します。既存の821行などは2リリースのメタデータ照合の履歴として残し、今回の339署名とは置き換えません。旧RNAモデル・タンパク質検索・ベンチマーク・以前の更新履歴本文は保持しました。[今回の二社検査と表示確認](reviews/rna-2026-10-21.md)

English: Added routes to a separate RNA lookup record using 339 signatures and 978 directly measured landmark genes for five constituents. The 210-query adjacent-dose diagnostic is within-source and confounded: measurement-group labels alone identify the same constituent in all 210 queries. It does not establish independent performance, a healthy-state target or food benefits, and is not connected to the protein search. Earlier two-release metadata counts and existing benchmarks remain historical records.

## 2026-10-21 — 身近な8成分と公開測定資料の対応を追加

日英の専用ページに、由来の出典、化学形の照合、PRISM資料との対応、LINCSの2公開版の署名メタデータ行数を追加しました。全8例を保持し、参照構造対応821行・立体未指定304行・名前のみ等168行を分けています。独立した条件・実験・効果の数ではありません。RNA値や逆検索は未実施で、追加タンパク質資料も数値取込み前の保留です。見出し確認で補足PDFの数値2行が偶発表示された範囲を開示しました。

4段階の模式図は、下へスクロールで進み、上へ戻ると巻き戻り、止めると止まります。静止表示・JavaScript無効にも対応。トップページには案内だけを追加し、旧本文・集計JSON・共通CSS/JSは保持しています。独立Codexと実Claudeによる静的検査・修正後の再確認を記録し、Chromeで日英32表示条件を確認しました。[検査記録](reviews/everyday-2026-10-21.md)

English: Added an eight-reference source map with separate chemical-identity states and release-specific LINCS signature metadata rows, plus a reversible scroll explanation. These are availability records, not independent experiments, efficacy results or food recommendations. Existing scientific results and shared assets are unchanged.

## 2026-10-15 — 接続の流れを4段階のスクロール図で説明

日英の接続節に、指定したタンパク質量の差、既存条件との比較、順位を変えずに名称対応の参照を添える処理、未確認事項を残す処理を追加しました。架空のA/B/C・X/Y/Zによる模式図と、既存デモの74＋4／30＋48という同じ78条件の二分類を分けています。下へ進む・上へ戻る・止めて読む操作に対応し、画面に収まらない場合、動き軽減、JavaScript無効、印刷では全文を読めます。

物質参照・BRP・KSR1・decryptEの条件監査の進捗も追加しました。新しい独立検索の数値結果はありません。既存の文章・6説明図・科学的数値・集計JSON・共通CSS/JSは保持しています。検査・修正の証跡は [今回のレビュー記録](reviews/workflow-2026-10-15.md) に保存します。

English: Added a four-stage reversible scroll explanation of the exploratory connector, with fictional diagrams separated from the unchanged demo counts. Added metadata-readiness progress without claiming new independent retrieval results. Existing scientific content, aggregates and shared assets are preserved.

## 2026-10-13 — タンパク質署名と既存応答の根拠を接続

日英ページに、現在／目標のタンパク質量の差分作成、既存78条件の検索、PRISM・CTRPの暫定的な名称参照、未評価項目を残す流れを追加しました。30条件の名称注釈対応と48条件の未解決を区別し、化学的同一性未確認、集計にないことと無効・未測定の違い、正常化・曝露等の未評価を明記しています。検索は別の研究用CLIで、サイトには入力や計算サーバーを追加していません。

元S3先頭の使用済み署名を使う接続デモの集計を追加しました。新しい精度・薬効の評価ではありません。既存の科学的本文・SVG・集計JSON・CSS/JSは保持。Codexと実Claudeの検査・指摘修正後の公開処理はPASS、全164ローカルテストと日英24表示条件464検査が成功しました。

English: Added an exploratory workflow section linking protein signatures to measured-condition retrieval and provisional response references, with unresolved identities and unassessed validation axes retained. The fixed, previously used S3 query is a functional demo, not new efficacy or independent performance evidence. Existing scientific sections, SVGs, aggregates and runtime assets are unchanged.

## 2026-10-08 — 説明図をスクロールで操作

6つの説明図を、画面に入った際の自動再生から、ページのスクロール位置で直接操作する形に変更しました。下へスクロールすると進み、上へ戻すと巻き戻り、ページが止まると図もその位置で止まります。図が画面に収まる場合は表示を留め、「最初へ戻る」「最後へ進む」と例の切り替えボタンでも該当位置へ移動できます。画面が低い場合は通常のページ表示を保ちます。

順位相関・分離度の中間配置には完成例の数値を表示せず、完成した配置でだけ対応する説明を出します。実集計の補助対照は静止表示のままにし、スクロールは説明の順序を操作するもので実験の時間経過ではないと明記しました。JavaScript無効・動きを減らす設定・印刷では最終状態を表示します。既存のHTML/SVG・科学的な本文・集計JSON・サイト共通CSS/JSはバイト単位で保持しています。

English: The six diagrams now follow document scroll position: down advances, up rewinds, and stopping the page holds the current frame. Fitting diagrams stay visible while scrolling; example buttons jump to completed landmarks. Intermediate rank/separation arrangements hide endpoint metrics. Scrolling controls explanation order, not experimental time. No-JS, reduced-motion and print retain static final views. Existing HTML/SVG, scientific text, aggregate JSON and shared site CSS/JS are unchanged.

## 2026-10-08 — 説明用の動く図を追加

専門的な内容を直感的に読めるよう、日英サイトに6つの説明図を追加しました。転用候補の節に「3段階のふるい」「①の分類」「②③の分離度と補助対照」「vemurafenib の一次 hit と皮膚由来の注釈」、外部評価の節に「順位相関 ρ」、タンパク質の節に「逆検索の並べ替え」です。

図は画面に入ると一度だけ再生され、「もう一度再生」と切り替えボタンで見直せます。考え方を示す図は「模式図」、集計した数をそのまま使う図は「実データ」と明記しました。数値は既存の集計のままで、文言は訂正後の用語（一次 hit、相対感受性、補助対照、skin＝皮膚由来の注釈）に合わせています。細胞死や機序、p値を示す図ではありません。

動きを減らす設定と JavaScript 無効の環境では、各図の最後の状態を静止表示します。日英 × 320/390/768/1024/1440px × 通常・JavaScript 無効・動き軽減の30条件で、横のはみ出し・表示エラーがなく、最後の状態と切り替え操作が正しいことを確認しました。既存の数値・表・集計 JSON は変更していません。

Codexの独立検査で、一次 hit が5株未満の分類を「ほとんど効かない」としない表現へ訂正し、順位の軸を比較対象に共通の A/B にしました。二次638件・未判定72件、CTRP105件・通過54件・両方通過50件の区別と、分離度で同順位を0.5と数える説明を追記しました。途中の切り替え、閲覧中の動き軽減設定の変更、手動停止後の自動再生との競合を修正し、「最後の状態を表示」ボタンと印刷時の静止表示を加えました。既存の集計・数値・SVGの座標は保持しています。

English: Added six explanatory figures that play once when scrolled into view, with replay and toggle buttons: the three-step filter, step-1 classes, separation with the auxiliary shuffle control, vemurafenib primary hits and the skin-derived annotation, rank correlation ρ, and protein reverse-search reordering. Figures are labeled as schematic or real data, use the corrected terms, and show their final state without JavaScript or with reduced motion. Existing numbers, tables and JSON are unchanged.

## 2026-10-07 — 転用候補の解釈・注釈と表示を訂正

日英サイト・紹介カード・表見出し・READMEを、生細胞量指標と感受性の相対順位に基づく説明へ訂正しました。viabilityは増殖停止と細胞死を区別せず、二次とCTRPは絶対効果や細胞死の再現を判定していないことを明記しました。一回のshuffleは補助対照で、個別p値・真陽性率・FDRを推定していません。一次2.5 µMは名目で、実際の記録濃度の幅と由来系列依存を補正しない記述的区間も説明しました。

47は旧HubのLaunchedと用途注釈による集合として表示し、現行の国別・ヒト用非がん承認は未照合、動物用やがん適応を持つ配合剤の例を含むことを公的資料へのリンク付きで追記しました。皮膚由来の注釈からメラノーマやBRAF変異を推定せず、共通クラスは機序仮説に留めます。47/50の表の行・数値・順序、集計JSONの数値、旧RNA・タンパク質・転移診断の結果は変更していません。

公開ページの再検査では英語820pxでヘッダーの言語表示が切れることを確認しました。コンパクトなメニューを900pxまで使うCSSを追加しました。以下の追加記録も訂正後の用語へ統一しています。

English: Corrected the narrative to viable-cell signal and relative sensitivity ranks. The endpoint does not establish cell death; secondary and CTRP rules do not confirm absolute effects. The single shuffle provides no candidate-specific p-values or FDR. The 47-compound set is a historical Hub annotation group, not a verified list of current human-approved non-cancer drugs. Values, table order and frozen numeric results remain unchanged. Added a compact header layout for intermediate widths after finding clipping at 820px.

## 2026-10-07 — 既存薬の転用候補を追加

日英サイトに転用候補を探した結果の節を追加しました。PRISM Repurposing 19Q4（4,532化合物 × 568株）で、一次の生細胞量指標が一部の株で対照比30%未満となる710化合物を選びました。二次の相対順位基準は判定可能638のうち311、CTRPは105のうち54が満たし、両方を満たしたのは50です。一回のshuffle補助対照では二次8、CTRP 1が通りました。

旧HubのLaunchedと用途注釈で選んだ47ではsimvastatinとnintedanibが両方の基準を満たしました。陽性対照5剤のうち3剤が基準を満たし、disulfiramとtepoxalinは二次で基準未達でした。判定基準はデータ取得前のcommit `bc4ed8c`で固定しました。v1a（`78c4032`）は配布元説明の読取り後・応答値アクセス前、v1b（`4070bc2`）はinventoryの行ラベル処理で停止した後・応答統計前の修正です。v1bをすべての値アクセス前とは扱いません。一度だけ実行しています。

培養がん細胞での結果で、人での効果・安全性・曝露・正常細胞への影響は未確認です。免責事項の提供元にBroad Institute（PRISM Repurposing・CTRP）とNCI CTD² Networkを加えました。公開JSONは化合物単位の集計だけで、細胞株のIDや値は含みません。

追加時の検査記録は日英16条件でした。その後の公開ページ20条件の再検査で英語820pxの横溢れが判明し、上の訂正で対応しました。既存の節の数値と集計JSONは変更していません。

English: Added the PRISM/CTRP repurposing section: 710 primary-selected compounds, 311 of 638 meeting the secondary rank rule, 54 of 105 meeting CTRP, and 50 meeting both. A single auxiliary shuffle yielded 8 and 1 passes. Three of five controls met expectation. The initial protocol was frozen before data acquisition; v1a preceded response-value access, while v1b followed an inventory row-label stop and preceded response statistics. The evaluation ran once. Results concern cultured-cell viability and relative sensitivity, not human efficacy, safety or exposure.

## 2026-10-07 — 転移診断の結果を追加

日英サイトに4問の開発診断と、全6薬剤の表、記述的区間、件数、未定義の状態を追加しました。RNAを替えた18株の予測順位は保持されますが、水準差は残り、外部RNA優位未確認を維持します。測定差を原因や精度の天井とは扱いません。

v2の時間制限停止と原応答・RNAのプログラムアクセス、v3の読み取りだけの修正を開示しました。v3は結果計算前のcommit `b621429`に固定し、26入力を照合して約20.989秒で実行。公開JSONは集計欄を明示的に選び、細胞ID・全profile・個別応答/予測を含めません。

既存の外部評価・RNA開発評価・タンパク質検索の集計、最新のアニメーション・アイコン・免責事項を保持しています。次の性能確認はendpoint・測定条件を確認した未使用データで行う方針です。

別実装の順位・bootstrap監査で11,233件を照合し、問題0・数値差0でした。これは同じデータでの計算整合性確認で、新しい独立性能評価ではありません。

日英320〜1440px、JavaScript無し、集計取得失敗、動きを減らす設定を含む44ブラウザケースと、ヘッダー12ケースを確認しました。既存のタンパク質指標/方向の切替、外部評価の数値、メニューと表のスクロールも保持しています。

English: Added four descriptive transfer diagnostics and every drug’s counts, correlations and undefined states. High frozen-output rank agreement in18cells does not establish response accuracy or remove level shifts. The v2 timeout and subsequent one-pass v3 registration are disclosed; original results and the current design remain intact. No causal obstacle or external RNA advantage is established.

## 2026-10-07 — サイトの見直しと修正

公開サイト（日本語・英語）の免責事項、出典、見やすさ、デザインを修正しました。数値、集計JSON、評価結果、方法の説明は変更していません。

### 免責事項
- 要点（AIで運用する個人の記録、専門家の監修・査読なし、医療上の助言ではない、正確性を保証しない、利用による損害の責任を負わない、データ提供元とは無関係）を、折りたたまずに常に表示するようにした。
- ページ内の「免責事項」へのリンクから移動したとき、全文が自動で開くようにした。
- フッターとREADMEに「掲載内容の利用により生じた損害について責任を負わない」旨を戻した。
- 「NCIとは無関係」を「データ提供元とは無関係」に広げ、GDSC・Cell Model Passports（ウェルカム・サンガー研究所など）、MCF7タンパク質研究の論文著者・掲載誌、ProteomeXchangeも明記した。

### 出典
- 「データの一次資料」に、GDSC1 release 8.5、Cell Model Passports RNA-seq（2019-11-01）、サンガー研究所のデータ利用方針を追加した。
- 外部評価欄のリンクを、大容量ファイル（Excel約29MB、zip）の直接ダウンロードから説明ページに変更した。原ファイルへのリンクは、一次資料の一覧にサイズを付けて残した。

### 見やすさ
- 文字サイズの下限を引き上げた（本文・注記は13〜14px、ラベルは11.5px以上）。表示される文字のうち11px以下の割合は、スマホで約60%から約1%、PCで約34%から約1%になった。
- スマホで外部評価の表が画面に収まるようにした（幅390px・360pxで確認。320pxでは少し横スクロール）。「組織・固定」と同じ値の「組織・CV」列はスマホでは省略し、その旨を表の下に書いた。

### 表記
- 外部評価の区間を「95% CI」「95%信頼区間」から「95%区間」「95%記述的区間」に揃えた。説明文の「記述的bootstrap区間」と合わせるため。
- 冒頭の数字「02」の説明を「公開データ / 2つの検証」から「検証ライン / RNA・タンパク質」に変えた。
- GitHubリポジトリへのリンクを削除した（作者の表示は名前のみ）。
- 英語版で免責事項の見出しだけ大きなセリフ体になっていたのを、日本語版と揃えた。
- site.css に残っていた作業用のコメントを削除した。

### デザイン
- メインビジュアルにアニメーションを追加した。細胞内の発現バーの変動と走査線、細胞の周りを回る点、候補へ流れる信号、正解の条件が3位から1位へ上がって確定する動き、下部の進行マーカー、「細胞の変化を読む」から「既知の条件を探す」へのラベルの切り替え。背景のグリッドと光もゆっくり動く。端末で動きを減らす設定にしている場合は、確定後の状態で静止して表示する。
- アイコンを「m.」のマークに作り直した。対象はファビコン、ヘッダーのロゴ、iPhoneのホーム画面用、Android用で、Androidの形の切り抜きに対応した版も追加した。古いアイコンが残らないよう、参照先にバージョンを付けた。

### 確認したこと
- 日英両ページを、PC（1280px）とスマホ（390・360・320px）で表示して確認した。横のはみ出し、JavaScriptのエラー、ページ内リンク、Top 1 / Top 5 / MRR と方向の切り替え（9通り）、メニュー、免責事項の自動展開。
- 表示している数値が集計JSON（`data/protein-summary.json`、`data/controls-summary.json`、`data/external-summary.json`、`summary.json`）と一致することを確認した。

---

## English summary — 2026-10-07

Site review and fixes. Numbers, aggregate JSON, results and method descriptions are unchanged.

- Disclaimer: key points (including no liability for damage from use) are always visible; links to the disclaimer open the full text; the no-liability sentence is restored in the footer and README; non-affiliation now covers all data providers (NCI, GDSC and Cell Model Passports by the Wellcome Sanger Institute and partners, the MCF7 proteomics study authors and journal, ProteomeXchange).
- Sources: GDSC1 release 8.5, Cell Model Passports RNA-seq (2019-11-01) and the Sanger data usage policy were added to the source list; direct links to large files were replaced with documentation pages in the external-evaluation row.
- Readability: minimum text sizes were raised; the external-evaluation table fits narrow phones (the “Tissue, CV” column, identical to “Tissue, fixed”, is hidden there with a note).
- Wording: “95% CI” became “95% interval” to match the descriptive bootstrap intervals; the third hero figure now reads “research lines / RNA & protein”; the GitHub repository link was removed.
- Design: animated hero visual (respects reduced-motion settings) and a new “m.” icon set, including a maskable Android icon.
