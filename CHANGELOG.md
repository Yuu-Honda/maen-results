# 更新履歴

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
